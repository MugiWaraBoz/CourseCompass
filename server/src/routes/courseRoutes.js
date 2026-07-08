const express = require("express");

const ObjectId = require("mongodb").ObjectId;

const { getCourses, getCourse } = require("../controllers/courseController");


let courseRouter = express.Router();

// GET all courses
courseRouter.route("/courses").get(getCourses);

// GET one Courses
courseRouter.route("/courses/:id").get(getCourse);



module.exports = courseRouter;