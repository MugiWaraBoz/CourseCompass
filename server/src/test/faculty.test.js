const req = require("supertest")
const app = require("../app")
const { loginTestStudent } = require("./authHelper")

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
            .get("/faculty/64d123456789abcdef1234f1")
            .expect(200)
        // console.log(res.body);
        expect(res.body.success).toBe(true)
        console.log(res.body.data.shortCode)
        expect(res.body.data.shortCode).toBe("JD")
        expect(res.body.data.name).toBe("Dr. John Doe")
        
    })
})

describe("GET /faculty/:id/reviews", ()=> {
    test("Pagination faculty reviews", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/faculty/64d123456789abcdef1234f1/reviews")
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

    test("Sort faculty by recent in asc order", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/faculty/64d123456789abcdef1234f2/reviews")
            .query({
                sortBy: "recent",
                order: "asc",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(2)
        expect(res.body.data.reviews[0].courseId).toBe("64d123456789abcdef1234c2")
        expect(res.body.data.reviews[1].courseId).toBe("64d123456789abcdef1234c1")
    })

    test("Sort faculty by Rating in asc order", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/faculty/64d123456789abcdef1234f2/reviews")
            .query({
                sortBy: "rating",
                order: "asc",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(2)
        expect(res.body.data.reviews[0].courseId).toBe("64d123456789abcdef1234c2")
        expect(res.body.data.reviews[1].courseId).toBe("64d123456789abcdef1234c1")
    })
    
    test("Sort faculty by Rating in asc order", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/faculty/64d123456789abcdef1234f2/reviews")
            .query({
                sortBy: "votes",
                order: "asc",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(2)
        expect(res.body.data.reviews[0].courseId).toBe("64d123456789abcdef1234c2")
        expect(res.body.data.reviews[1].courseId).toBe("64d123456789abcdef1234c1")
    })
    
    test("Return reviews for a specific faculty by ID when authenticated", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/faculty/64d123456789abcdef1234f2/reviews")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
        
        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(2)
        console.log(res.body.data.reviews);
    })

    test("Return review for a specific faculty + course ID when authenticated", async ()=> {
        const token = await loginTestStudent()
        const res = await req(app)
            .get("/faculty/64d123456789abcdef1234f2/reviews")
            .query({
                courseId: "64d123456789abcdef1234c2",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
        
        expect(res.body.success).toBe(true)
        expect(res.body.data.reviews).toHaveLength(1)
        // console.log(res.body.data.reviews);
    })

})