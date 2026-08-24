const ObjectId = require('mongodb').ObjectId;
const database = require('../config/connect');
require('dotenv').config({
  path: '../../.env',
  quiet: true, // Suppress warnings if the .env file is missing
});

const updateReviewStatus = require('../utils/updateReviewStatus.js');

// postReview function to handle posting a review
const postReview = async (req, res) => {
  let db = database.getDb();
  const {
    courseId,
    facultyId,
    rating,
    difficultyRating,
    semester,
    comment,
    isAnonymous = false,
  } = req.body;

  let chkReview = await db.collection('Review').findOne({
    studentId: new ObjectId(req.student._id),
    facultyId: new ObjectId(facultyId),
    courseId: new ObjectId(courseId),
  });

  // console.log("chkReview: ", chkReview);
  if (chkReview) {
    // console.log("Review already exists for this student and faculty");
    res.status(409).json({
      success: false,
      error: {
        code: 'REVIEW_EXISTS',
        message: 'You have already reviewed this course with this faculty',
      },
    });
  } else {
    let courseObj = {
      courseId: new ObjectId(courseId),
      facultyId: new ObjectId(facultyId),
    };

    let course = await db.collection('CourseTake').findOne({
      courseId: new ObjectId(courseId),
      facultyId: new ObjectId(facultyId),
    });

    // console.log("course: ", course);

    if (!course) {
      await db.collection('CourseTake').insertOne(courseObj);
    }

    // studentId = req.student.studentId;
    // console.log(req.student)

    let reviewObj = {
      studentId: new ObjectId(req.student._id),
      courseId: new ObjectId(courseId),
      facultyId: new ObjectId(facultyId),
      rating: rating,
      difficultyRating: difficultyRating,
      semester: semester,
      comment: comment,
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      votescore: 0,
      isAnonymous: isAnonymous,
    };

    let review = await db.collection('Review').insertOne(reviewObj);

    /* 
            update review status for course and faculty
        */

    await updateReviewStatus(
      db,
      reviewObj.studentId,
      reviewObj.courseId,
      reviewObj.facultyId,
    );
    res.status(201).json({
      success: true,
      data: {
        review: {
          _id: review.insertedId,
        },
      },
      message: 'Review posted successfully',
    });
  }
};

// getAllReviews function to handle getting all reviews
const getAllReviews = async (req, res) => {
  let db = database.getDb();

  /*
        The aggregation pipeline is used to perform complex data transformations and computations in MongoDB.
        for anonymity, if the review is anonymous, the author name will be set to "Anonymous", otherwise it will be set to the student's name.
    */
  let reviews = await db
    .collection('Review')
    .aggregate([
      {
        $lookup: {
          from: 'Student',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $unwind: {
          path: '$student',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          verified: '$student.verified',
          author: {
            $cond: {
              if: { $eq: ['$isAnonymous', true] },
              then: {
                name: 'Anonymous',
              },
              else: {
                name: '$student.name',
              },
            },
          },
        },
      },
      {
        $project: {
          studentId: 0,
          student: 0,
        },
      },
    ])
    .toArray();

  // console.log(reviews)

  // let reviews = await db.collection("Review").find({}).toArray();

  if (reviews) {
    res.status(200).json({
      success: true,
      data: {
        reviews: reviews,
        message: 'Reviews fetched successfully',
      },
    });
  } else {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'No reviews found',
      },
    });
  }
};
const getAllReviewsAdmin = async (req, res) => {
  let db = database.getDb();

  let reviews = await db.collection('Review').find({}).toArray();

  if (reviews) {
    return res.status(200).json({
      success: 'true',
      data: {
        reviews: reviews,
      },
      message: 'Review Fetched',
    });
  } else {
    return res.status(404).json({
      success: 'false',
      error: {
        code: 'NOT_FOUND',
        message: 'No reviews found',
      },
    });
  }
};

