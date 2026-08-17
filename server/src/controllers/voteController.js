const ObjectId = require('mongodb').ObjectId;
const database = require('../config/connect');
// postReviewVote function to handle voting on a review
const postReviewVote = async (req, res) => {
  let db = database.getDb();
  const { voteType } = req.body;

  const reviewId = req.params.id;
  // const review = await db.collection("Review").findOne({_id: new ObjectId(reviewId)});
  const studentId = req.student._id;

  const filter = {
    reviewId: new ObjectId(reviewId),
    studentId: new ObjectId(studentId),
  };

  let vote = await db.collection('Vote').findOne(filter);

  // console.log(vote);

  if (!vote) {
    let voteObj = {
      reviewId: new ObjectId(reviewId),
      studentId: new ObjectId(studentId),
      voteType: voteType,
      createdAt: new Date(),
    };

    /*
            update the votecounts
        */
    if (voteType === 'upvote') {
      await db.collection('Review').updateOne(
        {
          _id: new ObjectId(reviewId),
        },
        {
          $inc: {
            upvotes: 1,
            votescore: 1,
          },
        }
      );
    } else if (voteType === 'downvote') {
      await db.collection('Review').updateOne(
        {
          _id: new ObjectId(reviewId),
        },
        {
          $inc: {
            downvotes: 1,
            votescore: -1,
          },
        }
      );
    } else {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_VOTE_TYPE',
          message: "Vote type must be either 'upvote' or 'downvote'",
        },
      });
    }

    await db.collection('Vote').insertOne(voteObj);

    res.status(201).json({
      success: true,
      data: {
        vote: voteObj,
        message: 'Vote recorded successfully',
      },
    });
  } else {
    /*
            if a vote exists, remove the vote and update the votecounts
        */
    //    console.log(vote);
    const oldVoteType = vote.voteType;
    const isSameVote = oldVoteType === voteType;

    const change = {
      upvotes: 0,
      downvotes: 0,
      votescore: 0,
    };

    if (oldVoteType === 'upvote') {
      change.upvotes--;
    } else {
      change.downvotes--;
    }

    if (!isSameVote) {
      if (voteType === 'upvote') {
        change.upvotes++;
      } else {
        change.downvotes++;
      }
    }

    const voteValue = {
      upvote: 1,
      downvote: -1,
    };

    change.votescore = isSameVote
      ? -voteValue[oldVoteType]
      : voteValue[voteType] - voteValue[oldVoteType];

    await db
      .collection('Review')
      .updateOne({ _id: new ObjectId(reviewId) }, { $inc: change });

    if (isSameVote) {
      await db.collection('Vote').deleteOne({
        _id: vote._id,
      });
      res.status(200).json({
        success: true,
        data: {
          message: 'Vote removed successfully',
        },
      });
    } else {
      await db
        .collection('Vote')
        .updateOne({ _id: vote._id }, { $set: { voteType } });
      res.status(200).json({
        success: true,
        data: {
          message: 'Vote changed successfully',
        },
      });
    }
  }
};

module.exports = {
  postReviewVote,
};
