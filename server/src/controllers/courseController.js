const database = require("../config/connect");
const ObjectId = require("mongodb").ObjectId;

// Get all courses with optional filters, sorting, and pagination
const getCourses = async(req,res)=>{
    let db = database.getDb();
    
    const {
        search,
        department,
        sortBy,
        order,
        page,
        limit,
    } = req.query;

    const filter = {}

    if(department){
        filter.department = department;
    }

    if(search){
        /*
            The $or operator is used to perform a logical OR operation on an array of conditions.
            In this case, it is used to search for courses where either the name or code matches the search term.
        */
        filter.$or = [
            /*
                regex is used to perform pattern matching in MongoDB queries.
                In this case, it is used to search for courses where the name or code 
                contains the search term, regardless of case (case insensitive).
            */
            {name: { $regex: search, $options: "i"}}, // i = case insensitive
            {code: { $regex: search, $options: "i"}}, // i = case insensitive
        ];
    }

    const sort ={};
    if(sortBy == "rating"){
        sort["avgRating"] = order === "desc" ? -1 : 1;
    } else {
        sort[sortBy] = order === "desc" ? -1 : 1;
    }

    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skip = (pageNumber - 1) * limitNumber;

    // console.log(req.query);


    let data = await db
        .collection("Course")
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .toArray();
    
    
    const total = await db.collection("Course").countDocuments(filter);
    // console.log("Total courses found: ", total);
    // console.log("data_block: ", data);

    if(data.length > 0){
        res.status(200).json({
            success: true, 
            data: {
                courses: data,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total,
                    totalPages: Math.ceil(total / limitNumber)
                },
            },
        });
    } else {
        // console.log("No courses found");
        res.status(404).json({
            success: false, 
            error: {
                code: "NOT_FOUND",
                message: "No courses found"
            }
        });
    }
}

// Get a single course by ID
const getCourse = async(req,res)=>{
    let db = database.getDb();
    let data = await db.collection("Course").findOne({_id: new ObjectId(req.params.id)});
    let reviews = await db.collection("Review").find({courseId: new ObjectId(req.params.id)}).toArray();
    
    if(data){
        res.status(200).json({
            success: true, 
            data: {
                course: data,
            }
        });
    } else {
        res.status(404).json({
            success: false,
            error: {
                code: "NOT_FOUND",
                message: "Course not found"
            }
        });
    }
}

// Get reviews for a specific course with optional filters, sorting, and pagination
const getCourseReview = async(req,res)=>{
    let db = database.getDb();
    
    const {
        facultyId,
        sortBy,
        order = "desc",
        page,
        limit
    } = req.query;

    const filter = {
        courseId: new ObjectId(req.params.id)
    }
    
    if(facultyId){
        filter.facultyId = new ObjectId(facultyId);
    }
    
    const sort ={};
    if(sortBy == "recent"){
        sort["createdAt"] = order === "desc" ? -1 : 1;
    } if (sortBy == "votes"){
        sort["votescore"] = order === "desc" ? -1 : 1;
    } 
    else {
        sort[sortBy] = order === "desc" ? -1 : 1;
    }
    
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skip = (pageNumber - 1) * limitNumber;
    
    let reviews = await db
        .collection("Review")
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .toArray();

    const total = await db.collection("Review").countDocuments(filter);

    if(reviews){
        res.status(200).json({
            success: true, 
            data: {
                reviews: reviews,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total,
                    totalPages: Math.ceil(total / limitNumber)
                },
            }

        });
    } else {
        res.status(500).json({
            success: false,
            error: {
                code: "SERVER_ERROR",
                message: "An error occurred while fetching reviews"
            }
        });
    }
}

module.exports = {
    getCourses,
    getCourse,
    getCourseReview
};