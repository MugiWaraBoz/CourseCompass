# CourseCompass — API Contract

This is the single source of truth for how frontend and backend talk to each other.
**Rule: if you change something here, tell your teammate before you change the code.**

---

## ⚠️ Schema updates needed (vs. the original DB diagram)

Your wireframes need a few fields that weren't in the original schema image. Update your
Mongoose models to include these before you start building:

| Model   | Add field           | Type                  | Why |
|---------|----------------------|------------------------|-----|
| Student | `studentIdNumber`    | `String`               | Register form asks for "Student ID" but schema had no field for it |
| Student | `passwordHash`       | `String`               | **No Firebase** — we're doing our own email/password auth, so we store a bcrypt hash. Never returned in any API response. |
| Review  | `difficultyRating`   | `Number` (1.0–5.0)      | Review form has a separate difficulty rating |
| Review  | `semester`           | `String` (e.g. `"Spring 2026"`) | Replaces the vague "Session" field on the wireframe |
| Course  | `avgRating`, `reviewCount` | `Number` (default 0) | Denormalized so course listing/detail pages don't recompute ratings on every request |
| Faculty | `avgRating`, `reviewCount` | `Number` (default 0) | Same reason as above |

**Drop `firebase_uid` entirely** — it was in the original diagram assuming Firebase Auth, but this project isn't using Firebase. Student identity is just email + password now.

If either of you disagrees with any of these, sort it out together **before** backend starts writing models — this is exactly the kind of thing that's cheap to fix now and annoying to fix later.

---

## 1. Conventions

- **Base URL (dev):** `http://localhost:5000/api`
- **Format:** JSON only. `Content-Type: application/json`
- **Casing:** camelCase everywhere — request bodies, query params, response fields. No exceptions.
- **IDs:** Mongo `_id` is always returned to the frontend as a plain string field called `id` (not `_id`). Backend should set this up once via a Mongoose `toJSON` transform on every schema, so nobody has to think about it again.
- **Dates:** ISO 8601 strings, e.g. `"2026-07-04T10:30:00.000Z"`.
- **Auth:** Our own JWT (JSON Web Token), issued by the backend at register/login, sent in the header on every protected route:
  ```
  Authorization: Bearer <jwtToken>
  ```
  Backend signs the token with a secret (`JWT_SECRET` in `.env`) and it stores just the student's `id` inside it. On every protected route, a small Express middleware verifies the token's signature and expiry, decodes the `id`, and attaches the student to `req.student` before the route handler runs.

  🌐 = public (no token needed) · 🔒 = requires valid token · 🔒✋ = requires token **and** ownership (you can only edit/delete your own stuff)

### Response envelope

**Success:**
```json
{
  "success": true,
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Review not found"
  }
}
```

Common `code` values: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `SERVER_ERROR`

### Pagination

Any list endpoint accepts:
```
?page=1&limit=10
```
And returns:
```json
{
  "success": true,
  "data": {
    "items": [ ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 47,
      "totalPages": 5
    }
  }
}
```
(`items` is renamed per-endpoint below, e.g. `courses`, `reviews` — but the shape is always the same.)

---

## 2. Data models (reference)

Frontend can build TypeScript types / mock data directly off this. This is what the API returns — not necessarily the raw Mongo document.

```ts
Student {
  id: string
  name: string
  studentIdNumber: string
  email: string
  // passwordHash exists in the DB but is NEVER returned in any API response
  photoUrl?: string
  cgpa?: number
  verified: boolean
  createdAt: string
  updatedAt: string
}

Course {
  id: string
  code: string                // e.g. "CSE 3521"
  name: string
  department?: string
  credit?: number
  prerequisiteId?: string     // Course id, nullable
  avgRating: number
  reviewCount: number
}

Faculty {
  id: string
  name: string
  shortCode: string
  department?: string
  designation?: string
  avgRating: number
  reviewCount: number
}

// Internal join model — frontend rarely deals with this directly,
// it's created automatically when a review is submitted.
ClassTake {
  id: string
  courseId: string
  facultyId: string
}

Review {
  id: string
  studentId: string
  studentName: string         // populated for display
  classTakeId: string
  courseId: string             // populated
  courseCode: string           // populated
  facultyId: string             // populated
  facultyName: string           // populated
  rating: number                // 1.0 - 5.0
  difficultyRating: number      // 1.0 - 5.0
  semester: string              // "Spring 2026"
  comment: string
  voteScore: number             // upvotes - downvotes
  myVote: "up" | "down" | null  // only present when request is authenticated
  createdAt: string
  updatedAt: string
}

Vote {
  id: string
  reviewId: string
  studentId: string
  voteType: "up" | "down"
  createdAt: string
}
```

