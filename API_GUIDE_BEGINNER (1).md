# CourseCompass — API Guide for Beginners

This explains the API from scratch — what an API even is, the vocabulary, and then every
single endpoint broken down in plain English, paired with the exact mock function that
already demonstrates it working. Read this once together; after that, `API_CONTRACT.md`
(the short version) is enough for day-to-day reference.

---

## Part 1 — The basics

### What is an API, really?

Think of a restaurant. You (the **frontend**) don't walk into the kitchen and cook your own
food. You tell a **waiter** (the API) what you want, the waiter goes to the kitchen
(**backend + database**), and brings back your food (**data**).

- You = React app running in the browser
- Waiter = the API (a set of URLs the backend listens on)
- Kitchen = Express server + MongoDB
- Your order = a "request"
- Your food = a "response"

### Vocabulary you'll see everywhere

| Term | Plain meaning |
|---|---|
| **Endpoint** | One specific URL that does one specific thing. E.g. `/api/courses` gives you a list of courses. |
| **HTTP method** | The "verb" of the request — what kind of action you want. |
| **GET** | "Give me data." Never changes anything. Used for viewing courses, faculty, reviews. |
| **POST** | "Create something new." Used for registering, submitting a review, voting. |
| **PATCH** | "Update part of something that exists." Used for editing your profile or a review. |
| **DELETE** | "Remove something." Used for deleting your review. |
| **Request** | What the frontend sends to the backend (a URL + maybe a body of data). |
| **Response** | What the backend sends back. |
| **JSON** | The text format everything is written in. Looks like `{ "name": "Rafi" }` — basically a JS object as text. |
| **Header** | Extra info attached to a request that isn't the main data — we use it to send the login token. |
| **Auth token (JWT)** | Proof that you're logged in. Our own backend generates this — a scrambled-looking string — the moment you register or log in successfully. Your browser holds onto it (in `localStorage`) and attaches it to every request that needs to know who you are. No Firebase involved — this project handles login itself with `bcrypt` (for hashing passwords) and `jsonwebtoken` (for the token). |
| **Query param** | Extra options tacked onto a URL after a `?`. E.g. `/api/courses?search=data&page=2` — `search` and `page` are query params. |
| **Path param** | A variable that's part of the URL itself. E.g. `/api/courses/c1` — `c1` is the path param (which course). |
| **Body** | The actual data you're sending, used with POST/PATCH. Not visible in the URL. |
| **Status code** | A 3-digit number the response comes with. `200` = worked. `404` = not found. `401` = you're not logged in. Full list is in `API_CONTRACT.md` §8. |

