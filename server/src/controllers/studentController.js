const ObjectId = require('mongodb').ObjectId;
const database = require('../config/connect');
const { encryptApiKey } = require('../utils/encryptionUtils');

// getStudent function to handle getting a student by studentId
const sanitizeStudent = (student) => {
  const safeStudent = { ...student };
  delete safeStudent.password;
  return safeStudent;
};

const getStudent = async (req, res) => {
  // console.log("req.params.studentId: ", req.params.studentId);
  let db = database.getDb();
  let data = await db.collection('Student').findOne({
    _id: new ObjectId(req.student._id),
  });

  let student = data;

  if (data) {
    return res.status(200).json({
      success: true,
      data: {
        student: student,
      },
    });
  } else {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Student not found',
      },
    });
  }
};
const getAStudent = async (req, res) => {
  let db = database.getDb();
  let studentId = req.params.studentId;
  let data = await db.collection('Student').findOne({
    _id: new ObjectId(studentId),
  });

  let student = data;
  delete student.password;
  delete student.apiKey;

  if (data) {
    return res.status(200).json({
      success: true,
      data: {
        student: student,
      },
    });
  } else {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Student not found',
      },
    });
  }
};
// patchStudent function to handle updating a student by studentId
const patchStudent = async (req, res) => {
  let db = database.getDb();

  const { name, cgpa, photoUrl } = req.body;

  let stdObj = {
    $set: {
      name: name,
      cgpa: cgpa,
      photoUrl: photoUrl,
    },
  };
  let data = await db
    .collection('Student')
    .findOneAndUpdate({ _id: new ObjectId(req.student._id) }, stdObj, {
      new: true,
    });
  //   console.log(data);

  let sanitizedData = sanitizeStudent(data);

  if (data) {
    res.status(200).json({
      success: true,
      data: {
        student: sanitizedData,
        message: 'Student updated successfully',
      },
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Student not found',
      },
    });
  }
};

// getStudentReviews function to handle getting all reviews by a student
const getStudentReviews = async (req, res) => {
  let db = database.getDb();
  const studentId = req.params.studentId || new ObjectId(req.student._id);

  // console.log("Student ID:", req.student._id);
  const { page, limit } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  let reviews = await db
    .collection('Review')
    .find({ studentId: studentId })
    .skip(skip)
    .limit(limitNumber)
    .toArray();

  let total = await db
    .collection('Review')
    .countDocuments({ studentId: studentId });

  if (reviews) {
    res.status(200).json({
      success: true,
      data: {
        reviews: reviews,
        message: 'Reviews fetched successfully',
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'No reviews found for this student',
      },
    });
  }
};
const getStudentReviewsAdmin = async (req, res) => {
  let db = database.getDb();
  let studentId = req.params.studentId;

  try {
    const reviews = await db.collection('Review').find({ studentId: new ObjectId(studentId) }).toArray();
    console.log(reviews);
    return res.status(200).json({
      success: true,
      data: {
        reviews: reviews
      }
    });
  } catch {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'No reviews found for this student',
      },
    });
  }

}

const setApiKey = async (req, res) => {
  let db = database.getDb();
  const { apiKey } = req.body;

  let hashedKey = encryptApiKey(apiKey);

  let data = await db.collection('Student').findOneAndUpdate(
    { _id: new ObjectId(req.student._id) },
    {
      $set: {
        apiKey: hashedKey,
        updatedAt: new Date(),
      },
    },
    { returnDocument: 'after' },
  );

  if (data) {
    res.status(200).json({
      success: true,
      data: {
        message: 'API key set successfully',
      },
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Student not found',
      },
    });
  }
};

const removeApiKey = async (req, res) => {
  let db = database.getDb();
  await db
    .collection('Student')
    .findOneAndUpdate(
      { _id: new ObjectId(req.student._id) },
      { $unset: { apiKey: '' }, $set: { updatedAt: new Date() } },
      { returnDocument: 'after' },
    );

  return res.status(200).json({
    success: true,
    data: {
      message: 'API key removed successfully',
    },
  });
};

// Get all students
const getAllStudents = async (req, res) => {
  let db = database.getDb();
  const { page, limit } = req.query;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const search = req.query.search || '';

  const filter = {};

  if (search) {
    /*
            The $or operator is used to perform a logical OR operation on an array of conditions.
            In this case, it is used to search for Students where either the name or ID matches the search term.
        */
    filter.$or = [
      /*
                regex is used to perform pattern matching in MongoDB queries.
                In this case, it is used to search for courses where the name or code 
                contains the search term, regardless of case (case insensitive).
            */
      { name: { $regex: search, $options: 'i' } }, // i = case insensitive
      { studentIdNumber: { $regex: search, $options: 'i' } }, // i = case insensitive
    ];
  }

  const skip = (pageNumber - 1) * limitNumber;

  let data = await db
    .collection('Student')
    .find(filter)
    .skip(skip)
    .limit(limitNumber)
    .toArray();

  if (data) {
    res.status(200).json({
      success: true,
      data: {
        students: data,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
        },
        message: 'Students fetched successfully',
      },
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Students not found',
      },
    });
  }
};

// change verify status of student photo
const changeVerifyStatus = async (req, res) => {
  let db = database.getDb();
  const { studentId } = req.params;
  const { verified } = req.body;

  let data = await db
    .collection('Student')
    .findOneAndUpdate(
      { _id: new ObjectId(studentId) },
      { $set: { verified, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );

  if (data) {
    res.status(200).json({
      success: true,
      data: {
        message: 'Student photo verification updated successfully',
      },
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Student not found',
      },
    });
  }
};

// delete student function to handle deleting a student by studentId
const deleteStudent = async (req, res) => {
  let db = database.getDb();
  const { studentId } = req.params;

  let data = await db
    .collection('Student')
    .deleteOne({ _id: new ObjectId(studentId) });

  if (data.deletedCount > 0) {
    res.status(200).json({
      success: true,
      data: {
        message: 'Student deleted successfully',
      },
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Student not found',
      },
    });
  }
};

module.exports = {
  getStudent,
  patchStudent,
  getStudentReviews,
  changeVerifyStatus,
  setApiKey,
  removeApiKey,
  getAllStudents,
  deleteStudent,
  getStudentReviewsAdmin,
  getAStudent,
};
