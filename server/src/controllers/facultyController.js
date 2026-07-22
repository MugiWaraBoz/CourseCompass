const ObjectId = require("mongodb").ObjectId;

// Get all faculties with optional filters, sorting, and pagination
const getFaculties = async(req,res)=>{
    let db = database.getDb();
    
    const {
        search,
        department,
        designation,
        sortBy,
        order,
        page,
        limit
    } = req.query;

    const filter = {}

    if(department){
        filter.department = department;
    }

    if(designation){
        filter.designation = designation;
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
            {shortCode: { $regex: search, $options: "i"}}, // i = case insensitive
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

    


    let data = await db
        .collection("Faculty")
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .toArray();
    
    
    const total = await db.collection("Faculty").countDocuments(filter);


    if(data.length > 0){
        res.status(200).json({
            success: true, 
            data: {
                faculty: data,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    total,
                    totalPages: Math.ceil(total / limitNumber)
                },
            },
        });
    } else {
        
        res.status(404).json({
            success: false,
            "error" :{
                "code": "NOT_FOUND",
                "message": "No faculties found"
            } 
        });
    }
}

// Get a single faculty by ID
const getFaculty = async(req,res)=>{
    let db = database.getDb();
    let data = await db.collection("Faculty").findOne({_id: new ObjectId(req.params.id)});
    if(data){
        res.status(200).json({
            success: true, 
            data: data
        });
    } else {
        res.status(404).json({
            success: false, 
            "error" :{
                "code": "NOT_FOUND",
                "message": "Faculty not found"
            }
        });
    }
}

// Get reviews for a specific faculty with optional filters, sorting, and pagination
const getFacultyReview = async(req,res)=>{
    let db = database.getDb();
    
    const {
        courseId,
        sortBy,
        order = "desc",
        page,
        limit
    } = req.query;

    
    const filter = {
        facultyId: new ObjectId(req.params.id)
    }
    
    if(courseId){
        filter.courseId = new ObjectId(courseId);
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

    
    // console.log(reviews);
    // console.log("faculty param:", req.params.id);
    // console.log("filter:", filter);
    // console.log("sample review:", await db.collection("Review").findOne({}));

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
            "error": {
                "code": "SERVER_ERROR",
                "message": "An error occurred while fetching reviews"
            }
        });
    }
}

module.exports = {
    getFaculties,
    getFaculty,
    getFacultyReview
};