### 🌐 vs 🔒
Every endpoint below is marked:
- 🌐 **Public** — anyone can call it, even logged out. (Browsing courses, for example — you shouldn't need an account to look around.)
- 🔒 **Protected** — you must be logged in. The frontend attaches the JWT (from login/register) in the header.
- 🔒✋ **Protected + yours only** — logged in, AND it has to be *your own* data (you can't edit someone else's review).

### The envelope (why every response looks the same)

Every single response — no matter which endpoint — comes wrapped the same way, so the
frontend can handle all of them the same way instead of learning a new shape each time.

**When it works:**
```json
{ "success": true, "data": { /* the actual thing you asked for */ } }
```

**When it fails:**
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Review not found" } }
```

So in frontend code, it's always:
```js
const res = await mockApi.getCourses();
if (res.success) {
  // use res.data
} else {
  // show res.error.message
}
```

### Pagination (why lists come in pages, not all at once)

If there are 200 courses, we don't send all 200 in one response — too slow, and nobody scrolls
that far anyway. Instead you ask for a "page":
```
GET /api/courses?page=1&limit=10
```
means "give me the first 10." Page 2 gives you the next 10. The response tells you how many
pages exist in total so you can build "Next / Previous" buttons:
```json
{ "page": 1, "limit": 10, "total": 47, "totalPages": 5 }
```

---

## Part 2 — Every endpoint, explained one at a time

For each one: **what it's for**, **which page/button triggers it**, the raw contract, and the
exact mock function you can look at right now in `mockApi.js` to see it actually working.

---

### 🌐 Register a new student
**What it's for:** Creates a brand new account — hashes the password, saves the student, and
immediately logs them in by returning a token.
**Triggered by:** Submitting the Register page form.

| | |
|---|---|
| Method + URL | `POST /api/auth/register` |
| You send | `{ "name": "...", "studentIdNumber": "...", "email": "...", "password": "..." }` |
| You get back | `{ student, token }` — the new profile, plus a login token to store right away |
| Mock function | `mockApi.authRegister({ name, studentIdNumber, email, password })` |

> `confirmPassword` from the form never gets sent — that check ("do the two password fields
> match?") happens entirely on the frontend before you even call this.

---

### 🌐 Log in
**What it's for:** Checks email + password against what's stored, and if correct, returns a
fresh token.
**Triggered by:** Submitting the Login page form.

| | |
|---|---|
| Method + URL | `POST /api/auth/login` |
| You send | `{ "email": "...", "password": "..." }` |
| You get back | `{ student, token }` |
| Mock function | `mockApi.authLogin({ email, password })` |

Once you get the token back, save it (e.g. `localStorage.setItem('token', res.data.token)`) —
every protected call after this needs it in the header.

---

### 🔒 Check who's currently logged in
**What it's for:** Every time the app loads (or refreshes), check "is there a valid token saved,
and who does it belong to?" This is how you stay logged in across page refreshes without
re-entering your password.
**Triggered by:** App startup, while a token exists in `localStorage`.

| | |
|---|---|
| Method + URL | `GET /api/auth/me` |
| You send | Nothing — just the token in the header |
| You get back | Your student profile, or `401` if the token is missing/expired → send the user to the login page |
| Mock function | `mockApi.authMe()` |

---

### 🔒✋ Edit my profile
**What it's for:** The "Edit profile" button on the User Profile page.
**Triggered by:** Saving changes on the profile edit form.

| | |
|---|---|
| Method + URL | `PATCH /api/students/me` |
| You send | Only the fields that changed, e.g. `{ "name": "New Name" }` |
| You get back | Your updated profile |
| Mock function | `mockApi.updateMyProfile({ name, photoUrl, cgpa })` |

---

### 🔒✋ See my own reviews
**What it's for:** The "User reviews" section on the profile page.
**Triggered by:** Opening your profile page.

| | |
|---|---|
| Method + URL | `GET /api/students/me/reviews?page=1&limit=10` |
| You send | Nothing but pagination options |
| You get back | A page of your reviews, each one already filled in with course/faculty names |
| Mock function | `mockApi.getMyReviews({ page, limit })` |

---

### 🌐 Browse courses
**What it's for:** The main Course Page grid.
**Triggered by:** Opening the Course Page, typing in the search bar, changing a filter, changing sort order, clicking a page number.

| | |
|---|---|
| Method + URL | `GET /api/courses?search=&department=&sortBy=&order=&page=&limit=` |
| You send | Whichever filters the user picked — all optional |
| You get back | A page of matching courses |
| Mock function | `mockApi.getCourses({ search, department, sortBy, order, page, limit })` |

> `sortBy` can be `name`, `rating`, or `credit`. `order` is `asc` or `desc`. This is the "backend guy's" query — he reads these from `req.query` in Express and builds the Mongo query with them.

---

### 🌐 Open one course
**What it's for:** The top section of the Course Detail Page (name, code, description, rating).
**Triggered by:** Clicking a course card.

| | |
|---|---|
| Method + URL | `GET /api/courses/:courseId` |
| You send | Nothing, `:courseId` is in the URL itself |
| You get back | That one course's full details |
| Mock function | `mockApi.getCourseById(courseId)` |

---

### 🌐 See reviews for a course
**What it's for:** The "Reviews" list on the Course Detail Page.
**Triggered by:** Opening the Course Detail Page, or changing the filter/sort inside the reviews panel.

| | |
|---|---|
| Method + URL | `GET /api/courses/:courseId/reviews?page=&limit=&sortBy=&facultyId=` |
| You send | Optional sort (`recent`/`rating`/`votes`) and an optional faculty filter |
| You get back | A page of reviews, each showing the faculty who taught it |
| Mock function | `mockApi.getCourseReviews(courseId, { page, limit, sortBy, facultyId })` |

---

### 🌐 Autocomplete search for course code
**What it's for:** The "Course Code" field on the review-writing form — as you type, suggest matches.
**Triggered by:** Typing in that field.

| | |
|---|---|
| Method + URL | `GET /api/courses/search?q=data` |
| You send | Just the partial text typed so far |
| You get back | Up to 10 quick matches (just id/code/name, not full details) |
| Mock function | `mockApi.searchCourses(q)` |

---

### 🌐 Browse faculty / open one faculty / faculty reviews / faculty search
These four are the exact mirror of the four course endpoints above, just for the Faculty
Page and Faculty Detail Page instead.

| Endpoint | Mock function |
|---|---|
| `GET /api/faculty?search=&department=&sortBy=&order=&page=&limit=` | `mockApi.getFaculty({...})` |
| `GET /api/faculty/:facultyId` | `mockApi.getFacultyById(facultyId)` |
| `GET /api/faculty/:facultyId/reviews?page=&limit=&sortBy=&courseId=` | `mockApi.getFacultyReviews(facultyId, {...})` |
| `GET /api/faculty/search?q=` | `mockApi.searchFaculty(q)` |

---

### 🔒 Submit a review
**What it's for:** The "Submit review" button on the review form.
**Triggered by:** Filling out Faculty Name, Course Code, Rating, Difficulty Rating, Semester, Review text, then submitting.

| | |
|---|---|
| Method + URL | `POST /api/reviews` |
| You send | `{ courseId, facultyId, rating, difficultyRating, semester, comment }` |
| You get back | The created review, `201` status |
| Possible errors | `409` if you already reviewed this exact course+faculty pair |
| Mock function | `mockApi.createReview({ courseId, facultyId, rating, difficultyRating, semester, comment })` |

> Behind the scenes: the backend has to figure out "has this course+faculty pairing been
> reviewed before?" — if not, it quietly creates the `ClassTake` link first. You never send a
> `classTakeId` yourself; the backend works it out from `courseId` + `facultyId`.

---

### 🔒✋ Edit / delete my review
**What it's for:** The `U` (update) and `D` (delete) icons next to your own review.

| | |
|---|---|
| Edit | `PATCH /api/reviews/:reviewId` → send only changed fields → `mockApi.updateReview(reviewId, updates)` |
| Delete | `DELETE /api/reviews/:reviewId` → `mockApi.deleteReview(reviewId)` |

Both check that `review.studentId` matches you — otherwise `403 FORBIDDEN`.

---

### 🔒 Vote on a review
**What it's for:** Upvote/downvote arrows next to a review.
**Triggered by:** Clicking the up or down arrow.

| | |
|---|---|
| Method + URL | `POST /api/reviews/:reviewId/vote` |
| You send | `{ "voteType": "up" }` or `{ "voteType": "down" }` |
| You get back | `{ voteScore, myVote }` — the new total and what you personally voted |
| Mock function | `mockApi.voteReview(reviewId, voteType)` |

**Important behavior:** clicking the same arrow twice *removes* your vote (a toggle), not
double-counts it. Clicking the opposite arrow switches your vote. This logic already lives
inside the mock function — read through it, it's short.

There's also `DELETE /api/reviews/:reviewId/vote` (`mockApi.removeVote(reviewId)`) if you want
an explicit "remove vote" button instead of relying on the toggle.

---

## Part 3 — The helper functions inside mockApi.js

These aren't endpoints — they're just internal plumbing the mock functions use. The real
backend will have its own equivalents (using MongoDB features), but the *idea* is identical.

| Helper | What it actually does |
|---|---|
| `delay(ms)` | Fakes network lag so your loading spinners actually get tested, instead of everything resolving instantly. |
| `paginate(items, page, limit)` | Cuts a big array down to just the requested page, and calculates `totalPages`. |
| `enrichReview(review, studentId)` | Turns a raw review (just IDs) into a display-ready review (with names, vote count, and whether *you* voted on it). |
| `recalcAggregates(classTakeId)` | After a review is added/edited/deleted, recalculates `avgRating` and `reviewCount` on the related Course and Faculty. |
| `sortItems(items, sortBy, order)` | Sorts course/faculty lists by name, rating, or credit. |
| `sortReviews(items, sortBy)` | Sorts review lists by most recent, highest rating, or most votes. |

---

## Part 4 — FAQ

**Does mockApi.js actually log anyone in?**
Sort of, in a fake way. It keeps an internal `loggedInStudentId` variable (starts as `'s1'` so
you have something to render immediately). Calling `authLogin()` or `authRegister()` changes
who that variable points to, and `authMe()` reads it. There's no real password hashing or token
verification happening — it's just enough behavior to build and test your UI's logged-in vs.
logged-out states before the real backend exists.

**Do I need to memorize all these endpoints?**
No — that's what `API_CONTRACT.md` is for, as a quick lookup table. This doc is for
understanding *why* things are shaped the way they are, once.

**What happens when the real backend is ready?**
Someone writes `realApi.js` with the exact same function names (`getCourses`, `createReview`,
etc.) but using real `fetch()` calls instead of fake arrays. You change one import line in your
components, and everything else keeps working — provided both of you didn't quietly drift away
from what's written in `API_CONTRACT.md`.

**I'm the backend dev — do I need to read mockApi.js?**
Yes, briefly — it's a working example of exactly what your real endpoints need to return.
If your response shape doesn't match what mockApi.js returns, the frontend will break when you
swap it in.
