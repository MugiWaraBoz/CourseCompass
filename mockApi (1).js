/**
 * mockApi.js
 * ------------------------------------------------------------------
 * Fake backend for CourseCompass frontend development.
 * Every function here mirrors an endpoint in API_CONTRACT.md — same
 * name pattern, same params, same response shape (including the
 * { success, data } / { success, error } envelope).
 *
 * HOW TO USE:
 *   import { mockApi } from './api/mockApi';
 *   const res = await mockApi.getCourses({ search: 'data' });
 *   if (res.success) setCourses(res.data.courses);
 *
 * AUTH NOTE: no Firebase here. authRegister/authLogin simulate a JWT flow —
 * they return a fake token string and flip an internal "who's logged in"
 * flag. In the real app, save the returned token to localStorage and send
 * it as `Authorization: Bearer <token>` on every protected call.
 *
 * SWITCHING TO THE REAL BACKEND LATER:
 *   Once backend endpoints are ready, create a `realApi.js` with the
 *   same function names (using fetch/axios against VITE_API_BASE_URL),
 *   then change ONE import line in your components/hooks:
 *     import { mockApi as api } from './api/mockApi';   // before
 *     import { realApi as api } from './api/realApi';   // after
 *   Nothing else in your components should need to change if both
 *   files return the same shape.
 * ------------------------------------------------------------------
 */

// ---------- tiny helpers ----------

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

let idCounter = 1000;
const nextId = () => String(idCounter++);

const ok = (data) => ({ success: true, data });
const fail = (code, message) => ({ success: false, error: { code, message } });

function paginate(items, page = 1, limit = 10) {
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const start = (page - 1) * limit;
  const pageItems = items.slice(start, start + limit);
  return {
    pageItems,
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / limit)),
    },
  };
}

// Mock "session" — tracks who's currently logged in, set/cleared by
// authLogin / authRegister. Starts pre-filled as 's1' just so components
// have something to render before you've wired up a real login screen;
// feel free to set this to null to test the "logged out" state.
let loggedInStudentId = 's1';

const fakeToken = (studentId) => `mock-jwt.${studentId}.${Date.now()}`;

// Real API never returns passwordHash — strip it here too, for realism.
const sanitizeStudent = (student) => {
  const { passwordHash, ...safe } = student;
  return safe;
};

// ---------- mock data ----------

// Note: passwordHash is never returned to the frontend in real responses.
// It's included here only so the mock login function has something to check against.
const students = [
  {
    id: 's1',
    name: 'Rafi Ahmed',
    studentIdNumber: 'u1904001',
    email: 'rafi@cuet.ac.bd',
    passwordHash: 'password123', // pretend this is already "hashed" for mock purposes
    photoUrl: '',
    cgpa: 3.72,
    verified: true,
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 's2',
    name: 'Nusrat Jahan',
    studentIdNumber: 'u1904002',
    email: 'nusrat@cuet.ac.bd',
    passwordHash: 'password123',
    photoUrl: '',
    cgpa: 3.85,
    verified: true,
    createdAt: '2026-01-11T08:00:00.000Z',
    updatedAt: '2026-01-11T08:00:00.000Z',
  },
];

const faculty = [
  { id: 'f1', name: 'Dr. Kamal Hossain', shortCode: 'KH', department: 'CSE', designation: 'Professor', avgRating: 4.3, reviewCount: 2 },
  { id: 'f2', name: 'Dr. Farhana Islam', shortCode: 'FI', department: 'CSE', designation: 'Associate Professor', avgRating: 3.8, reviewCount: 1 },
  { id: 'f3', name: 'Mr. Tanvir Rahman', shortCode: 'TR', department: 'EEE', designation: 'Lecturer', avgRating: 4.6, reviewCount: 1 },
];

const courses = [
  { id: 'c1', code: 'CSE 3521', name: 'Operating Systems', department: 'CSE', credit: 3.0, prerequisiteId: null, avgRating: 4.1, reviewCount: 2 },
  { id: 'c2', code: 'CSE 4507', name: 'Numerical Analysis', department: 'CSE', credit: 3.0, prerequisiteId: null, avgRating: 3.8, reviewCount: 1 },
  { id: 'c3', code: 'EEE 2101', name: 'Microprocessors', department: 'EEE', credit: 3.0, prerequisiteId: null, avgRating: 4.6, reviewCount: 1 },
];

