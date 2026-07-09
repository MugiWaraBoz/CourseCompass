const express = require("express");

const ObjectId = require("mongodb").ObjectId;

const { postReview,postReviewVote } = require("../controllers/reviewController");


let postRouter = express.Router();

// Post a review
postRouter.route("/reviews").post(postReview);

// post a vote for a review
postRouter.route("/reviews/:id/vote").post(postReviewVote);


// For future
// POST one Courses
// UPDATE one Courses
// DELETE one Courses


module.exports = postRouter;