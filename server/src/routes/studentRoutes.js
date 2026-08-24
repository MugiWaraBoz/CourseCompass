const express = require('express');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
  getStudent,
  getStudentReviews,
  patchStudent,
  setApiKey,
  removeApiKey,
  getAllStudents,
  deleteStudent,
  changeVerifyStatus,
  getStudentReviewsAdmin,
  getAStudent,
} = require('../controllers/studentController');

let studentRouter = express.Router();

// Get the student information of the logged-in user
studentRouter.route('/me').get(verifyToken, getStudent);

// Get a student by studentId
studentRouter.route('/:studentId').get(verifyToken, verifyAdmin, getAStudent);

// Get all student
studentRouter.route('/').get(verifyToken, verifyAdmin, getAllStudents);

// Delete a student by studentId
studentRouter
  .route('/:studentId')
  .delete(verifyToken, verifyAdmin, deleteStudent);

// Change the verify status of a student by studentId
studentRouter
  .route('/:studentId/verify')
  .patch(verifyToken, verifyAdmin, changeVerifyStatus);

// Update the student information of the logged-in user
studentRouter.route('/me').patch(verifyToken, patchStudent);

// Get reviews for a specific student
studentRouter.route('/me/reviews').get(verifyToken, getStudentReviews);
studentRouter
  .route('/admin/:studentId/reviews')
  .get(verifyToken, verifyAdmin, getStudentReviewsAdmin);

// set api key for a student
studentRouter.route('/me/apikey').patch(verifyToken, setApiKey);
studentRouter.route('/me/apikey').delete(verifyToken, removeApiKey);

module.exports = studentRouter;
