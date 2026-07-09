const express = require("express");

const ObjectId = require("mongodb").ObjectId;

const { getCourses, getCourse } = require("../controllers/courseController");


let courseRouter = express.Router();

// GET all courses
courseRouter.route("/courses").get(getCourses);

// GET one Courses
courseRouter.route("/courses/:id").get(getCourse);


// For future
// POST one Courses
// UPDATE one Courses
// DELETE one Courses


module.exports = courseRouter;