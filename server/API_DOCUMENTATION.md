# CourseCompass API Documentation

This reference documents the routes currently mounted by `server/src/app.js`. The default local base URL is `http://localhost:3000`.

## Response and authentication conventions

Successful responses use a `success: true` envelope; failures use `success: false` and an `error` object.

```json
{
  "success": true,
  "data": {}
}
```

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description of the failure"
  }
}
```

Routes marked **Student** require a JWT. Routes marked **Admin** require a JWT whose payload has `role: "admin"`.

```http
Authorization: Bearer <token>
```

## Authentication — `/auth`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a student. |
| POST | `/auth/login` | Public | Log in as a student. |
| POST | `/auth/adminLogin` | Public | Log in as an administrator. |
| POST | `/auth/forgot-password` | Public | Request a password-reset link. |
| GET | `/auth/reset-password/:token` | Public | Validate/display the reset-password flow. |
| POST | `/auth/reset-password/:token` | Public | Reset a password with a valid token. |
| PATCH | `/auth/change-password` | Student | Change the current student's password. |
| GET | `/auth/verify-email/:token` | Public | Verify a student's email address. |

## Students — `/students`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/students/me` | Student | Get the current student's profile. |
| PATCH | `/students/me` | Student | Update the current student's profile. |
| GET | `/students/me/reviews` | Student | List the current student's reviews. |
| PATCH | `/students/me/apikey` | Student | Store the current student's Gemini API key. |
| DELETE | `/students/me/apikey` | Student | Remove the current student's Gemini API key. |
| GET | `/students` | Admin | List students. Supports `search`, `page`, and `limit`. |
| GET | `/students/:studentId` | Admin | Get a student by MongoDB ID. |
| DELETE | `/students/:studentId` | Admin | Delete a student. |
| PATCH | `/students/:studentId/verify` | Admin | Change a student's verification status. |
| GET | `/students/admin/:studentId/reviews` | Admin | List reviews written by a student. |

## Courses — `/courses`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/courses` | Public | List courses. Supports `search`, `department`, `sortBy`, `order`, `page`, and `limit`. |
| GET | `/courses/:id` | Public | Get one course. |
| GET | `/courses/:id/reviews` | Student | List course reviews. Supports `facultyId`, `sortBy`, `order`, `page`, and `limit`. |
| POST | `/courses` | Admin | Create a course. |
| PATCH | `/courses/:id` | Admin | Update a course. |
| DELETE | `/courses/:id` | Admin | Delete a course. |
| GET | `/courses/admin/:id/reviews` | Admin | List a course's reviews for the admin portal. |

### Course request bodies

`POST /courses` accepts `name`, `code`, `department`, and `credit`. `PATCH /courses/:id` accepts the same fields; omitted values keep their current value.

## Faculty — `/faculty`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/faculty` | Public | List faculty. Supports `search`, `department`, `designation`, `sortBy`, `order`, `page`, and `limit`. |
| GET | `/faculty/:id` | Public | Get one faculty member. |
| GET | `/faculty/:id/reviews` | Student | List faculty reviews. Supports `courseId`, `sortBy`, `order`, `page`, and `limit`. |
| POST | `/faculty` | Admin | Create a faculty member. |
| PATCH | `/faculty/:id` | Admin | Update a faculty member. |
| DELETE | `/faculty/:id` | Admin | Delete a faculty member. |
| GET | `/faculty/admin/:id/reviews` | Admin | List a faculty member's reviews for the admin portal. |

### Faculty request bodies

`POST /faculty` accepts `name`, `shortCode`, `department`, `about`, and `designation`. `PATCH /faculty/:id` accepts the same fields; omitted values keep their current value.

## Reviews — `/reviews`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/reviews` | Public | List all reviews. |
| POST | `/reviews` | Student | Create a review. |
| PATCH | `/reviews/:id` | Student owner | Update a review authored by the current student. |
| DELETE | `/reviews/:id` | Student owner | Delete a review authored by the current student. |
| POST | `/reviews/:id/vote` | Student | Add, switch, or remove a vote on a review. |
| PATCH | `/reviews/admin/:id` | Admin | Update any review. |
| DELETE | `/reviews/admin/:id` | Admin | Delete any review. |

### Create or update review body

```json
{
  "courseId": "<MongoDB ObjectId>",
  "facultyId": "<MongoDB ObjectId>",
  "rating": 5,
  "difficultyRating": 3,
  "semester": "Spring 2026",
  "comment": "Clear lectures and fair grading.",
  "isAnonymous": false
}
```

Creating a review requires the course and faculty IDs. Review updates use the editable rating, difficulty, semester, comment, and anonymity fields. Vote requests use:

```json
{ "voteType": "up" }
```

Use `"down"` for a downvote.

## AI summaries — `/ai`

These routes use the Gemini API key stored for the authenticated student.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/ai/test` | Student | Test whether the stored Gemini key works. |
| GET | `/ai/:id/reviews/course` | Student | Generate a summary of a course's reviews. |
| GET | `/ai/:id/reviews/faculty` | Student | Generate a summary of a faculty member's reviews. |

## Status — `/status`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/status/student` | Public | Get aggregate student status. |
| GET | `/status/course` | Public | Get aggregate course status. |
| GET | `/status/faculty` | Public | Get aggregate faculty status. |
| GET | `/status/review` | Public | Get aggregate review status. |

## Notes

- `:id` and `:studentId` route parameters are MongoDB ObjectIds unless the endpoint's controller states otherwise.
- `server/src/routes/notificationRoutes.js` currently has no routes, and it is not mounted in `server/src/app.js`; it therefore exposes no API endpoint.
- The root project README links here so the API reference can evolve independently of the project overview.
