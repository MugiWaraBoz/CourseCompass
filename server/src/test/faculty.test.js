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
    await db.collection("Faculty").deleteMany({})
    await db.collection("Faculty").insertMany([
        {
            _id: new ObjectId("64d123456789abcdef123451"),
            name: "Dr. John Doe",
            shortCode: "JD",
            department: "CSE",
            designation: "Professor",
            avgRating: 4.5,
        },
        {
            _id: new ObjectId("64d123456789abcdef123452"),
            name: "Dr. Jane Smith",
            shortCode: "JS",
            department: "EEE",
            designation: "Associate Professor",
            avgRating: 4.2,
        }
    ])
})

/*
    afterAll hook is used to clean up the database
*/
afterAll(async () => {
    const db = database.getDb()
    await db.collection("Faculty").deleteMany({})
})


/*
    describe block is used to group related tests together.
*/
describe("GET /faculty", () => {
    test("Return all faculty members", async ()=> {
        const res = await req(app)
            .get("/faculty")
            .expect(200)
        // console.log(res.body);
        expect(res.body.success).toBe(true)
        expect(res.body.data.faculty.length).toBeGreaterThan(0)

        expect(res.body.data.faculty[0]).toEqual(
            expect.objectContaining({
                shortCode: expect.any(String),
                name: expect.any(String),
                department: expect.any(String),
                designation: expect.any(String),
                avgRating: expect.any(Number),
            })
        )
    })

    test("Filter faculty using name", async ()=> {
        const res = await req(app)
            .get("/faculty")
            .query({search: "John"})
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.faculty).toHaveLength(1)
        expect(res.body.data.faculty[0].name).toBe("Dr. John Doe")
    })

    test("Filter faculty using department", async ()=> {
        const res = await req(app)
            .get("/faculty")
            .query({department: "EEE"})
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.faculty).toHaveLength(1)
        expect(res.body.data.faculty[0].name).toBe("Dr. Jane Smith")
    })

    test("Filter faculty using shortCode", async ()=> {
        const res = await req(app)
            .get("/faculty")
            .query({search: "JS"})
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.faculty).toHaveLength(1)
        expect(res.body.data.faculty[0].name).toBe("Dr. Jane Smith")
    })

    test("Pagination faculty", async ()=> {
        const res = await req(app)
            .get("/faculty")
            .query({
                page: 1,
                limit: 1,
            })
            .expect(200)
    

        expect(res.body.success).toBe(true)
        expect(res.body.data.faculty).toHaveLength(1)
        expect(res.body.data.pagination).toEqual({
            page: 1,
            limit: 1,
            total: 2,
            totalPages: 2,
        })
    })

    test("Sort faculty by name in asc order", async ()=> {
        const res = await req(app)
            .get("/faculty")
            .query({
                sortBy: "name",
                order: "asc",
            })
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.faculty).toHaveLength(2)
        expect(res.body.data.faculty[0].name).toBe("Dr. Jane Smith")
        expect(res.body.data.faculty[1].name).toBe("Dr. John Doe")
    })

    test("Sort faculty by Rating in asc order", async ()=> {
        const res = await req(app)
            .get("/faculty")
            .query({
                sortBy: "rating",
                order: "asc",
            })
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.faculty).toHaveLength(2)
        expect(res.body.data.faculty[0].name).toBe("Dr. Jane Smith")
        expect(res.body.data.faculty[1].name).toBe("Dr. John Doe")
    })

})

describe("GET /faculty/:id", ()=> {
    test("Return a specific faculty by ID", async ()=> {
        const res = await req(app)
            .get("/faculty/64d123456789abcdef123451")
            .expect(200)
        // console.log(res.body);
        expect(res.body.success).toBe(true)
        console.log(res.body.data.shortCode)
        expect(res.body.data.shortCode).toBe("JD")
        expect(res.body.data.name).toBe("Dr. John Doe")
    })
})

