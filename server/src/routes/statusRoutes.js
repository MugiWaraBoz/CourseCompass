const express = require('express');

const {
  getStudentStatus,
  getCourseStatus,
  getFacultyStatus,
  getReviewStatus,
} = require('../controllers/statusController');

let statusRouter = express.Router();

statusRouter.get('/student', getStudentStatus);
statusRouter.get('/course', getCourseStatus);
statusRouter.get('/faculty', getFacultyStatus);
statusRouter.get('/review', getReviewStatus);

module.exports = statusRouter;
