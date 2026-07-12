require("dotenv").config({ path: "../../.env.test" })
const req = require("supertest")
const app = require("../app")
const database = require("../config/connect")
const ObjectId = require("mongodb").ObjectId

/*
    this beforeAll hook is used to set up the testing environment 
    before any tests are run.
*/
beforeAll(async () => {
    process.env.NODE_ENV = "test"
    process.env.MONGO_URI = 
        "mongodb://localhost:27017/MyLocalDatabase"

    await database.connectToServer()
})

/*
    beforeEach hook is used to set up the database 
    state before each test is run.
*/
beforeEach(async () => {
    const db = database.getDb()
    await db.collection("Course").deleteMany({})
    await db.collection("Course").insertMany([
        {
            _id: new ObjectId("64d123456789abcdef123451"),
            code: "CSE 113",
            name: "Structured Programming Language",
            department: "CSE",
            credit: 3,
            avgRating: 4.5,
            reviewCount: 0,
        },
        {
            _id: new ObjectId("64d123456789abcdef123452"),
            code: "CSE 221",
            name: "Data Structures",
            department: "CSE",
            credit: 1,
            avgRating: 1.2,
            reviewCount: 10,
        },
        {
            _id: new ObjectId("64d123456789abcdef123453"),
            code: "EEE 101",
            name: "Basic Electrical Engineering",
            department: "EEE",
            credit: 2,
            avgRating: 5,
            reviewCount: 5,
        }
    ])
})

/*
    afterAll hook is used to clean up the database
*/
afterAll(async () => {
    const db = database.getDb()
    await db.collection("Course").deleteMany({})
})


/*
    describe block is used to group related tests together.
*/
describe("GET /courses", () => {
    test("Return all courses", async ()=> {
        const res = await req(app)
            .get("/courses")
            .expect(200)
        // console.log(res.body);
        expect(res.body.success).toBe(true)
        expect(res.body.data.courses.length).toBeGreaterThan(0)

        expect(res.body.data.courses[0]).toEqual(
            expect.objectContaining({
                code: expect.any(String),
                name: expect.any(String),
                department: expect.any(String),
                credit: expect.any(Number),
            })
        )
    })

    test("Filter courses using name", async ()=> {
        const res = await req(app)
            .get("/courses")
            .query({search: "data"})
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.courses).toHaveLength(1)
        expect(res.body.data.courses[0].name).toBe("Data Structures")
    })

    test("Filter courses using department", async ()=> {
        const res = await req(app)
            .get("/courses")
            .query({department: "EEE"})
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.courses).toHaveLength(1)
        expect(res.body.data.courses[0].name).toBe("Basic Electrical Engineering")
    })

    test("Filter courses using Code", async ()=> {
        const res = await req(app)
            .get("/courses")
            .query({search: "CSE 221"})
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.courses).toHaveLength(1)
        expect(res.body.data.courses[0].name).toBe("Data Structures")
    })

    test("Pagination course", async ()=> {
        const res = await req(app)
            .get("/courses")
            .query({
                page: 1,
                limit: 1,
            })
            .expect(200)
    

        expect(res.body.success).toBe(true)
        expect(res.body.data.courses).toHaveLength(1)
        expect(res.body.data.pagination).toEqual({
            page: 1,
            limit: 1,
            total: 3,
            totalPages: 3,
        })
    })

    test("Sort courses by name in asc order", async ()=> {
        const res = await req(app)
            .get("/courses")
            .query({
                sortBy: "name",
                order: "asc",
            })
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.courses).toHaveLength(3)
        expect(res.body.data.courses[0].name).toBe("Basic Electrical Engineering")
        expect(res.body.data.courses[1].name).toBe("Data Structures")
        expect(res.body.data.courses[2].name).toBe("Structured Programming Language")
    })

    test("Sort courses by Rating in asc order", async ()=> {
        const res = await req(app)
            .get("/courses")
            .query({
                sortBy: "rating",
                order: "asc",
            })
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.courses).toHaveLength(3)
        expect(res.body.data.courses[0].name).toBe("Data Structures")
        expect(res.body.data.courses[1].name).toBe("Structured Programming Language")
    })

    test("Sort courses by Credit in asc order", async ()=> {
        const res = await req(app)
            .get("/courses")
            .query({
                sortBy: "credit",
                order: "asc",
            })
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.courses).toHaveLength(3)
        expect(res.body.data.courses[0].name).toBe("Data Structures")
        expect(res.body.data.courses[1].name).toBe("Basic Electrical Engineering")
        expect(res.body.data.courses[2].name).toBe("Structured Programming Language")
    })
})

describe("GET /courses/:id", ()=> {
    test("Return a specific course by ID", async ()=> {
        const res = await req(app)
            .get("/courses/64d123456789abcdef123451")
            .expect(200)
        // console.log(res.body);
        expect(res.body.success).toBe(true)
        console.log(res.body.data.course.code)
        expect(res.body.data.course.code).toBe("CSE 113")
        expect(res.body.data.course.name).toBe("Structured Programming Language")
    })
})