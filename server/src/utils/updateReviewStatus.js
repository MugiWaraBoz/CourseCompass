const ObjectId = require('mongodb').ObjectId;

const updateReviewStatus = async (db, studentId, courseId, facultyId) => {
  const courseObj = new ObjectId(courseId);
  const facultyObj = new ObjectId(facultyId);
  const studentObj = new ObjectId(studentId);

  const review = await db.collection('Review').findOne({
    studentId: studentObj,
    courseId: courseObj,
    facultyId: facultyObj,
  });

  if (!review || review.isApproved !== true) {
    return;
  }

  const courseStat = await db
    .collection('Review')
    .aggregate([
      { $match: { courseId: courseObj, isApproved: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          avgDifficultyRating: { $avg: '$difficultyRating' },
          reviewCount: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const courseResult = courseStat[0] || { avgRating: 0, reviewCount: 0 };

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
      { $match: { facultyId: facultyObj, isApproved: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          avgDifficultyRating: { $avg: '$difficultyRating' },
          reviewCount: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const facultyResult = facultyStat[0] || { avgRating: 0, reviewCount: 0 };

  await db.collection('Faculty').updateOne(
    { _id: facultyObj },
    {
      $set: {
        avgRating: Number(facultyResult.avgRating.toFixed(2)),
        avgDifficultyRating: Number(
          facultyResult.avgDifficultyRating.toFixed(2),
        ),
        reviewCount: facultyResult.reviewCount,
      },
    },
  );

  const studentStat = await db
    .collection('Review')
    .aggregate([
      { $match: { studentId: studentObj, isApproved: true } },
      { $group: { _id: null, reviewCount: { $sum: 1 } } },
    ])
    .toArray();

  const studentResult = studentStat[0] || { reviewCount: 0 };

  await db
    .collection('Student')
    .updateOne(
      { _id: studentObj },
      { $set: { reviewCount: studentResult.reviewCount } },
    );
};

module.exports = updateReviewStatus;
