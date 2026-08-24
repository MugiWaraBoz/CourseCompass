const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const database = require('../config/connect');

// Token verification middleware
const verifyToken = async (req, res, next) => {
  const authHeaders = req.headers['authorization'];
  const token = authHeaders && authHeaders.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: 'No token provided',
      },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // A signed token alone is not enough: its owner may have been deleted or
    // had their role changed after the token was issued.
    const student = await database
      .getDb()
      .collection('Student')
      .findOne({ _id: new ObjectId(decoded._id) });

    if (!student) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_NOT_FOUND',
          message: 'This account no longer exists. Please sign in again.',
        },
      });
    }

    // Use the role currently stored in the database, never the stale JWT role.
    req.student = {
      ...decoded,
      _id: student._id.toString(),
      role: student.role,
    };
    return next();
  } catch {
    return res.status(403).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token',
      },
    });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.student && req.student.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied. Admin privileges required.',
      },
    });
  }
};

const verifyModerator = (req, res, next) => {
  if (req.student && req.student.role === 'moderator') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied. Moderator privileges required.',
      },
    });
  }
};

module.exports = { verifyToken, verifyAdmin, verifyModerator };
