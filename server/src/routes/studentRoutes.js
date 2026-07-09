const express = require("express");

const ObjectId = require("mongodb").ObjectId;
const verifyToken = require("../middleware/authMiddleware");
const { getStudent,getStudentReviews, patchStudent } = require("../controllers/studentCotnroller");


let studentRouter = express.Router();

// Get the student information of the logged-in user
studentRouter.route("/me").get(verifyToken, getStudent);

// Get a student by studentId
studentRouter.route("/:studentId").get(getStudent);

studentRouter.route("/me").patch(verifyToken, patchStudent);

// Get reviews for a specific student
studentRouter.route("/me/reviews").get(verifyToken, getStudentReviews);

// For future
// POST one Courses
// UPDATE one Courses
// DELETE one Courses


module.exports = studentRouter;