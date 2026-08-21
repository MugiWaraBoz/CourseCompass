const express = require('express');

const {
  getFaculties,
  getFaculty,
  getFacultyReview,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} = require('../controllers/facultyController');
const {
  verifyToken,
  verifyAdmin,
  verifyModerator,
} = require('../middleware/authMiddleware');

let facultyRouter = express.Router();

// GET all faculties
facultyRouter.route('/').get(getFaculties);

// GET one faculties
facultyRouter.route('/:id').get(getFaculty);

// Get all reviews for a faculty
facultyRouter.route('/:id/reviews').get(verifyToken, getFacultyReview);

// add Faculty
facultyRouter.route('/').post(verifyToken, verifyAdmin, addFaculty);

// Edit Faculty
facultyRouter.route('/:id').patch(verifyToken, verifyAdmin, updateFaculty);

// Delete Faculty
facultyRouter.route('/:id').delete(verifyToken, verifyAdmin, deleteFaculty);

module.exports = facultyRouter;
