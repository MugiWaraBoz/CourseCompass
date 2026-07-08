const database = require("../config/connect");
const ObjectId = require("mongodb").ObjectId;

const getCourses = async(req,res)=>{
    let db = database.getDb();
    let data = await db.collection("Course").find({}).toArray();
    
    if(data.length > 0){
        res.status(200).json({
            success: true, 
            data: {courses: data}
        });
    } else {
        console.log("No courses found");
        res.status(404).json({
            success: false, 
            message: "No courses found"
        });
    }
}


const getCourse = async(req,res)=>{
    let db = database.getDb();
    let data = await db.collection("Course").findOne({_id: new ObjectId(req.params.id)});
    if(data){
        res.status(200).json({success: true, data: data});
    } else {
        res.status(404).json({success: false, message: "Course not found"});
    }
}

module.exports = {
    getCourses,
    getCourse
};