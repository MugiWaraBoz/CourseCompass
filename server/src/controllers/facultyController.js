const ObjectId = require('mongodb').ObjectId;
const database = require('../config/connect');
// Get all faculties with optional filters, sorting, and pagination
const getFaculties = async (req, res) => {
  let db = database.getDb();

  const { search, department, designation, sortBy, order, page, limit } =
    req.query;

  const filter = {};

  if (department) {
    filter.department = department;
  }

  if (designation) {
    filter.designation = designation;
  }

  if (search) {
    /*
            The $or operator is used to perform a logical OR operation on an array of conditions.
            In this case, it is used to search for courses where either the name or code matches the search term.
        */
    filter.$or = [
      /*
                regex is used to perform pattern matching in MongoDB queries.
                In this case, it is used to search for courses where the name or code 
                contains the search term, regardless of case (case insensitive).
            */
      { name: { $regex: search, $options: 'i' } }, // i = case insensitive
      { shortCode: { $regex: search, $options: 'i' } }, // i = case insensitive
    ];
  }

  const sort = {};
  if (sortBy == 'rating') {
    sort['avgRating'] = order === 'desc' ? -1 : 1;
  } else {
    sort[sortBy] = order === 'desc' ? -1 : 1;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  let data = await db
    .collection('Faculty')
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limitNumber)
    .toArray();

  const total = await db.collection('Faculty').countDocuments(filter);

  if (data.length > 0) {
    res.status(200).json({
      success: true,
      data: {
        faculty: data,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
    });
  } else {
    res.status(200).json({
      success: true,
      data: {
        faculty: [],
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total: 0,
          totalPages: 0,
        },
      },
    });
  }
};

// Get a single faculty by ID
const getFaculty = async (req, res) => {
  let db = database.getDb();
  let data = await db
    .collection('Faculty')
    .findOne({ _id: new ObjectId(req.params.id) });
  if (data) {
    res.status(200).json({
      success: true,
      data: data,
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Faculty not found',
      },
    });
  }
};

// Get reviews for a specific faculty with optional filters, sorting, and pagination
const getFacultyReview = async (req, res) => {
  let db = database.getDb();

  const { courseId, sortBy, order = 'desc', page, limit } = req.query;

  const filter = {
    facultyId: new ObjectId(req.params.id),
    isApproved: true,
  };

  if (courseId) {
    filter.courseId = new ObjectId(courseId);
  }

  const sort = {};
  if (sortBy === 'recent') {
    sort['createdAt'] = order === 'desc' ? -1 : 1;
  }
  if (sortBy === 'votes') {
    sort['votescore'] = order === 'desc' ? -1 : 1;
  } else {
    sort[sortBy] = order === 'desc' ? -1 : 1;
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  /*
        The aggregation pipeline is used to perform complex data transformations and computations in MongoDB.
        for anonymity, if the review is anonymous, the author name will be set to "Anonymous", otherwise it will be set to the student's name.
    */
  let reviews = await db
    .collection('Review')
    .aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'Student',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $unwind: {
          path: '$student',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          verified: '$student.verified',
          author: {
            $cond: {
              if: { $eq: ['$isAnonymous', true] },
              then: {
                name: 'Anonymous',
              },
              else: {
                name: '$student.name',
              },
            },
          },
        },
      },
      {
        $project: {
          studentId: 0,
          student: 0,
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limitNumber,
      },
    ])
    .toArray();

  // console.log(reviews);
  // console.log("faculty param:", req.params.id);
  // console.log("filter:", filter);
  // console.log("sample review:", await db.collection("Review").findOne({}));

  const total = await db.collection('Review').countDocuments(filter);

  if (reviews) {
    res.status(200).json({
      success: true,
      data: {
        reviews: reviews,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
    });
  } else {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching reviews',
      },
    });
  }
};
const getFacultyReviewsAdmin = async (req, res) => {
  let db = database.getDb();
  let facultyId = req.params.id;
  // console.log("facultyId:", req.params);
  try {
    const reviews = await db
      .collection('Review')
      .find({ facultyId: new ObjectId(facultyId) })
      .toArray();
    return res.status(200).json({
      success: true,
      data: {
        reviews: reviews,
      },
    });
  } catch {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'No reviews found for this faculty',
      },
    });
  }
};

// add faculty
const addFaculty = async (req, res) => {
  let db = database.getDb();
  const { name, shortCode, department, about, designation } = req.body;

  let existingFaculty = await db
    .collection('Faculty')
    .findOne({ shortCode: shortCode });
  try {
    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'FACULTY_EXISTS',
          message: 'Faculty with this code already exists',
        },
      });
    }

    let newFaculty = {
      name,
      shortCode,
      department,
      about,
      designation,
      avgRating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('Faculty').insertOne(newFaculty);
    return res.status(201).json({
      success: true,
      data: {
        message: 'Faculty added successfully',
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while adding the faculty',
      },
    });
  }
};

// Edit faculty
const updateFaculty = async (req, res) => {
  let db = database.getDb();
  let facultyId = req.params.id;
  let faculty = await db
    .collection('Faculty')
    .findOne({ _id: new ObjectId(facultyId) });
  if (!faculty) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Faculty not found',
      },
    });
  }

  const { name, shortCode, department, about, designation } = req.body;
  try {
    await db.collection('Faculty').updateOne(
      { _id: new ObjectId(facultyId) },
      {
        $set: {
          name: name || faculty.name,
          shortCode: shortCode || faculty.shortCode,
          department: department || faculty.department,
          about: about || faculty.about,
          designation: designation || faculty.designation,
          updatedAt: new Date(),
        },
      },
    );

    return res.status(200).json({
      success: true,
      data: {
        message: 'Faculty updated successfully',
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while updating the faculty',
      },
    });
  }
};
// Delete faculty
const deleteFaculty = async (req, res) => {
  let db = database.getDb();
  let facultyId = req.params.id;
  let faculty = await db
    .collection('Faculty')
    .findOne({ _id: new ObjectId(facultyId) });
  if (!faculty) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Faculty not found',
      },
    });
  }

  try {
    await db.collection('Faculty').deleteOne({ _id: new ObjectId(facultyId) });
    return res.status(200).json({
      success: true,
      data: {
        message: 'Faculty deleted successfully',
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while deleting the faculty',
      },
    });
  }
};

module.exports = {
  getFaculties,
  getFaculty,
  getFacultyReview,
  updateFaculty,
  deleteFaculty,
  addFaculty,
  getFacultyReviewsAdmin,
};
