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
} = require('../controllers/studentController');

let studentRouter = express.Router();

// Get the student information of the logged-in user
studentRouter.route('/me').get(verifyToken, getStudent);

// Get a student by studentId
// Currently this route is not usable!!!
// studentRouter.route("/:studentId").get(getStudent);

// Get all student
studentRouter.route('/').get(getAllStudents);

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

// set api key for a student
studentRouter.route('/me/apikey').patch(verifyToken, setApiKey);
studentRouter.route('/me/apikey').delete(verifyToken, removeApiKey);

module.exports = studentRouter;