---

## 3. Auth & Student

We're rolling our own auth — no Firebase. The backend hashes passwords with **bcrypt** and
issues a **JWT** on register/login. The frontend stores that token (e.g. in `localStorage`)
and attaches it as `Authorization: Bearer <token>` on every request that needs to know who
you are.

### 🌐 `POST /api/auth/register`
Called when someone submits the Register form.

**Body:**
```json
{
  "name": "Rafi Ahmed",
  "studentIdNumber": "u1904001",
  "email": "rafi@cuet.ac.bd",
  "password": "somePlainTextPassword"
}
```
Backend responsibility: check email isn't already taken, hash the password with bcrypt
(never store or log the plain password), save the Student, sign a JWT containing the new
student's `id`.

**Response `201`:**
```json
{ "success": true, "data": { "student": Student, "token": "eyJhbGciOi..." } }
```
**Errors:** `409 CONFLICT` if the email is already registered. `422 VALIDATION_ERROR` for weak/missing password, invalid email, etc.

> `confirmPassword` on the Register form is a **frontend-only** check (does it match `password`?)
> — never send it to the backend, there's nothing to do with it server-side.

### 🌐 `POST /api/auth/login`
Called when someone submits the Login form.

**Body:**
```json
{ "email": "rafi@cuet.ac.bd", "password": "somePlainTextPassword" }
```
Backend responsibility: find the student by email, use `bcrypt.compare()` against the stored
hash, and if it matches, sign and return a fresh JWT.

**Response `200`:**
```json
{ "success": true, "data": { "student": Student, "token": "eyJhbGciOi..." } }
```
**Errors:** `401 UNAUTHORIZED` for wrong email or password — **don't** say which one was wrong (that's a basic security habit, not overkill).

### 🔒 `GET /api/auth/me`
Used on every app load to check "is the token in localStorage still valid, and who does it belong to?"

**Response `200`:** `{ "data": { "student": Student } }`
**Response `401`:** if the token is missing, invalid, or expired → frontend should clear it and send the user to the login page.

### 🔒✋ `PATCH /api/students/me`
**Body (all optional):**
```json
{ "name": "Rafi A.", "photoUrl": "https://...", "cgpa": 3.7 }
```
**Response `200`:** `{ "data": { "student": Student } }`

### 🔒✋ `GET /api/students/me/reviews`
Powers the "User reviews" panel on the profile page.
**Query:** `?page=1&limit=10`
**Response `200`:** `{ "data": { "reviews": Review[], "pagination": {...} } }`

---

## 4. Courses

### 🌐 `GET /api/courses`
**Query params (all optional):**
| Param | Example | Notes |
|---|---|---|
| `search` | `?search=data structure` | matches code or name |
| `department` | `?department=CSE` | |
| `sortBy` | `rating` \| `name` \| `credit` | default `name` |
| `order` | `asc` \| `desc` | default `asc` |
| `page`, `limit` | | see pagination |

**Response `200`:** `{ "data": { "courses": Course[], "pagination": {...} } }`

### 🌐 `GET /api/courses/:courseId`
**Response `200`:** `{ "data": { "course": Course } }`
**Errors:** `404` if not found.

### 🌐 `GET /api/courses/:courseId/reviews`
**Query:** `?page=1&limit=10&sortBy=recent|rating|votes&facultyId=<optional filter>`
**Response `200`:** `{ "data": { "reviews": Review[], "pagination": {...} } }`

