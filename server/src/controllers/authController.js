const database = require("../config/connect");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

const postRegister = async(req,res)=>{
    let db = database.getDb();

    const { name, studentIdNumber, email, password, cgpa=null } = req.body;
    const takenEmail = await db.collection("Student").findOne({email: email})


    if(takenEmail){
        res.status(400).json({
            success: false,
            "error": {
                "code": "EMAIL_TAKEN",
                "message": "Email is already taken"
            }
        });
    } else {
        let email_tag = email.split("@");
        if(email_tag[1] !== "eastdelta.edu.bd"){
            res.status(400).json({
                success: false,
                "error": {
                    "code": "INVALID_EMAIL_DOMAIN",
                    "message": "Only emails from eastdelta.edu.bd are allowed"
                }
            });
            return;
        }

        const SALT_ROUNDS = 12;
        const hasedPass = await bcrypt.hash(password, SALT_ROUNDS);
        /*
            jwt token expiration time set to 30 days.
        */
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '30d' })

        let stdObj = {
            name: name,
            studentIdNumber: studentIdNumber,
            email: email,
            password: hasedPass,
            photoUrl: null,
            cgpa: cgpa,
            verified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            courses: [],
        }
        let data = await db
            .collection("Student")
            .insertOne(stdObj);

        res.status(201).json({
            success: true,
            data: {
                "student": {
                    _id: data.insertedId,
                    ...stdObj
                },
                "message": "Student registered successfully, please login to continue",
                "info": "Add Student ID picture from dashboard to get a verified badge",
            },
            token: token,
        });
    }
}

const postLogin = async(req,res)=>{
    let db = database.getDb();
    const { email, password } = req.body;
    const student = await db.collection("Student").findOne({email: email})
    
    
    if(student){
        let confirmation = await bcrypt.compare(password, student.password);
        if(confirmation){
            const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '30d' })
            let isVerified = student.verified;
            res.status(200).json({
                success: true,
                data: {
                    "student": student,
                    "message": "Student logged in successfully",
                    "info": !isVerified
                        ? "You are not verified. Please upload your student ID from the dashboard to receive a verified badge."
                        : null
                },
                token: token,
            });
        } else {
            res.status(400).json({
                success: false,
                "error": {
                    "code": "INVALID_PASSWORD",
                    "message": "Invalid password, please try again!"
                }
            });
        }
    } else {
        res.status(400).json({
            success: false,
            "error": {
                "code": "EMAIL_NOT_FOUND",
                "message": "Email not found, please register first!"
            }
        });
    }
}

/*
    Authentication middleware to get the logged-in student information.
*/
const getStudent = (verifyToken) => async (req, res) => {
    let db = database.getDb();
    let data = await db.collection("Student").findOne({_id: new ObjectId(req.params.id)});
    if(data){
        res.status(200).json({
            success: true, 
            student : data
        });
    } else {
        res.status(404).json({
            success: false, 
            "error": {
                "code": "NOT_FOUND",
                "message": "Student not found"
            }
        });
    }
}

// Token verification middleware
const verifyToken = (req, res, next) => {
    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(' ')[1]
    if(!token){
        return res.status(401).json({
            success: false,
            "error": { 
                "code": "NO_TOKEN",
                "message": "No token provided"
            }
        });
    } else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, student) => {
                if(err){
                    return res.status(403).json({
                        success: false,
                        "error": {
                            "code": "INVALID_TOKEN",
                            "message": "Invalid token"
                        }
                    });
                }
                req.student = student;
                next();
            }
        )
    }
}

module.exports = {
    postRegister,
    postLogin,
    getStudent
};  