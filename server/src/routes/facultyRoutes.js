const express = require('express');

const {
  getFaculties,
  getFaculty,
  getFacultyReview,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyReviewsAdmin,
} = require('../controllers/facultyController');
const { verifyToken, verifyAdmin, verifyModerator } = require('../middleware/authMiddleware');

let facultyRouter = express.Router();

// GET all faculties
facultyRouter.route('/').get(getFaculties);

// GET one faculties
facultyRouter.route('/:id').get(getFaculty);

// Get all reviews for a faculty
facultyRouter.route('/:id/reviews').get(verifyToken, getFacultyReview);
facultyRouter.route('/admin/:id/reviews/').get(verifyToken,verifyAdmin, getFacultyReviewsAdmin);


// add Faculty
facultyRouter.route('/').post(verifyToken,verifyAdmin, addFaculty);

// Edit Faculty
facultyRouter.route('/:id').patch(verifyToken,verifyAdmin, updateFaculty);

// Delete Faculty
facultyRouter.route('/:id').delete(verifyToken,verifyAdmin, deleteFaculty);

module.exports = facultyRouter;
