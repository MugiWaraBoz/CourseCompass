const database = require("../config/connect");
const ObjectId = require("mongodb").ObjectId;

const getCourses = async(req,res)=>{
    let db = database.getDb();
    
    const {
        search,
        department,
        sortBy,
        order,
        page,
        limit
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
    sort[sortBy] = order === "desc" ? -1 : 1;

    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skip = (pageNumber - 1) * limitNumber;

    console.log(req.query);


    let data = await db
        .collection("Course")
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .toArray();
    
    
    const total = await db.collection("Course").countDocuments(filter);
    console.log("Total courses found: ", total);
    console.log("data_block: ", data);

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