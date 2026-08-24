const ObjectId = require('mongodb').ObjectId;

const updateReviewStatus = async (db, studentId, courseId, facultyId) => {
  // console.log("Updating review status for courseId: ", courseId, " and facultyId: ", facultyId);

  const courseObj = new ObjectId(courseId);
  const facultyObj = new ObjectId(facultyId);
  const studentObj = new ObjectId(studentId);

  const courseStat = await db
    .collection('Review')
    .aggregate([
      {
        $match: {
          courseId: courseObj,
        },
      },
      {
        // id is set to null because we want to aggregate all documents into a single result
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          avgDifficultyRating: { $avg: '$difficultyRating' },
          reviewCount: { $sum: 1 },
        },
      },
    ])
    .toArray();

  /*
        update the course document with the new average rating and total reviews
    */
  const courseResult = courseStat[0] || {
    avgRating: 0,
    reviewCount: 0,
  };

  await db.collection('Course').updateOne(
    { _id: courseObj },
    {
      $set: {
        avgRating: Number(courseResult.avgRating.toFixed(2)),
        reviewCount: courseResult.reviewCount,
      },
    },
  );

  const facultyStat = await db
    .collection('Review')
    .aggregate([
      {
        $match: {
          facultyId: facultyObj,
        },
      },
      {
        $group: {
          // id is set to null because we want to aggregate all documents into a single result
          _id: null,
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ])
    .toArray();

  /*
        update the faculty document with the new average rating and total reviews
    */
  const facultyResult = facultyStat[0] || {
    avgRating: 0,
    reviewCount: 0,
  };

  await db.collection('Faculty').updateOne(
    { _id: facultyObj },
    {
      $set: {
        avgRating: Number(facultyResult.avgRating.toFixed(2)),
        reviewCount: facultyResult.reviewCount,
      },
    },
  );

  /*
        update the student document with the new average rating and total reviews
    */
  const studentStat = await db
    .collection('Review')
    .aggregate([
      {
        $match: {
          studentId: studentObj,
        },
      },
      {
        $group: {
          // id is set to null because we want to aggregate all documents into a single result
          _id: null,
          reviewCount: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const studentResult = studentStat[0] || {
    reviewCount: 0,
  };

  await db.collection('Student').updateOne(
    { _id: studentObj },
    {
      $set: {
        reviewCount: studentResult.reviewCount,
      },
    },
  );
};
module.exports = updateReviewStatus;
