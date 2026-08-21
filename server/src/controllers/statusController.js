const database = require('../config/connect');

// Grab Student Status - total students, active students, inactive students, verified students, unverified students
const getStudentStatus = async (req, res) => {
  let db = database.getDb();

  const totalStudents = await db.collection('Student').countDocuments();

  const activeStudents = await db
    .collection('Student')
    .countDocuments({ mailVerified: true });
  const inactiveStudents = await db
    .collection('Student')
    .countDocuments({ mailVerified: false });
  const verifiedStudents = await db
    .collection('Student')
    .countDocuments({ verified: true });
  const unverifiedStudents = await db
    .collection('Student')
    .countDocuments({ verified: false });
  const totalReviews = await db.collection('Review').countDocuments();

  const verifiedStudentPercentage = totalStudents
    ? (verifiedStudents / totalStudents) * 100
    : 0;

  const activeStudentPercentage = totalStudents
    ? (activeStudents / totalStudents) * 100
    : 0;

  res.json({
    success: true,
    data: {
      totalStudents,
      activeStudents,
      inactiveStudents,
      verifiedStudents,
      unverifiedStudents,
      totalReviews,
      verifiedStudentPercentage: verifiedStudentPercentage.toFixed(0),
      activeStudentPercentage: activeStudentPercentage.toFixed(0),
    },
  });
};

// Grab Course Status - total courses
const getCourseStatus = async (req, res) => {
  let db = database.getDb();
  const totalCourses = await db.collection('Course').countDocuments();
  res.json({
    success: true,
    data: {
      totalCourses,
    },
  });
};

// Grab Faculty Status - total faculty
const getFacultyStatus = async (req, res) => {
  let db = database.getDb();
  const totalFaculty = await db.collection('Faculty').countDocuments();
  res.json({
    success: true,
    data: {
      totalFaculty,
    },
  });
};

// total reviews - 5 start, 4 start, 3 start, 2 start, 1 start
const getReviewStatus = async (req, res) => {
  let db = database.getDb();
  const totalReviews = await db.collection('Review').countDocuments();
  const fiveStarReviews = await db
    .collection('Review')
    .countDocuments({ rating: 5 });
  //   console.log('Total Reviews:', fiveStarReviews);
  const fourStarReviews = await db
    .collection('Review')
    .countDocuments({ rating: 4 });
  const threeStarReviews = await db
    .collection('Review')
    .countDocuments({ rating: 3 });
  const twoStarReviews = await db
    .collection('Review')
    .countDocuments({ rating: 2 });
  const oneStarReviews = await db
    .collection('Review')
    .countDocuments({ rating: 1 });

  //   console.log('Review Status:', {
  //     totalReviews,
  //     fiveStarReviews,
  //     fourStarReviews,
  //     threeStarReviews,
  //     twoStarReviews,
  //     oneStarReviews,
  //   });

  res.json({
    success: true,
    data: {
      totalReviews,
      fiveStarReviews,
      fourStarReviews,
      threeStarReviews,
      twoStarReviews,
      oneStarReviews,
    },
  });
};

module.exports = {
  getStudentStatus,
  getCourseStatus,
  getFacultyStatus,
  getReviewStatus,
};
