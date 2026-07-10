const express = require("express");

const ObjectId = require("mongodb").ObjectId;

const { getCourses, getCourse, getCourseReview } = require("../controllers/courseController");


let courseRouter = express.Router();

// GET all courses
courseRouter.route("/").get(getCourses);

// GET one Courses
courseRouter.route("/:id").get(getCourse);

// GET all reviews for a course
courseRouter.route("/:id/reviews").get(getCourseReview);


module.exports = courseRouter;