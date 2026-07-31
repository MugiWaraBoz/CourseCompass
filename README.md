<div align="center">

<img src="./misc/course_compass_logo.png" alt="Course_compass_logo" width="500">

# Course Compass

![React]
![vite]
![Tailwind CSS]
![shadcn/ui]
![Node.js]
![Express.js]
![MongoDB]
![JWT]
![Axios]

*A modern course review platform for university students.*

CourseCompass helps students make informed academic decisions by providing transparent course and faculty reviews. Students can discover courses, rate instructors, share experiences, and optionally post reviews anonymously.

</div>

# Tech Stack
| **Component** | **Technology** | **Description** |
| :------------ | :------------- | :-------------- |
| **Frontend** | <img src="https://skillicons.dev/icons?i=react,vite,tailwind" height="40" /> <img src="https://avatars.githubusercontent.com/u/139895814?s=200&v=4" height="40" /> | Modern and responsive user interface. |
| **Backend** | <img src="https://skillicons.dev/icons?i=nodejs,express" height="40" /> | RESTful API and server-side logic. |
| **Database** | <img src="https://skillicons.dev/icons?i=mongodb" height="40" /> | MongoDB stores application data and reviews. |
| **Authentication** | <img src="https://skillicons.dev/icons?i=nodejs" height="40" /> <img src="https://jwt.io/img/pic_logo.svg" height="40" /> | JWT for Secure authentication and password hashing. |
| **Testing** | <img src="https://skillicons.dev/icons?i=jest" height="40" /> | Jest+Supertest for API testing and endpoint validation. |
| **Development** | <img src="https://skillicons.dev/icons?i=git,github,vscode,postman" height="40" /> | Version control, development, and API testing. |


# Features
* Student registration and JWT authentication
* University email verification
* Course and faculty browsing
* Anonymous and public course reviews
* Faculty and course rating system
* Review upvote/downvote functionality
* Filtering, sorting, and pagination
* Duplicate review prevention
* Automatic average rating and review count updates
* RESTful API with consistent response structure


# ⚡Quick Start
### Prerequisites

- Node.js 24+
- MongoDB (Local or Atlas)
- Git

### Clone Repository


```
git clone https://github.com/MugiWaraBoz/CourseCompass
```

### Frontend
> work in progress...

> Runs at : `http://localhost:5173/`

### Backend

Run the following commands in the `./server` directory:

```bash
npm install
npm run server
```
> Runs at : `http://localhost:3000/`


## Environment Variables

### Frontend
Create a copy of `.env_example` and name it `.env`

```
```

### Backend
Create a copy of `.env_example` and name it `.env`
```
# Database connection string
MONGO_URL= --your mongodb url--
DB_NAME= --your database name--

# Server port
API_PORT=3000 -- dont change this!!

# JWT secret key
JWT_SECRET= --any-text-- -/or/- --generate-a-secreat-key--
```

# API Documentation

### Response Format

All responses are returned in JSON format.

