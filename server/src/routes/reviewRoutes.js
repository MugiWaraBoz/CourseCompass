const express = require('express');

const verifyToken = require('../middleware/authMiddleware');
const {
  postReview,
  deleteReview,
  getAllReviews,
  patchReview,
} = require('../controllers/reviewController');
const { postReviewVote } = require('../controllers/voteController');

let postRouter = express.Router();

// Post a review
postRouter.route('/').post(verifyToken, postReview);

// post a vote for a review
postRouter.route('/:id/vote').post(verifyToken, postReviewVote);

// delete a review
postRouter.route('/:id').delete(verifyToken, deleteReview);

// get all reviews
postRouter.route('/').get(getAllReviews);

// patch a review
postRouter.route('/:id').patch(verifyToken, patchReview);

module.exports = postRouter;
