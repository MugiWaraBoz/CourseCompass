const express = require("express");

const ObjectId = require("mongodb").ObjectId;

const { getFaculties, getFaculty, getFacultyReview } = require("../controllers/facultyController");
const verifyToken = require("../middleware/authMiddleware");


let facultyRouter = express.Router();

// GET all faculties
facultyRouter.route("/").get(getFaculties);

// GET one faculties
facultyRouter.route("/:id").get(getFaculty);

// Get all reviews for a faculty
facultyRouter.route("/:id/reviews").get(getFacultyReview);


// For future
// POST one faculty
// UPDATE one faculty
// DELETE one faculty

module.exports = facultyRouter;