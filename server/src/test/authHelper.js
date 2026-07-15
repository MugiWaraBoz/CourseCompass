const req = require("supertest")
const app = require("../app")

async function loginTestStudent(){
    const res = await req(app)
        .post("/auth/login")
        .send({
            email: "test@eastdelta.edu.bd",
            password: "password123"
        })
    return res.body.token
}

module.exports = {
    loginTestStudent
}