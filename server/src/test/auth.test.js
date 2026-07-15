const req = require("supertest")
const app = require("../app")
const bcrypt = require("bcrypt")

describe("POST /auth/register", () => {
    test("Register a new student", async () => {
        const res = await req(app)
            .post("/auth/register")
            .send({
                name: "Jane Doe",
                studentIdNumber: "123456",
                email: "janedoe@eastdelta.edu.bd",
                password: "password123"
            })
            .expect(201)

        expect(res.body.success).toBe(true)
    })

    test("Register with an already taken email", async () => {
        const res = await req(app)
            .post("/auth/register")
            .send({
                name: "John Doe",
                studentIdNumber: "654321",
                email: "johndoe@eastdelta.edu.bd",
                password: "password123"
            })
            .expect(400)

        expect(res.body.success).toBe(false)
    })

    test("Register with an invalid email domain", async () => {
        const res = await req(app)
            .post("/auth/register")
            .send({
                name: "Invalid Email",
                studentIdNumber: "111111",
                email: "invalidemail@gmail.com",
                password: "password123"
            })
            .expect(400)

        expect(res.body.success).toBe(false)
    })

})

describe("POST /auth/login", () => {
    test("Login with valid credentials", async () => {
        const res = await req(app)
            .post("/auth/login")
            .send({
                email: "johndoe@eastdelta.edu.bd",
                password: "password123"
            })
            .expect(200)
            
        expect(res.body.success).toBe(true)
        // console.log(res.body.token)
        expect(res.body).toHaveProperty("token")

        expect(res.body.data.student.email).toBe("johndoe@eastdelta.edu.bd")

        expect(res.body.data.student.password).not.toBe("password123")
    })

    test("Login with invalid credentials", async () => {
        const res = await req(app)
            .post("/auth/login")
            .send({
                email: "johndoe@example.com",
                password: "wrongpassword"
            })
            .expect(401)

        expect(res.body.success).toBe(false)
    })
})