// courseId + facultyId pairing — created automatically when a review is submitted
const classTakes = [
  { id: 'ct1', courseId: 'c1', facultyId: 'f1' },
  { id: 'ct2', courseId: 'c1', facultyId: 'f2' },
  { id: 'ct3', courseId: 'c2', facultyId: 'f1' },
  { id: 'ct4', courseId: 'c3', facultyId: 'f3' },
];

const reviews = [
  {
    id: 'r1',
    studentId: 's2',
    classTakeId: 'ct1',
    rating: 4.5,
    difficultyRating: 3.0,
    semester: 'Spring 2026',
    comment: 'Explains scheduling algorithms really clearly. Fair exams.',
    createdAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'r2',
    studentId: 's1',
    classTakeId: 'ct2',
    rating: 3.5,
    difficultyRating: 4.0,
    semester: 'Spring 2026',
    comment: 'Tough grading but you learn a lot if you keep up with lectures.',
    createdAt: '2026-05-03T10:00:00.000Z',
    updatedAt: '2026-05-03T10:00:00.000Z',
  },
  {
    id: 'r3',
    studentId: 's2',
    classTakeId: 'ct3',
    rating: 3.8,
    difficultyRating: 3.5,
    semester: 'Fall 2025',
    comment: 'Numerical methods finally made sense in this course.',
    createdAt: '2026-04-20T10:00:00.000Z',
    updatedAt: '2026-04-20T10:00:00.000Z',
  },
  {
    id: 'r4',
    studentId: 's1',
    classTakeId: 'ct4',
    rating: 4.6,
    difficultyRating: 2.5,
    semester: 'Fall 2025',
    comment: 'Best microprocessors instructor in the department, hands down.',
    createdAt: '2026-04-25T10:00:00.000Z',
    updatedAt: '2026-04-25T10:00:00.000Z',
  },
];

const votes = [
  { id: 'v1', reviewId: 'r1', studentId: 's1', voteType: 'up', createdAt: '2026-05-02T10:00:00.000Z' },
];

// ---------- enrichment helpers ----------

function enrichReview(review, requestingStudentId = null) {
  const classTake = classTakes.find((ct) => ct.id === review.classTakeId);
  const course = courses.find((c) => c.id === classTake?.courseId);
  const fac = faculty.find((f) => f.id === classTake?.facultyId);
  const student = students.find((s) => s.id === review.studentId);
  const reviewVotes = votes.filter((v) => v.reviewId === review.id);
  const voteScore = reviewVotes.reduce((sum, v) => sum + (v.voteType === 'up' ? 1 : -1), 0);
  const myVote = requestingStudentId
    ? reviewVotes.find((v) => v.studentId === requestingStudentId)?.voteType || null
    : null;

  return {
    ...review,
    studentName: student?.name || 'Unknown',
    courseId: course?.id,
    courseCode: course?.code,
    facultyId: fac?.id,
    facultyName: fac?.name,
    voteScore,
    myVote,
  };
}

function recalcAggregates(classTakeId) {
  const classTake = classTakes.find((ct) => ct.id === classTakeId);
  if (!classTake) return;

  const recalcFor = (entityList, idField, id) => {
    const relevantClassTakeIds = classTakes.filter((ct) => ct[idField] === id).map((ct) => ct.id);
    const relevantReviews = reviews.filter((r) => relevantClassTakeIds.includes(r.classTakeId));
    const entity = entityList.find((e) => e.id === id);
    if (!entity) return;
    entity.reviewCount = relevantReviews.length;
    entity.avgRating = relevantReviews.length
      ? Number((relevantReviews.reduce((sum, r) => sum + r.rating, 0) / relevantReviews.length).toFixed(1))
      : 0;
  };

  recalcFor(courses, 'courseId', classTake.courseId);
  recalcFor(faculty, 'facultyId', classTake.facultyId);
}

function sortItems(items, sortBy, order = 'asc') {
  const dir = order === 'desc' ? -1 : 1;
  const sorted = [...items];
  if (sortBy === 'rating') sorted.sort((a, b) => dir * (a.avgRating - b.avgRating));
  else if (sortBy === 'credit') sorted.sort((a, b) => dir * (a.credit - b.credit));
  else sorted.sort((a, b) => dir * a.name.localeCompare(b.name));
  return sorted;
}

function sortReviews(items, sortBy = 'recent') {
  const sorted = [...items];
  if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'votes') sorted.sort((a, b) => b.voteScore - a.voteScore);
  else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return sorted;
}

// ---------- mockApi ----------

