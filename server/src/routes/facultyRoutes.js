const express = require("express");

const ObjectId = require("mongodb").ObjectId;

const { getFaculties, getFaculty } = require("../controllers/facultyController");


let facultyRouter = express.Router();

// GET all faculties
facultyRouter.route("/faculty").get(getFaculties);

// GET one faculties
facultyRouter.route("/faculty/:id").get(getFaculty);


// For future
// POST one faculty
// UPDATE one faculty
// DELETE one faculty

module.exports = facultyRouter;