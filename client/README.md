client/
├── public/
│   └── images/
│
├── src/
│   ├── api/
│   │   ├── apiClient.js
│   │   ├── authApi.js
│   │   ├── courseApi.js
│   │   ├── facultyApi.js
│   │   ├── reviewApi.js
│   │   └── mockApi.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── StarRating.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PageContainer.jsx
│   │   │
│   │   ├── course/
│   │   │   ├── CourseCard.jsx
│   │   │   ├── CourseFilter.jsx
│   │   │   └── CourseSummary.jsx
│   │   │
│   │   ├── faculty/
│   │   │   ├── FacultyCard.jsx
│   │   │   ├── FacultyFilter.jsx
│   │   │   └── FacultySummary.jsx
│   │   │
│   │   └── review/
│   │       ├── ReviewCard.jsx
│   │       ├── ReviewForm.jsx
│   │       ├── ReviewList.jsx
│   │       └── VoteButtons.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useDebounce.js
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── CourseDetailsPage.jsx
│   │   ├── FacultyPage.jsx
│   │   ├── FacultyDetailsPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── WriteReviewPage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── utils/
│   │   ├── formatDate.js
│   │   ├── formatRating.js
│   │   └── storage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.example
├── package.json
└── vite.config.js