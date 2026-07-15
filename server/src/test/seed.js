const ObjectId = require("mongodb").ObjectId
const database = require("../config/connect")
const bcrypt = require("bcrypt")

const clearDB = async () => {
    let db = database.getDb()
    await db.collection("Student").deleteMany({})
    await db.collection("Course").deleteMany({})
    await db.collection("Faculty").deleteMany({})
    await db.collection("Rating").deleteMany({})
    await db.collection("Review").deleteMany({})
    await db.collection("Vote").deleteMany({})
    await db.collection("CourseTake").deleteMany({})
}

const seedDB = async () => {
    
    let db = database.getDb()
    // seed Course collection
    await db.collection("Course").insertMany([
        {
            _id: new ObjectId("64d123456789abcdef1234c1"),
            code: "CSE 113",
            name: "Structured Programming Language",
            department: "CSE",
            credit: 3,
            avgRating: 4.5,
            reviewCount: 0,
        },
        {
            _id: new ObjectId("64d123456789abcdef1234c2"),
            code: "CSE 221",
            name: "Data Structures",
            department: "CSE",
            credit: 1,
            avgRating: 1.2,
            reviewCount: 10,
        },
        {
            _id: new ObjectId("64d123456789abcdef1234c3"),
            code: "EEE 101",
            name: "Basic Electrical Engineering",
            department: "EEE",
            credit: 2,
            avgRating: 5,
            reviewCount: 5,
        }
    ])

    // seed Faculty collection
    await db.collection("Faculty").insertMany([
        {
            _id: new ObjectId("64d123456789abcdef1234f1"),
            name: "Dr. John Doe",
            shortCode: "JD",
            department: "CSE",
            designation: "Professor",
            avgRating: 4.5,
        },
        {
            _id: new ObjectId("64d123456789abcdef1234f2"),
            name: "Dr. Jane Smith",
            shortCode: "JS",
            department: "EEE",
            designation: "Associate Professor",
            avgRating: 4.2,
        }
    ])

    // seed Student collection
    await db.collection("Student").insertOne({
        _id: new ObjectId("64d123456789abcdef1234a1"),
        name: "John Doe",
        email: "johndoe@eastdelta.edu.bd",
        password: await bcrypt.hash("password123", 10),
        createdAt: "2023-09-01T10:00:00Z",
        updatedAt: "2023-09-01T10:00:00Z",
    })

    // seed Review collection
    await db.collection("Review").insertMany([
        {
            _id: new ObjectId("64d123456789abcdef1234d1"),
            studentId: new ObjectId("64d123456789abcdef1234a1"),
            courseId: new ObjectId("64d123456789abcdef1234c1"),
            facultyId: new ObjectId("64d123456789abcdef1234f1"),
            rating: 4,
            difficultyRating: 3,
            semester: "Fall 2023",
            comment: "Great course!",
            createdAt: "2023-09-01T10:00:00Z",
            updatedAt: "2023-09-01T10:00:00Z",
            upvotes: 5,
            downvotes: 2,
            votescore: 3,
        },
        {
            _id: new ObjectId("64d123456789abcdef1234d2"),
            studentId: new ObjectId("64d123456789abcdef1234a1"),
            courseId: new ObjectId("64d123456789abcdef1234c2"),
            facultyId: new ObjectId("64d123456789abcdef1234f1"),
            rating: 4,
            difficultyRating: 3,
            semester: "Spring 2023",
            comment: "Good course!",
            createdAt: "2023-03-01T10:00:00Z",
            updatedAt: "2023-03-01T10:00:00Z",
            upvotes: 3,
            downvotes: 1,
            votescore: 2,
        },
        {
            _id: new ObjectId("64d123456789abcdef1234d3"),
            studentId: new ObjectId("64d123456789abcdef1234a1"),
            courseId: new ObjectId("64d123456789abcdef1234c1"),
            facultyId: new ObjectId("64d123456789abcdef1234f2"),
            rating: 5,
            difficultyRating: 4,
            semester: "Fall 2023",
            comment: "Excellent course!",
            createdAt: "2023-09-01T10:00:00Z",
            updatedAt: "2023-09-01T10:00:00Z",
            upvotes: 8,
            downvotes: 0,
            votescore: 8,
        },
        {
            _id: new ObjectId("64d123456789abcdef1234d4"),
            studentId: new ObjectId("64d123456789abcdef1234a1"),
            courseId: new ObjectId("64d123456789abcdef1234c2"),
            facultyId: new ObjectId("64d123456789abcdef1234f2"),
            rating: 3,
            difficultyRating: 2,
            semester: "Spring 2023",
            comment: "Average course.",
            createdAt: "2023-03-01T10:00:00Z",
            updatedAt: "2023-03-01T10:00:00Z",
            upvotes: 1,
            downvotes: 2,
            votescore: -1,
        }
    ])

}

module.exports = {
    seedDB,
    clearDB,
}