export const mockApi = {
  // ---- Auth / Student ----

  async authRegister({ name, studentIdNumber, email, password }) {
    await delay();
    if (!name || !studentIdNumber || !email || !password) {
      return fail('VALIDATION_ERROR', 'Missing required fields');
    }
    const existing = students.find((s) => s.email === email);
    if (existing) return fail('CONFLICT', 'Email already registered');

    // Real backend: passwordHash = await bcrypt.hash(password, 10)
    const student = {
      id: nextId(),
      name,
      studentIdNumber,
      email,
      passwordHash: password,
      photoUrl: '',
      cgpa: null,
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    students.push(student);
    loggedInStudentId = student.id;

    return ok({ student: sanitizeStudent(student), token: fakeToken(student.id) });
  },

  async authLogin({ email, password }) {
    await delay();
    const student = students.find((s) => s.email === email);
    // Real backend: await bcrypt.compare(password, student.passwordHash)
    if (!student || student.passwordHash !== password) {
      return fail('UNAUTHORIZED', 'Invalid email or password');
    }
    loggedInStudentId = student.id;
    return ok({ student: sanitizeStudent(student), token: fakeToken(student.id) });
  },

  async authMe() {
    await delay();
    if (!loggedInStudentId) return fail('UNAUTHORIZED', 'Not logged in');
    const student = students.find((s) => s.id === loggedInStudentId);
    if (!student) return fail('UNAUTHORIZED', 'Not logged in');
    return ok({ student: sanitizeStudent(student) });
  },

  async updateMyProfile(updates) {
    await delay();
    if (!loggedInStudentId) return fail('UNAUTHORIZED', 'Not logged in');
    const student = students.find((s) => s.id === loggedInStudentId);
    if (!student) return fail('NOT_FOUND', 'Student not found');
    Object.assign(student, updates, { updatedAt: new Date().toISOString() });
    return ok({ student: sanitizeStudent(student) });
  },

  async getMyReviews({ page = 1, limit = 10 } = {}) {
    await delay();
    if (!loggedInStudentId) return fail('UNAUTHORIZED', 'Not logged in');
    const mine = reviews
      .filter((r) => r.studentId === loggedInStudentId)
      .map((r) => enrichReview(r, loggedInStudentId));
    const { pageItems, pagination } = paginate(mine, page, limit);
    return ok({ reviews: pageItems, pagination });
  },

  // ---- Courses ----

  async getCourses({ search = '', department = '', sortBy = 'name', order = 'asc', page = 1, limit = 10 } = {}) {
    await delay();
    let list = courses;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    }
    if (department) list = list.filter((c) => c.department === department);
    list = sortItems(list, sortBy, order);
    const { pageItems, pagination } = paginate(list, page, limit);
    return ok({ courses: pageItems, pagination });
  },

  async getCourseById(courseId) {
    await delay();
    const course = courses.find((c) => c.id === courseId);
    if (!course) return fail('NOT_FOUND', 'Course not found');
    return ok({ course });
  },

  async getCourseReviews(courseId, { page = 1, limit = 10, sortBy = 'recent', facultyId = '' } = {}) {
    await delay();
    const relevantClassTakeIds = classTakes
      .filter((ct) => ct.courseId === courseId && (!facultyId || ct.facultyId === facultyId))
      .map((ct) => ct.id);
    let list = reviews
      .filter((r) => relevantClassTakeIds.includes(r.classTakeId))
      .map((r) => enrichReview(r, loggedInStudentId));
    list = sortReviews(list, sortBy);
    const { pageItems, pagination } = paginate(list, page, limit);
    return ok({ reviews: pageItems, pagination });
  },

  async searchCourses(q = '') {
    await delay(150);
    const query = q.toLowerCase();
    const results = courses
      .filter((c) => c.code.toLowerCase().includes(query) || c.name.toLowerCase().includes(query))
      .slice(0, 10)
      .map(({ id, code, name }) => ({ id, code, name }));
    return ok({ courses: results });
  },

  // ---- Faculty ----

  async getFaculty({ search = '', department = '', sortBy = 'name', order = 'asc', page = 1, limit = 10 } = {}) {
    await delay();
    let list = faculty;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q) || f.shortCode.toLowerCase().includes(q));
    }
    if (department) list = list.filter((f) => f.department === department);
    list = sortItems(list, sortBy, order);
    const { pageItems, pagination } = paginate(list, page, limit);
    return ok({ faculty: pageItems, pagination });
  },

  async getFacultyById(facultyId) {
    await delay();
    const fac = faculty.find((f) => f.id === facultyId);
    if (!fac) return fail('NOT_FOUND', 'Faculty not found');
    return ok({ faculty: fac });
  },

  async getFacultyReviews(facultyId, { page = 1, limit = 10, sortBy = 'recent', courseId = '' } = {}) {
    await delay();
    const relevantClassTakeIds = classTakes
      .filter((ct) => ct.facultyId === facultyId && (!courseId || ct.courseId === courseId))
      .map((ct) => ct.id);
    let list = reviews
      .filter((r) => relevantClassTakeIds.includes(r.classTakeId))
      .map((r) => enrichReview(r, loggedInStudentId));
    list = sortReviews(list, sortBy);
    const { pageItems, pagination } = paginate(list, page, limit);
    return ok({ reviews: pageItems, pagination });
  },

  async searchFaculty(q = '') {
    await delay(150);
    const query = q.toLowerCase();
    const results = faculty
      .filter((f) => f.name.toLowerCase().includes(query) || f.shortCode.toLowerCase().includes(query))
      .slice(0, 10)
      .map(({ id, name, shortCode }) => ({ id, name, shortCode }));
    return ok({ faculty: results });
  },

  // ---- Reviews ----

  async createReview({ courseId, facultyId, rating, difficultyRating, semester, comment }) {
    await delay();

    if (!courseId || !facultyId || !rating || !comment) {
      return fail('VALIDATION_ERROR', 'Missing required fields');
    }

    if (!loggedInStudentId) return fail('UNAUTHORIZED', 'Not logged in');

    // find-or-create the ClassTake, same as backend is expected to do
    let classTake = classTakes.find((ct) => ct.courseId === courseId && ct.facultyId === facultyId);
    if (!classTake) {
      classTake = { id: nextId(), courseId, facultyId };
      classTakes.push(classTake);
    }

    const alreadyReviewed = reviews.find(
      (r) => r.studentId === loggedInStudentId && r.classTakeId === classTake.id
    );
    if (alreadyReviewed) return fail('CONFLICT', 'You already reviewed this course + faculty combination');

    const review = {
      id: nextId(),
      studentId: loggedInStudentId,
      classTakeId: classTake.id,
      rating,
      difficultyRating,
      semester,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reviews.push(review);
    recalcAggregates(classTake.id);

    return ok({ review: enrichReview(review, loggedInStudentId) });
  },

  async updateReview(reviewId, updates) {
    await delay();
    if (!loggedInStudentId) return fail('UNAUTHORIZED', 'Not logged in');
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return fail('NOT_FOUND', 'Review not found');
    if (review.studentId !== loggedInStudentId) return fail('FORBIDDEN', 'Not your review');

    Object.assign(review, updates, { updatedAt: new Date().toISOString() });
    recalcAggregates(review.classTakeId);
    return ok({ review: enrichReview(review, loggedInStudentId) });
  },

  async deleteReview(reviewId) {
    await delay();
    if (!loggedInStudentId) return fail('UNAUTHORIZED', 'Not logged in');
    const index = reviews.findIndex((r) => r.id === reviewId);
    if (index === -1) return fail('NOT_FOUND', 'Review not found');
    if (reviews[index].studentId !== loggedInStudentId) return fail('FORBIDDEN', 'Not your review');

    const classTakeId = reviews[index].classTakeId;
    reviews.splice(index, 1);
    recalcAggregates(classTakeId);
    return ok({ deleted: true });
  },

  // ---- Votes ----

  async voteReview(reviewId, voteType) {
    await delay(150);
    if (!loggedInStudentId) return fail('UNAUTHORIZED', 'Not logged in');
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return fail('NOT_FOUND', 'Review not found');

    const existing = votes.find((v) => v.reviewId === reviewId && v.studentId === loggedInStudentId);

    if (existing && existing.voteType === voteType) {
      // toggle off
      votes.splice(votes.indexOf(existing), 1);
    } else if (existing) {
      existing.voteType = voteType;
    } else {
      votes.push({ id: nextId(), reviewId, studentId: loggedInStudentId, voteType, createdAt: new Date().toISOString() });
    }

    const enriched = enrichReview(review, loggedInStudentId);
    return ok({ voteScore: enriched.voteScore, myVote: enriched.myVote });
  },

  async removeVote(reviewId) {
    await delay(150);
    if (!loggedInStudentId) return fail('UNAUTHORIZED', 'Not logged in');
    const index = votes.findIndex((v) => v.reviewId === reviewId && v.studentId === loggedInStudentId);
    if (index !== -1) votes.splice(index, 1);

    const review = reviews.find((r) => r.id === reviewId);
    const enriched = review ? enrichReview(review, loggedInStudentId) : { voteScore: 0 };
    return ok({ voteScore: enriched.voteScore, myVote: null });
  },
};
