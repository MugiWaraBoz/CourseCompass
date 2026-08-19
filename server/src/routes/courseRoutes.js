const express = require('express');

const {
  getCourses,
  getCourse,
  getCourseReview,
} = require('../controllers/courseController');
const verifyToken = require('../middleware/authMiddleware');

let courseRouter = express.Router();

// GET all courses
courseRouter.route('/').get(getCourses);

// GET one Courses
courseRouter.route('/:id').get(getCourse);

// GET all reviews for a course
courseRouter.route('/:id/reviews').get(verifyToken, getCourseReview);

module.exports = courseRouter;