### 🌐 `GET /api/courses/search`
Lightweight autocomplete, used by the "Course Code" field on the review form.
**Query:** `?q=data`
**Response `200`:** `{ "data": { "courses": [{ "id", "code", "name" }] } }` — max 10 results, no pagination.

---

## 5. Faculty

Mirrors Courses exactly.

### 🌐 `GET /api/faculty`
**Query:** `search`, `department`, `sortBy` (`rating`|`name`), `order`, `page`, `limit`
**Response `200`:** `{ "data": { "faculty": Faculty[], "pagination": {...} } }`

### 🌐 `GET /api/faculty/:facultyId`
**Response `200`:** `{ "data": { "faculty": Faculty } }`

### 🌐 `GET /api/faculty/:facultyId/reviews`
Same shape as course reviews, but the review rows show `courseCode` instead of `facultyName`.
**Query:** `?page=1&limit=10&sortBy=recent|rating|votes&courseId=<optional filter>`
**Response `200`:** `{ "data": { "reviews": Review[], "pagination": {...} } }`

### 🌐 `GET /api/faculty/search?q=`
Same shape as course search, for the "Faculty Name" field on the review form.

---

## 6. Reviews

### 🔒 `POST /api/reviews`
Backend responsibility: find the `ClassTake` for `(courseId, facultyId)`, or create it if it
doesn't exist yet — the frontend never touches `ClassTake` directly. Also recompute
`avgRating`/`reviewCount` on the parent Course and Faculty after creating.

**Body:**
```json
{
  "courseId": "665f...",
  "facultyId": "665f...",
  "rating": 4.5,
  "difficultyRating": 3.0,
  "semester": "Spring 2026",
  "comment": "Great teacher, tough exams."
}
```
**Response `201`:** `{ "data": { "review": Review } }`
**Errors:**
- `409 CONFLICT` — this student already reviewed this exact course+faculty combo (unique index on `studentId + classTakeId`)
- `422 VALIDATION_ERROR` — rating out of range, missing fields, etc.

### 🔒✋ `PATCH /api/reviews/:reviewId`
Owner only. Any subset of `rating`, `difficultyRating`, `semester`, `comment`.
**Response `200`:** `{ "data": { "review": Review } }` — recompute parent aggregates if `rating` changed.
**Errors:** `403 FORBIDDEN` if not the owner.

### 🔒✋ `DELETE /api/reviews/:reviewId`
Owner only. Recompute parent aggregates after delete.
**Response `200`:** `{ "data": { "deleted": true } }`

---

## 7. Votes

Voting is a toggle: voting the same direction twice removes your vote. Voting the opposite
direction switches it.

### 🔒 `POST /api/reviews/:reviewId/vote`
**Body:** `{ "voteType": "up" }` or `{ "voteType": "down" }`
**Response `200`:**
```json
{ "data": { "voteScore": 12, "myVote": "up" } }
```
(`myVote` is `null` if this call just removed the vote.)

### 🔒 `DELETE /api/reviews/:reviewId/vote`
Explicitly remove your own vote (same effect as toggling, provided for convenience).
**Response `200`:** `{ "data": { "voteScore": 11, "myVote": null } }`

---

## 8. HTTP status cheat sheet

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad request (malformed) |
| 401 | Missing/invalid/expired JWT, or wrong email/password on login |
| 403 | Valid token, but not allowed to do this (not the owner) |
| 404 | Not found |
| 409 | Conflict (duplicate review, duplicate register) |
| 422 | Validation error (bad field values) |
| 500 | Server error |

---

## 9. How to work independently from this doc

- **Backend** builds against this contract exactly — same routes, same field names, same envelope.
- **Frontend** does NOT wait for backend. Build a `mockApi.js` (or use `json-server` / MSW) that returns
  objects matching the shapes in section 2, and point your API layer at that until backend
  endpoints are ready. Swap the base URL when it's time to integrate — nothing else should need to change if both sides stuck to this doc.
- If either of you needs to deviate from this contract mid-project, **edit this file in the same PR** as your code change and ping the other person — don't let this doc go stale.
