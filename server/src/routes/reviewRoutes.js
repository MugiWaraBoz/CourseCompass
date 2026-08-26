const express = require('express');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
  postReview,
  deleteReview,
  getAllReviews,
  patchReview,
  deleteReviewAdmin,
  patchReviewAdmin,
  getAllPendingReviews,
  approveReview,
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

// Fetch the pending review for admin
postRouter
  .route('/admin/pending')
  .get(verifyToken, verifyAdmin, getAllPendingReviews);

// Approve or reject a review by admin
postRouter
  .route('/admin/:id/approve')
  .patch(verifyToken, verifyAdmin, approveReview);

module.exports = postRouter;
