const ObjectId = require('mongodb').ObjectId;
const database = require('../config/connect');
const { encryptApiKey } = require('../utils/encryptionUtils');


// getStudent function to handle getting a student by studentId
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

// patchStudent function to handle updating a student by studentId
const patchStudent = async (req, res) => {
  let db = database.getDb();

  const { name, cgpa, photoUrl } = req.body;

  let stdObj = {
    $set: {
      name: name,
      cgpa: cgpa,
      photoUrl: photoUrl
    },
  };
  let data = await db
    .collection('Student')
    .findOneAndUpdate({ _id: new ObjectId(req.student._id) }, stdObj, {
      new: true,
    });
  //   console.log(data);

  let sanitizedData = {
    _id: data._id,
    name: data.name,
    email: data.email,
    cgpa: data.cgpa,
    photoUrl: data.photoUrl,
    verified: data.verified,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

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

const setApiKey = async (req, res) => {
  let db = database.getDb();
  const { apiKey } = req.body;

  let hashedKey = encryptApiKey(apiKey);

  let data = await db.collection('Student').findOneAndUpdate(
    { _id: new ObjectId(req.student._id) },
    { $set: { 
      apiKey: hashedKey,
      updatedAt: new Date() 
    } },
    { returnDocument: 'after' }
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

}

const removeApiKey = async (req, res) => {
  let db = database.getDb();
  await db.collection('Student').findOneAndUpdate(
    { _id: new ObjectId(req.student._id) },
    { $unset: { apiKey: "" }, $set: { updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  return res.status(200).json({
    success: true,
    data: {
      message: 'API key removed successfully',
    },
  });
}

module.exports = {
  getStudent,
  patchStudent,
  getStudentReviews,
  setApiKey,
  removeApiKey
};
