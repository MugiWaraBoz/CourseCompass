const ObjectId = require("mongodb").ObjectId
require("dotenv").config({ path: "../../.env" })
const database = require("../config/connect")
const generateAIResponse  = require("../services/aiServices")
const  { buildReviewSummaryInput, generatePrompt }  = require("../utils/aiUtils")

const testAIResponse = async (req, res) => {
    const prompt = "Explain how AI works in a few words";
    try {
        const aiResponse = await generateAIResponse(prompt);
        console.log(aiResponse);
        res.status(200).json({
            success: true,
            data: aiResponse
        });
    } catch (error) {
        console.error("Error generating AI response:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "AI_RESPONSE_ERROR",
                message: "Failed to generate AI response"
            }
        })
    }
}

const courseReviewAiResponse = async (req, res) => {
    let db = database.getDb();
    
    let reviews = await db.collection("Review").find({
        courseId: new ObjectId(req.params.id)
    }).toArray();


    // Get the course and faculty information for each review
    const faculty = await db.collection("Faculty").find().toArray();
    const course = await db.collection("Course").findOne({ _id: new ObjectId(req.params.id) })
    const courseName = course ? course.name : "Unknown Course";

    const mapFaculty = new Map(
        faculty.map(faculty => [faculty._id.toString(), faculty.name])
    )

    // data filtering for AI input
    let reviewTexts = reviews.map( (review) => ({
        facultyName: mapFaculty.get(review.facultyId.toString()) || "Unknown Faculty",
        courseName: courseName,
        rating: review.rating,
        difficultyRating: review.difficultyRating,
        comment: review.comment,
        voteScore: review.voteScore,
        semester: review.semester
    }))
    
    const filteredDataforAiInput = buildReviewSummaryInput(reviewTexts);
    const prompt = generatePrompt(reviewTexts, filteredDataforAiInput, "course")

    // console.log("Prompt for AI: ", prompt);
    // return res.status(200).json({
    //     success: true,
    //     data: prompt
    // })
    
    if(reviews.length < 5){
        return res.status(400).json({
            success: false,
            error: {
                code: "NOT_ENOUGH_REVIEWS",
                message: "Not enough reviews to generate a summary"
            }
        });
    }

    try {
        const aiResponse = await generateAIResponse(prompt);
        console.log(aiResponse);
        res.status(200).json({
            success: true,
            data: {
                summary: aiResponse
            },
            message: "AI response generated successfully"
        });
    } catch (error) {
        console.error("Error generating AI response:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "AI_RESPONSE_ERROR",
                message: "Failed to generate AI response"
            }
        })
    }
}

const facultyReviewAiResponse = async (req, res) => {
    let db = database.getDb();
    
    let reviews = await db.collection("Review").find({
        facultyId: new ObjectId(req.params.id)
    }).toArray();
    
    // Get the course and faculty information for each review
    const course = await db.collection("Course").find().toArray();
    const faculty = await db.collection("Faculty").findOne({ _id: new ObjectId(req.params.id) })
    const facultyName = faculty ? faculty.name : "Unknown Faculty";
    const mapCourse = new Map(
        course.map(course => [course._id.toString(), course.name])
    )

    // data filtering for AI input
    let reviewTexts = reviews.map((review) => ({
            
        courseName: mapCourse.get(review.courseId.toString()) || "Unknown Course",
        facultyName: facultyName,
        rating: review.rating,
        difficultyRating: review.difficultyRating,
        comment: review.comment,
        voteScore: review.voteScore,
        semester: review.semester,
        
    }))
    const filteredDataforAiInput = buildReviewSummaryInput(reviewTexts);
    const prompt = generatePrompt(reviewTexts, filteredDataforAiInput, "faculty")

    // console.log("Prompt for AI: ", prompt);
    // return res.status(200).json({
    //     success: true,
    //     data: prompt
    // })

    if(reviews.length < 5){
        return res.status(400).json({
            success: false,
            error: {
                code: "NOT_ENOUGH_REVIEWS",
                message: "Not enough reviews to generate a summary"
            }
        });
    }

    try {
        const aiResponse = await generateAIResponse(prompt);
        console.log(aiResponse);
        res.status(200).json({
            success: true,
            data: {
                summary: aiResponse
            },
            message: "AI response generated successfully"
        });
    } catch (error) {
        console.error("Error generating AI response:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "AI_RESPONSE_ERROR",
                message: "Failed to generate AI response"
            }
        })
    }
}

module.exports = {
    testAIResponse,
    facultyReviewAiResponse,
    courseReviewAiResponse
};