// deleteReview function to handle deleting a review
const deleteReview = async (req, res) => {
  let db = database.getDb();
  let reviewId = new ObjectId(req.params.id);
  let stdId = new ObjectId(req.student._id);

  /*
        check if the review exists and belongs to the student
    */
  let review = await db.collection('Review').findOne({
    _id: reviewId,
    studentId: stdId,
  });

  if (req.student._id.toString() !== review.studentId.toString()) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You are not authorized to update this review',
      },
    });
  }

  try {
    await db.collection('Review').deleteOne({
      _id: reviewId,
      studentId: stdId,
    });

    await updateReviewStatus(db,review.studentId, review.courseId, review.facultyId);

    res.status(200).json({
      success: true,
      data: {
        message: 'Review deleted successfully',
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while deleting the review',
      },
    });
  }
};
const deleteReviewAdmin = async (req, res) => {
  let db = database.getDb();
  let reviewId = new ObjectId(req.params.id);

  /*
        check if the review exists 
    */
  let review = await db.collection('Review').findOne({
    _id: reviewId,
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Review not found',
      },
    });
  }

  try {
    await db.collection('Review').deleteOne({
      _id: reviewId,
    });

    await updateReviewStatus(db,review.studentId, review.courseId, review.facultyId);

    res.status(200).json({
      success: true,
      data: {
        message: 'Review deleted successfully',
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while deleting the review',
      },
    });
  }
};

// patchReview function to handle updating a review
const patchReview = async (req, res) => {
  let db = database.getDb();
  let reviewId = new ObjectId(req.params.id);
  let stdId = new ObjectId(req.student._id);
  console.log('reviewId: ', reviewId);
  const { rating, difficultyRating, semester, comment } = req.body;

  /*
        check if the review exists and belongs to the student
    */
  let review = await db.collection('Review').findOne({
    _id: reviewId,
    studentId: stdId,
  });

  if (req.student._id.toString() !== review.studentId.toString()) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You are not authorized to update this review',
      },
    });
  }

  let reviewObj = {
    $set: {
      rating: rating,
      difficultyRating: difficultyRating,
      semester: semester,
      comment: comment,
      updatedAt: new Date(),
    },
  };

  await updateReviewStatus(db, reviewObj.studentId, reviewObj.courseId, reviewObj.facultyId);

  try {
    review = await db
      .collection('Review')
      .findOneAndUpdate({ _id: reviewId, studentId: stdId }, reviewObj, {
        new: true,
      });

    if (review) {
      res.status(200).json({
        success: true,
        data: {
          review: review,
          message: 'Review updated successfully',
        },
      });
    } else {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Review not found',
        },
      });
    }
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the review',
      },
    });
  }
};
const patchReviewAdmin = async (req, res) => {
  let db = database.getDb();
  let reviewId = new ObjectId(req.params.id);
  const { rating, difficultyRating, semester, comment } = req.body;

  /*
        check if the review exists 
    */
  let review = await db.collection('Review').findOne({
    _id: reviewId,
  });

  if (!review) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Review not found',
      },
    });
  }

  let reviewObj = {
    $set: {
      rating: rating,
      difficultyRating: difficultyRating,
      semester: semester,
      comment: comment,
      updatedAt: new Date(),
      updatedByAdmin: true,
    },
  };

  await updateReviewStatus(db, reviewObj.studentId, reviewObj.courseId, reviewObj.facultyId);

  try {
    review = await db
      .collection('Review')
      .findOneAndUpdate({ _id: reviewId }, reviewObj, {
        new: true,
      });

    if (review) {
      res.status(200).json({
        success: true,
        data: {
          review: review,
          message: 'Review updated successfully',
        },
      });
    } else {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Review not found',
        },
      });
    }
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the review',
      },
    });
  }
};

module.exports = {
  postReview,
  patchReview,
  deleteReview,
  getAllReviews,
  getAllReviewsAdmin,
  patchReviewAdmin,
  deleteReviewAdmin,
};
