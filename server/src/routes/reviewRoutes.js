const express = require("express");

const ObjectId = require("mongodb").ObjectId;
const verifyToken = require("../middleware/authMiddleware");
const { postReview,postReviewVote } = require("../controllers/reviewController");


let postRouter = express.Router();

// Post a review
postRouter.route("/").post(verifyToken, postReview);

// post a vote for a review
postRouter.route("/:id/vote").post(verifyToken, postReviewVote);


// For future
// POST one Courses
// UPDATE one Courses
// DELETE one Courses


module.exports = postRouter;