Successful responses will have a `success` field set to `true`, 
```json
{
  "success": true,
  "data": {
    "student": {
      ...
    },
    "token": "eyJhbGciOi..."
  }
}
```
while error responses will have it set to `false`. Error responses will also include an `error` field with a descriptive message.
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid registration data"
  }
}
```

### Authentication

### Authentication

Protected endpoints require a JWT in the request header:

```http
Authorization: Bearer <token>
```

| Symbol | Meaning |
| :--: | :-- |
| No | Public endpoint |
| Yes | Valid JWT required |
| Owner | JWT required and the resource must belong to the logged-in student |

---

### Auth — `/api/auth`

| **Method** | **Endpoint** | **Purpose** | **Auth Required** | **Parameters** | **Status Codes** |
| :-- | :-- | :-- | :--: | :-- | :-- |
| **POST** | `/api/auth/register` | Register a student | No | Request body | `201`, `400`|
| **POST** | `/api/auth/login` | Log in a student | No | Request body | `200`, `401`|

### Request Body Parameters

#### Register

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `name` | string | Yes | Student's full name |
| `studentIdNumber` | string | Yes | University student ID |
| `email` | string | Yes | University email address |
| `password` | string | Yes | Account password |

#### Login

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `email` | string | Yes | Registered email address |
| `password` | string | Yes | Account password |

### Example Request

Request: `POST /api/auth/register`

```json
{
  "name": "Rafi Ahmed",
  "studentIdNumber": "u1904001",
  "email": "rafi@eastdelta.edu.bd",
  "password": "password123"
}
```

### Example Response (`201`):

```json
{
  "success": true,
  "data": {
    "student": {
      "id": "665fstudent",
      "name": "Rafi Ahmed",
      "studentIdNumber": "242011111",
      "email": "rafi@eastdelta.edu.bd",
      "photoUrl": "",
      "cgpa": null,
      "verified": false
    },
    "token": "eyJhbGciOi..."
  }
}
```

---

## Students — `/api/students`

| **Method** | **Endpoint** | **Purpose** | **Auth Required** | **Parameters** | **Status Codes** |
| :-- | :-- | :-- | :--: | :-- | :-- |
| **GET** | `/api/students/me` | Get logged-in student profile | Yes | None | `200`, `404` |
| **GET** | `/api/students/:id` | Get a student profile | No | Path: `id` | `200`, `404` |
| **GET** | `/api/students/me/reviews` | Get logged-in student's reviews | Yes | Query: `page`, `limit` | `200`, `404` |
| **PATCH** | `/api/students/me` | Update logged-in student profile | Owner | Request body | `200`, `404` |

### Path Parameters

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `id` | string | Yes | Student ID |

### Query Parameters

| **Parameter** | **Type** | **Required** | **Default** | **Description** |
| :-- | :-- | :--: | :-- | :-- |
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `10` | Reviews per page |

### Update Profile Body

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `name` | string | No | Updated student name |
| `photoUrl` | string | No | Profile picture URL |
| `cgpa` | number | No | Updated CGPA |

### Example Request

Request: `GET /api/students/me`

```http
Authorization: Bearer <token>
```

### Example Response (`200`):

```json
{
  "success": true,
  "data": {
    "student": {
      "id": "665fstudent",
      "name": "Rafi Ahmed",
      "studentIdNumber": "u1904001",
      "email": "rafi@eastdelta.edu.bd",
      "photoUrl": "",
      "cgpa": 3.7,
      "verified": false
    }
  }
}
```

---

## Courses — `/api/courses`

| **Method** | **Endpoint** | **Purpose** | **Auth Required** | **Parameters** | **Status Codes** |
| :-- | :-- | :-- | :--: | :-- | :-- |
| **GET** | `/api/courses` | Get all courses | No | Query parameters | `200`, `404` |
| **GET** | `/api/courses/:id` | Get a course by ID | No | Path: `id` | `200`, `404` |
| **GET** | `/api/courses/:id/reviews` | Get reviews for a course | No | Path and query parameters | `200`, `404` |

### Path Parameters

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `id` | ObjectId | Yes | MongoDB course ID |

### Course List Query Parameters

| **Parameter** | **Type** | **Required** | **Default** | **Description** |
| :-- | :-- | :--: | :-- | :-- |
| `search` | string | No | — | Search by course name or code |
| `department` | string | No | — | Filter by department |
| `sortBy` | string | No | `name` | `name`, `rating`, or `credit` |
| `order` | string | No | `asc` | `asc` or `desc` |
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `10` | Courses per page |

### Course Review Query Parameters

| **Parameter** | **Type** | **Required** | **Default** | **Description** |
| :-- | :-- | :--: | :-- | :-- |
| `facultyId` | ObjectId | No | — | Filter reviews by faculty |
| `sortBy` | string | No | `recent` | `recent`, `rating`, or `votes` |
| `order` | string | No | `desc` | `asc` or `desc` |
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `10` | Reviews per page |

### Example Request

Request:

```http
GET /api/courses?department=CSE&sortBy=rating&order=desc&page=1&limit=10
```

### Example Response (`200`):

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "665fcourse",
        "code": "CSE 221",
        "name": "Data Structures",
        "department": "CSE",
        "credit": 3,
        "avgRating": 4.5,
        "reviewCount": 12
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

## Faculty — `/api/faculty`

| **Method** | **Endpoint** | **Purpose** | **Auth Required** | **Parameters** | **Status Codes** |
| :-- | :-- | :-- | :--: | :-- | :-- |
| **GET** | `/api/faculty` | Get all faculty members | No | Query parameters | `200`, `404` |
| **GET** | `/api/faculty/:id` | Get a faculty member by ID | No | Path: `id` | `200`, `404` |
| **GET** | `/api/faculty/:id/reviews` | Get reviews for a faculty member | No | Path and query parameters | `200`, `404` |

### Path Parameters

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `id` | ObjectId | Yes | MongoDB faculty ID |

### Faculty List Query Parameters

| **Parameter** | **Type** | **Required** | **Default** | **Description** |
| :-- | :-- | :--: | :-- | :-- |
| `search` | string | No | — | Search by name or short code |
| `department` | string | No | — | Filter by department |
| `designation` | string | No | — | Filter by designation |
| `sortBy` | string | No | `name` | `name` or `rating` |
| `order` | string | No | `asc` | `asc` or `desc` |
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `10` | Faculty members per page |

### Faculty Review Query Parameters

| **Parameter** | **Type** | **Required** | **Default** | **Description** |
| :-- | :-- | :--: | :-- | :-- |
| `courseId` | ObjectId | No | — | Filter reviews by course |
| `sortBy` | string | No | `recent` | `recent`, `rating`, or `votes` |
| `order` | string | No | `desc` | `asc` or `desc` |
| `page` | number | No | `1` | Page number |
| `limit` | number | No | `10` | Reviews per page |

### Example Request

Request:

```http
GET /api/faculty?department=CSE&sortBy=rating&order=desc&page=1&limit=10
```

### Example Response (`200`):

```json
{
  "success": true,
  "data": {
    "faculty": [
      {
        "id": "665ffaculty",
        "name": "Dr. Kamal Hossain",
        "shortCode": "KH",
        "department": "CSE",
        "designation": "Professor",
        "avgRating": 4.6,
        "reviewCount": 20
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

## Reviews — `/api/reviews`

| **Method** | **Endpoint** | **Purpose** | **Auth Required** | **Parameters** | **Status Codes** |
| :-- | :-- | :-- | :--: | :-- | :-- |
| **GET** | `/api/reviews` | Get all reviews | No | None | `200` |
| **POST** | `/api/reviews` | Create a review | Yes | Request body | `201`, `401`, `409`, `422` |
| **PATCH** | `/api/reviews/:id` | Update a review | Owner | Path and request body | `200`, `401`, `403`, `404`, `422` |
| **DELETE** | `/api/reviews/:id` | Delete a review | Owner | Path: `id` | `200`, `401`, `403`, `404` |

### Path Parameters

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `id` | ObjectId | Yes | MongoDB review ID |

### Create Review Body

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `courseId` | ObjectId | Yes | Course being reviewed |
| `facultyId` | ObjectId | Yes | Faculty member being reviewed |
| `rating` | number | Yes | Overall rating from `1` to `5` |
| `difficultyRating` | number | Yes | Difficulty rating from `1` to `5` |
| `semester` | string | Yes | Semester, such as `Spring 2026` |
| `comment` | string | Yes | Written review |
| `isAnonymous` | boolean | No | Hide the student's identity |

### Update Review Body

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `rating` | number | No | Updated overall rating |
| `difficultyRating` | number | No | Updated difficulty rating |
| `semester` | string | No | Updated semester |
| `comment` | string | No | Updated review text |
| `isAnonymous` | boolean | No | Update anonymous status |

### Example Request

Request: `POST /api/reviews`

```http
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "courseId": "665fcourse",
  "facultyId": "665ffaculty",
  "rating": 4.5,
  "difficultyRating": 3,
  "semester": "Spring 2026",
  "comment": "Clear lectures and fair grading.",
  "isAnonymous": true
}
```

### Example Response (`201`):

```json
{
  "success": true,
  "data": {
    "review": {
      "id": "665freview",
      "courseId": "665fcourse",
      "facultyId": "665ffaculty",
      "rating": 4.5,
      "difficultyRating": 3,
      "semester": "Spring 2026",
      "comment": "Clear lectures and fair grading.",
      "isAnonymous": true,
      "voteScore": 0
    }
  }
}
```

---

## Votes — `/api/reviews/:id/vote`

| **Method** | **Endpoint** | **Purpose** | **Auth Required** | **Parameters** | **Status Codes** |
| :-- | :-- | :-- | :--: | :-- | :-- |
| **POST** | `/api/reviews/:id/vote` | Add, switch, or remove a vote | Yes | Path and request body | `200`, `201`, `401`, `404`, `422` |
| **DELETE** | `/api/reviews/:id/vote` | Remove the logged-in student's vote | Yes | Path: `id` | `200`, `401`, `404` |

### Path Parameters

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `id` | ObjectId | Yes | MongoDB review ID |

### Vote Body

| **Parameter** | **Type** | **Required** | **Description** |
| :-- | :-- | :--: | :-- |
| `voteType` | string | Yes | `up` or `down` |

### Example Request

Request: `POST /api/reviews/665freview/vote`

```http
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "voteType": "up"
}
```

### Example Response (`200`):

```json
{
  "success": true,
  "data": {
    "voteScore": 12,
    "myVote": "up"
  }
}
```            




---



<!-- Icons -->
<!-- Shild io -->
[node_js_version]: https://img.shields.io/badge/node-24.16.0+-green?logo=nodedotjs
[vite]: https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white
[React]: https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black
[Tailwind CSS]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white
[shadcn/ui]: https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white
[Axios]: https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white
[JWT]: https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white

<!-- local -->
