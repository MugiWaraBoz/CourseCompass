const express = require('express');

const verifyToken = require('../middleware/authMiddleware');
const {
  testAIResponse,
  courseReviewAiResponse,
  facultyReviewAiResponse,
} = require('../controllers/aiController');

let aiRouter = express.Router();

module.exports = aiRouter;

// test key for verifying the AI response
aiRouter.route('/test').get(verifyToken, testAIResponse);

// for courses
// GET /:id/reviews/ai
aiRouter.route('/:id/reviews/course').get(verifyToken, courseReviewAiResponse);

// for faculties
// GET /:id/reviews/ai
aiRouter
  .route('/:id/reviews/faculty')
  .get(verifyToken, facultyReviewAiResponse);
