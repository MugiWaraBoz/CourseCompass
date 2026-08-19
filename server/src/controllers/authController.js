const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const { sendEmail } = require('../services/emailServics')
const database = require('../config/connect');

const sanitizeStudent = (student) => {
  const safeStudent = { ...student };
  delete safeStudent.password;
  return safeStudent;
};

// verify a user
const verifyUser = async (req,res) => {
  let decoded, student, std_id
  let db = database.getDb();
  const { token } = req.params;
  try {

    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

  } catch { 
    return res.status(400).json(
      {
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Link is invalid or has expired',
      },
    });
  }

  if(decoded.purpose != "email-verification"){
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN_PURPOSE',
        message: 'Purpose is invalid for this operation',
      },
    });
  }
  
  std_id = new ObjectId(decoded._id)
  student = await db.collection('Student').findOne({_id: std_id});

  if(student){
    await db.collection('Student').updateOne(
      { _id: student._id },
      {
        $set: {
          mailVerified: true,
        },
      },
    )

    return res.status(201).json(
      {
      success: true,
      data: {
        message: 'Mail is verified',
        info: 'Add Student ID picture from dashboard to get a verified badge',
      }
    });
  } else {
    return res.status(400).json({
      success: false,
      error: {
        code: '404',
        message: 'Unauthorize access',
      },
    });
  }
}

// Register a new student
const postRegister = async (req, res) => {
  let db = database.getDb();

  const { name, studentIdNumber, email, password, cgpa = null } = req.body;
  const takenEmail = await db.collection('Student').findOne({ email: email });

  if (takenEmail) {
    res.status(400).json({
      success: false,
      error: {
        code: 'EMAIL_TAKEN',
        message: 'Email is already taken',
      },
    });
  } else {
    /*
       mail domain validation
    */
    let email_tag = email.split('@');
    if (email_tag[1] !== 'eastdelta.edu.bd') {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EMAIL_DOMAIN',
          message: 'Only emails from eastdelta.edu.bd are allowed',
        },
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
      mailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      courses: [],
      apiKey: null,
    };

    let data = await db.collection('Student').insertOne(stdObj);

    // sanitize student obj

    let student = {
      _id: data.insertedId,
      ...stdObj,
    };

    student = sanitizeStudent(student);

    /*
      jwt token expiration time set to 15 days.
    */
    const token = jwt.sign(
      {
        _id: student._id.toString(),
        purpose: "email-verification",
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    let link = `${process.env.FRONTEND_URL}/auth/verify-email/${token}`;

    // console.log(student.email);

    try {
      await sendEmail({to: student.email, subject: "Verify User Account", link: link, actionText: "Verify your Email"})
      return res.status(201).json(
        {
        success: true,
        data: {
          message: 'Registration successful. Please check your email to verify your account.',
        }
      });
    } catch (error) {
      console.error('Error sending response:', error);
    }
  }
};

// login a student
const postLogin = async (req, res) => {
  let db = database.getDb();
  const { email, password } = req.body;
  let student = await db.collection('Student').findOne({ email: email });

  if (student) {

    if(student.mailVerified === false){
      return res.status(401).json({
        success: false,
        error: {
          code: 'EMAIL_NOT_VERIFIED',
          message: 'Email is not verified. Please verify your email first!',
        },
      });
    }

    let confirmation = await bcrypt.compare(password, student.password);
    if (confirmation) {
      /*
                jwt token expiration time set to 30 days.
            */
      const token = jwt.sign(
        {
          _id: student._id.toString(),
          purpose: "login",
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' },
      );
      student = sanitizeStudent(student);

      let isVerified = student.verified;
      return res.status(200).json({
        success: true,
        data: {
          student: student,
          message: 'Student logged in successfully',
          info: !isVerified
            ? 'You are not verified. Please upload your student ID from the dashboard to receive a verified badge.'
            : null,
        },
        token: token,
      });
    } else {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Invalid password, please try again!',
        },
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: {
        code: 'EMAIL_NOT_FOUND',
        message: 'Email not found, please register first!',
      },
    });
  }
};

// forgot password
const forgotPassword = async (req, res) => {
  let db = database.getDb();
  const { email } = req.body;
  const student = await db.collection('Student').findOne({ email: email });

  if (!student) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'EMAIL_NOT_FOUND',
        message: 'Email not found, please register first!',
      },
    });
  }

  /*
    jwt token expiration time set to 5 minutes.
  */
  const token = jwt.sign(
    {
      _id: student._id.toString(),
      purpose: "password-reset",
    },
    process.env.JWT_SECRET,
    { expiresIn: '5m' },
  );

  let link = `${process.env.FRONTEND_URL}/auth/reset-password/${token}`;

  try{
    // send email to student for password reset
    await sendEmail({to: student.email, subject: "Reset Password", link: link, actionText: "Reset your Password"})

    return res.status(200).json({
      success: true,
      message:
        'Password reset link send to email. Expires in 5 minutes.',
    });

  } catch (error) {
    console.error('Error sending reset password email:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EMAIL_SEND_FAILED',
        message: 'Failed to send reset password email. Please try again later.',
      },
    });
  }
};

// password reset
const showResetPassword = async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'TOKEN_MISSING',
        message: 'Token is missing from the request',
      },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN_PURPOSE',
          message: 'Token purpose is invalid for this operation',
        },
      });
    }
  } catch {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Link is invalid or has expired',
      },
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Token is valid',
  });
};

const resetPassword = async (req, res) => {
  let db = database.getDb();
  const { newPassword, confirmPassword } = req.body;
  const token = req.params.token;


  if (!token) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'TOKEN_MISSING',
        message: 'Token is missing from the request',
      },
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'PASSWORD_MISMATCH',
        message: 'New password and confirm password do not match!',
      },
    });
  }

  let decoded, student;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {

    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token is invalid or has expired',
      },
    });
  }

  if(decoded.purpose !== 'password-reset') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN_PURPOSE',
        message: 'Token purpose is invalid for this operation',
      },
    });
  }

  const id = decoded._id;
  student = await db.collection('Student').findOne({ _id: id });
  if (!student) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'STUDENT_NOT_FOUND',
        message: 'Student not found',
      },
    });
  }

  let isMatch = await bcrypt.compare(newPassword, student.password);
  if (isMatch) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'SAME_PASSWORD',
        message: 'New password cannot be the same as the old password!',
      },
    });
  }

  if (decoded._id.toString() !== student._id.toString()) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: "You are not authorized to reset this student's password",
      },
    });
  }

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await db.collection('Student').updateOne(
    { _id: id },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    },
  );
  return res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  });
};

// change password
const changePassword = async (req, res) => {
  let db = database.getDb();
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const id = new ObjectId(req.student._id);
  const student = await db.collection('Student').findOne({ _id: id });

  if (req.student._id.toString() !== student._id.toString()) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: "You are not authorized to change this student's password",
      },
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'PASSWORD_MISMATCH',
        message: 'New password and confirm password do not match!',
      },
    });
  }

  let isMatch = await bcrypt.compare(oldPassword, student.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_PASSWORD',
        message: 'Invalid old password, please try again!',
      },
    });
  }

  isMatch = await bcrypt.compare(newPassword, student.password);

  if (isMatch) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'SAME_PASSWORD',
        message: 'New password cannot be the same as the old password!',
      },
    });
  }

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await db
    .collection('Student')
    .updateOne({ _id: id }, { $set: { password: hashedPassword } });

  return res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
};

module.exports = {
  postRegister,
  postLogin,
  forgotPassword,
  resetPassword,
  showResetPassword,
  changePassword,
  verifyUser,
};
