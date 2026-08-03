
# Folder Structure:
```
server/
│
├── node_modules/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   │
│   ├── models/                 # For mongoose models -- not yet implemented 
│   │   ├── Student.js
│   │   ├── Course.js
│   │   ├── Faculty.js
│   │   ├── Review.js
│   │   ├── Vote.js
│   │   └── ClassTake.js
│   │
│   ├── routes/                 # For express routes
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── facultyRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── voteRoutes.js
│   │
│   ├── controllers/            # For express controllers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── facultyController.js
│   │   ├── reviewController.js
│   │   └── voteController.js
│   │
│   ├── middleware/             # For express middleware
|   |   ├── hashPassword.js        
│   │   └── authMiddleware.js
│   │
│   ├── utils/                  # For utility functions
│   │   └── updateReviewStatus.js
│   │ 
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```
# Backend Progress

## ✅ Finished

### Authentication
- [✅] Register
- [✅] Login

### Student
- [✅] Student info
- [✅] Student reviews
- [✅] Student profile update

### Courses
- [✅] Course info
- [✅] Course reviews

### Faculty
- [✅] Faculty info
- [✅] Faculty reviews

### Reviews
- [✅] Create review
- [✅] Update review
- [✅] Delete review

### Votes
- [✅] Create vote
- [✅] Update vote
- [✅] Delete vote

---
# Test
- [ ] Write tests for all endpoints - 5 test created
- [ ] CI - continious integration, setup for backend

---

# Planned Optimization (Current Project)
- [✅] Database optimization

---

# Planned (Current Project)

- [ ] Statistics endpoint (`GET /courses/:id/stats`) for charts
- [ ] Recently reviewed endpoint (`GET /reviews/recent`)
- [ ] Environment variable validation on server startup
- [ ] Password reset

---

# Planned AI (Current Project)
- [ ] Course detail from ai (GET /courses/:id/ai)
- [ ] Faculty/Course review overview from ai ( GET /courses/:id/reviews/ai, GET /faculties/:id/reviews/ai)

---

# Future Improvements
 

## Authentication & Security
- [ ] Role-based access control (Admin, Student, Moderator)
- [ ] Bookmark/Favorite courses
- [ ] Two-factor authentication (2FA)

## Authentication Alternatives
- [ ] Evaluate Firebase Authentication
