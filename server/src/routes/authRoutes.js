const express = require("express");

const ObjectId = require("mongodb").ObjectId;
const verifyToken = require("../middleware/authMiddleware");
const { postRegister, postLogin, getStudent} = require("../controllers/authController");


let authRouter = express.Router();

// Register a new user
authRouter.route("/register").post(postRegister);

// Login a user
authRouter.route("/login").post(postLogin);


module.exports = authRouter;