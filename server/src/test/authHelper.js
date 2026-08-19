const req = require('supertest');
const app = require('../app');

async function loginTestStudent() {
  const res = await req(app).post('/auth/login').send({
    email: 'johndoe@eastdelta.edu.bd',
    password: 'password123',
  });

  if (res.statusCode !== 200) {
    throw new Error(
      `Test login failed: ${res.statusCode} ${JSON.stringify(res.body)}`,
    );
  }
  return res.body.token;
}

module.exports = {
  loginTestStudent,
};
