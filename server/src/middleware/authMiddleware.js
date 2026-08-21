const jwt = require('jsonwebtoken');

// Token verification middleware
const verifyToken = (req, res, next) => {
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
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, student) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid token',
          },
        });
      }
      req.student = student;
      next();
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
