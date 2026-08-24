const express = require('express');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
  postReview,
  deleteReview,
  getAllReviews,
  patchReview,
  deleteReviewAdmin,
  patchReviewAdmin,
  // getAllReviewsAdmin
} = require('../controllers/reviewController');
const { postReviewVote } = require('../controllers/voteController');

let postRouter = express.Router();

// Post a review
postRouter.route('/').post(verifyToken, postReview);

// post a vote for a review
postRouter.route('/:id/vote').post(verifyToken, postReviewVote);

// delete a review
postRouter.route('/:id').delete(verifyToken, deleteReview);
postRouter
  .route('/admin/:id')
  .delete(verifyToken, verifyAdmin, deleteReviewAdmin);

// get all reviews
postRouter.route('/').get(getAllReviews);
// postRouter.route('/admin').get(verifyToken, verifyAdmin, getAllReviewsAdmin);

// patch a review
postRouter.route('/:id').patch(verifyToken, patchReview);
postRouter
  .route('/admin/:id')
  .patch(verifyToken, verifyAdmin, patchReviewAdmin);

module.exports = postRouter;
