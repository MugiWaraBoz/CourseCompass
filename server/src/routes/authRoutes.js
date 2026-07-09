const express = require("express");

const ObjectId = require("mongodb").ObjectId;

const { postRegister, postLogin, getStudent} = require("../controllers/authController");


let authRouter = express.Router();

// Register a new user
authRouter.route("/register").post(postRegister);

// Login a user
authRouter.route("/login").post(postLogin);

// get a user
authRouter.route("/me").get(getStudent);


// For future
// POST one Courses
// UPDATE one Courses
// DELETE one Courses


module.exports = authRouter;