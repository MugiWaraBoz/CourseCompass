const database = require("../config/connect");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");

require("dotenv").config({ path: "../../.env" });

// postReview function to handle posting a review
const postReview = async(req,res)=>{
    let db = database.getDb();
    const { 
        courseId, 
        facultyId,
        rating,
        difficultyRating,
        semester, 
        comment } = req.body;

    let chkReview = await db.collection("Review")
        .findOne({
            studentId: new ObjectId(req.student._id),
            facultyId: new ObjectId(facultyId),
        });

    // console.log("chkReview: ", chkReview);
    if(chkReview){
        // console.log("Review already exists for this student and faculty");
        res.status(400).json({
            success: false,
            "error": {
                "code": "REVIEW_EXISTS",
                "message": "You have already reviewed this course with this faculty"
            }
        });
    } else {
        let courseObj = {
            courseId: new ObjectId(courseId),
            facultyId: new ObjectId(facultyId),
        } 
        
        let course = await db
            .collection("CourseTake")
            .findOne({ courseId: new ObjectId(courseId), facultyId: new ObjectId(facultyId) });
        
        // console.log("course: ", course);

        if(!course){
            let insertCourse = await db
                .collection("CourseTake")
                .insertOne(courseObj);
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
        };

        let review = await db
            .collection("Review")
            .insertOne(reviewObj);
        
        res.status(201).json({
            success: true,
            data: {
                review : reviewObj,
            },
            message: "Review posted successfully",
        });

    }
    

    

}

// postReviewVote function to handle voting on a review
const postReviewVote = async(req,res)=>{
    let db = database.getDb();
    const { voteType } = req.body;

    const reviewId = req.params.id;
    const review = await db.collection("Review").findOne({_id: new ObjectId(reviewId)});
    const studentId = review.studentId;
    
    const filter ={
        reviewId: new ObjectId(reviewId),
        studentId: new ObjectId(studentId),
    }
    
    let vote = await db
        .collection("Vote")
        .findOne(filter);
    
    // console.log(vote);

    if(!vote){
        let voteObj = {
            reviewId: new ObjectId(reviewId),
            studentId: new ObjectId(studentId),
            voteType: voteType,
            createdAt: new Date(),
        };

        /*
            update the votecounts
        */
        if(voteType === "upvote") {
            let updateReview = await db
                .collection("Review")
                .updateOne({ 
                    _id: new ObjectId(reviewId) }, 
                    { 
                        $inc: { 
                            upvotes: 1,
                            votescore: 1 
                        },
                 });
        } else if(voteType === "downvote") {
            let updateReview = await db
                .collection("Review")
                .updateOne({ 
                    _id: new ObjectId(reviewId) }, 
                    { 
                        $inc: {
                             downvotes: 1,
                             votescore: -1
                         } 
                    });
        }

        let vote = await db
            .collection("Vote")
            .insertOne(voteObj);
        
        res.status(201).json({
            success: true,
            data: {
                vote: voteObj,
                message: "Vote recorded successfully",
            },
        });

    } else {
        /*
            if a vote exists, remove the vote and update the votecounts
        */
        if(vote.voteType === "upvote") {
            let updateReview = await db
            .collection("Review")
            .updateOne({ 
            _id: new ObjectId(reviewId) }, 
            { 
                $inc: {
                    upvotes: -1,
                    votescore: -1
                 } 
            });
        } else if(vote.voteType === "downvote") {
            let updateReview = await db
            .collection("Review")
            .updateOne({ 
                _id: new ObjectId(reviewId) }, 
                { 
                    $inc: { 
                        downvotes: -1,
                        votescore: -1 
                    },
            });
        }
            
        vote = await db
            .collection("Vote")
            .deleteOne(filter);
        
        res.status(200).json({
            success: true,
            data: {
                message: "Vote removed successfully",
            },
        });
    }
}

// patchReview function to handle updating a review
const patchReview = async(req,res)=>{

}


module.exports = {
    postReview,
    postReviewVote,
    patchReview,
};  

