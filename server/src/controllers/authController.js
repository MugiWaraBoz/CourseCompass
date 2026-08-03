const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });
const database = require("../config/connect");

// Register a new student
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
        /*
            mail domain validation
        */
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

        // Password hashing
        const SALT_ROUNDS = 12;
        const hasedPass = await bcrypt.hash(password, SALT_ROUNDS);
        
        

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

        // sanitize student obj

        let student = {
            _id: data.insertedId,
            ...stdObj
        }

        const sanitizeStudent = (student) => {
            const { password, ...safeStudent } = student;
            return safeStudent;
        };
        
        /*
            jwt token expiration time set to 30 days.
        */
        const token = jwt.sign(
            { 
                _id: student._id.toString(),
            },
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        )
        try {
            res.status(201).json({
                success: true,
                data: {
                    "student": sanitizeStudent(student),
                    "message": "Student registered successfully, please login to continue",
                    "info": "Add Student ID picture from dashboard to get a verified badge",
                },
                token: token,
            });
        } catch (error) {
            console.error("Error sending response:", error);
        }
    }
}

// login a student
const postLogin = async(req,res)=>{
    let db = database.getDb();
    const { email, password } = req.body;
    const student = await db.collection("Student").findOne({email: email})
    
    
    if(student){
        let confirmation = await bcrypt.compare(password, student.password);
        if(confirmation){

            /*
                jwt token expiration time set to 30 days.
            */
            const token = jwt.sign(
                { 
                    _id: student._id.toString(),
                },
                process.env.JWT_SECRET, 
                { expiresIn: '30d' }
            )

            const sanitizeStudent = (student) => {
                const { password, ...safeStudent } = student;
                return safeStudent;
            }

            let isVerified = student.verified;
            res.status(200).json({
                success: true,
                data: {
                    "student": sanitizeStudent(student),
                    "message": "Student logged in successfully",
                    "info": !isVerified
                        ? "You are not verified. Please upload your student ID from the dashboard to receive a verified badge."
                        : null
                },
                token: token,
            });
        } else {
            res.status(401).json({
                success: false,
                "error": {
                    "code": "INVALID_PASSWORD",
                    "message": "Invalid password, please try again!"
                }
            });
        }
    } else {
        res.status(401).json({
            success: false,
            "error": {
                "code": "EMAIL_NOT_FOUND",
                "message": "Email not found, please register first!"
            }
        });
    }
}

// forgot password
const forgotPassword = async(req,res)=>{
    let db = database.getDb();
    const { email } = req.body;
    const student = await db.collection("Student").findOne({email: email});

    if(!student){
        res.status(404).json({
            success: false,
            "error": {
                "code": "EMAIL_NOT_FOUND",
                "message": "Email not found, please register first!"
            }
        });
        return;
    }

    token = jwt.sign(
        { 
            id: student._id.toString(),
            email,
        },
        process.env.JWT_SECRET, 
        { expiresIn: '5m' }
    )

    res.status(200).json({
        success: true,
        "message": "Password reset request received. Please click the link below to reset your password. Expires in 5 minutes.",
        "resetLink": `${process.env.FRONTEND_URL}/auth/reset-password/${token}}`
    });

}

// password reset
const resetPassword = async(req,res)=>{
    let db = database.getDb();
    const { newPassword, confirmPassword } = req.body;
    const token = req.params.token;


    if(newPassword !== confirmPassword){
        res.status(400).json({
            success: false,
            "error": {
                "code": "PASSWORD_MISMATCH",
                "message": "New password and confirm password do not match!"
            }
        });
        return;
    }
    
    if(!token) {
        return res.status(400).json({
            success: false,
            "error": {
                "code": "TOKEN_MISSING",
                "message": "Token is missing from the request"
            }
        });
    }
    
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(400).json({
            success: false,
            "error": {
                "code": "INVALID_TOKEN",
                "message": "Token is invalid or has expired"
            }
        });
    }

    const email = jwt.verify(token, process.env.JWT_SECRET).email;
    const student = await db.collection("Student").findOne({email: email});
    if(!student){
        return res.status(404).json({
            success: false,
            "error": {
                "code": "EMAIL_NOT_FOUND",
                "message": "Email not found, please register first!"
            }
        });
    }

    let isMatch = await bcrypt.compare(newPassword, student.password);
    if(isMatch){
        return res.status(400).json({
            success: false,
            "error": {
                "code": "SAME_PASSWORD",
                "message": "New password cannot be the same as the old password!"
            }
        });
    }

    if(decoded.id !== student._id.toString()){
        return res.status(403).json({
            success: false,
            "error": {
                "code": "FORBIDDEN",
                "message": "You are not authorized to reset this student's password"
            }
        });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await db.collection("Student").updateOne(
        { _id: student._id },
        { $set: { 
            password: hashedPassword,
            updatedAt: new Date()
        } }
    );
    res.status(200).json({
        success: true,
        "message": "Password reset successfully"
    });
}

// change password
const changePassword = async(req,res)=>{
    let db = database.getDb();
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const email = req.student.email;
    const student = await db.collection("Student").findOne({email: email});
    
    if(req.student._id.toString() !== student._id.toString()){
        return res.status(403).json({
            success: false,
            "error": {
                "code": "FORBIDDEN",
                "message": "You are not authorized to change this student's password"
            }
        });
    }

    if(newPassword !== confirmPassword){
        return res.status(400).json({
            success: false,
            "error": {
                "code": "PASSWORD_MISMATCH",
                "message": "New password and confirm password do not match!"
            }
        });
        return;
    }

    let isMatch = await bcrypt.compare(oldPassword, student.password);

    if(!isMatch){
        return res.status(401).json({
            success: false,
            "error": {
                "code": "INVALID_PASSWORD",
                "message": "Invalid old password, please try again!"
            }
        });
        return;
    }

    isMatch = await bcrypt.compare(newPassword, student.password);
    
    if(isMatch){
        return res.status(400).json({
            success: false,
            "error": {
                "code": "SAME_PASSWORD",
                "message": "New password cannot be the same as the old password!"
            }
        });
        return;
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await db.collection("Student").updateOne(
        { email: email },
        { $set: { password: hashedPassword } }
    );
    res.status(200).json({
        success: true,
        "message": "Password changed successfully"
    });
}

module.exports = {
    postRegister,
    postLogin,
    forgotPassword,
    resetPassword,
    changePassword
};  