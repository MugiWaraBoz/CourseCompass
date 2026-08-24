const express = require('express');

const {
  getCourses,
  getCourse,
  getCourseReview,
  addCourse,
  updateCourse,
  deleteCourse,
  getCoursesReviewsAdmin,
} = require('../controllers/courseController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

let courseRouter = express.Router();

// GET all courses
courseRouter.route('/').get(getCourses);

// GET one Courses
courseRouter.route('/:id').get(getCourse);

// GET all reviews for a course
courseRouter.route('/:id/reviews').get(verifyToken, getCourseReview);
courseRouter
  .route('/admin/:id/reviews')
  .get(verifyToken, verifyAdmin, getCoursesReviewsAdmin);

// add Course
courseRouter.route('/').post(verifyToken, verifyAdmin, addCourse);

// Edit Course
courseRouter.route('/:id').patch(verifyToken, verifyAdmin, updateCourse);

// Delete Course
courseRouter.route('/:id').delete(verifyToken, verifyAdmin, deleteCourse);

module.exports = courseRouter;
