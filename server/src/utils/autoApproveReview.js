require('dotenv').config({
  path: '../../.env',
  quiet: true, // Suppress warnings if the .env file is missing
});

module.exports = function autoApproveReview(reviewObj) {
  // Check if the review meets the criteria for auto-approval
  if (
    reviewObj.comment.length >=
    parseInt(process.env.AUTO_APPROVE_COMMENT_LENGTH)
  ) {
    const rejectWords = process.env.AUTO_REJECT_WORDS.split(',');
    for (const word of rejectWords) {
      console.log(`Checking if comment contains the word: ${word}`);
      if (reviewObj.comment.toLowerCase().includes(word.toLowerCase())) {
        reviewObj.isApproved = false;
        return reviewObj;
      }
    }
    reviewObj.isApproved = true;
  } else {
    reviewObj.isApproved = false;
  }
  return reviewObj;
};
