const req = require("supertest")
const app = require("../app")
const { loginTestStudent } = require("./authHelper")

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
            .get("/courses/64d123456789abcdef1234c2")
            .expect(200)
        // console.log(res.body);
        expect(res.body.success).toBe(true)
        console.log(res.body.data.course.code)
        expect(res.body.data.course.code).toBe("CSE 221")
        expect(res.body.data.course.name).toBe("Data Structures")
    })
})

describe("GET /courses/:id/reviews", ()=> {
    test("Return reviews for a specific course by ID when authenticated", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/courses/64d123456789abcdef1234c2/reviews")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
        
        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(2)
        console.log(res.body.data.reviews);
    })
})

describe("GET /courses/:id/reviews", ()=> {
    test("Pagination course reviews", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/courses/64d123456789abcdef1234c2/reviews")
            .query({
                page: 1,
                limit: 1,
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
    

        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(1)
        expect(res.body.data.pagination).toEqual({
            page: 1,
            limit: 1,
            total: 2,
            totalPages: 2,
        })
    })

    test("Sort course by recent in asc order", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/courses/64d123456789abcdef1234c2/reviews")
            .query({
                sortBy: "recent",
                order: "asc",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(2)
        expect(res.body.data.reviews[0].facultyId).toBe("64d123456789abcdef1234f1")
        expect(res.body.data.reviews[1].facultyId).toBe("64d123456789abcdef1234f2")
    })

    test("Sort course by Rating in asc order", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/courses/64d123456789abcdef1234c2/reviews")
            .query({
                sortBy: "rating",
                order: "asc",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(2)
        expect(res.body.data.reviews[0].facultyId).toBe("64d123456789abcdef1234f2")
        expect(res.body.data.reviews[1].facultyId).toBe("64d123456789abcdef1234f1")
    })
    
    test("Sort course by Votes in asc order", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/courses/64d123456789abcdef1234c2/reviews")
            .query({
                sortBy: "votes",
                order: "asc",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(2)
        expect(res.body.data.reviews[0].facultyId).toBe("64d123456789abcdef1234f2")
        expect(res.body.data.reviews[1].facultyId).toBe("64d123456789abcdef1234f1")
    })
    
    test("Return reviews for a specific course by ID when authenticated", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/courses/64d123456789abcdef1234c2/reviews")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
        
        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(2)
        console.log(res.body.data.reviews);
    })

    test("Return review for a specific faculty + course ID when authenticated", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/courses/64d123456789abcdef1234c2/reviews")
            .query({
                facultyId: "64d123456789abcdef1234f2",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
        
        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(1)
        // console.log(res.body.data.reviews);
    })

})