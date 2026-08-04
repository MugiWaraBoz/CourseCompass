# CourseCompass Client

The CourseCompass frontend is built with React, React Router, Axios, Vite, and Tailwind CSS.

## Folder Structure

```text
client/
├── public/                    # Static files served directly by Vite
├── src/
│   ├── api/                   # Axios client and backend request functions
│   │   ├── authApi.js
│   │   ├── catalogApi.js
│   │   ├── client.js
│   │   ├── reviewApi.js
│   │   └── studentApi.js
│   ├── assets/                # Images imported by React components
│   ├── components/            # Reusable interface components
│   │   ├── auth/              # Authentication cards and protected routes
│   │   ├── catalog/           # Course and faculty cards
│   │   ├── common/            # Forms, pagination, ratings, and page states
│   │   ├── home/              # Homepage sections
│   │   ├── layout/            # Navbar and footer
│   │   ├── profile/           # Shared profile layout
│   │   ├── reviews/           # Review cards, forms, and review lists
│   │   └── ui/                # Small base UI components
│   ├── context/
│   │   └── AuthContext.jsx    # Login session and current student state
│   ├── data/                  # Shared constants and static data
│   ├── hooks/                 # Reusable React hooks
│   ├── layouts/
│   │   └── AppLayout.jsx      # Main navbar/content/footer layout
│   ├── lib/                   # General library helpers
│   ├── pages/                 # Route-level pages
│   │   ├── auth/              # Login, registration, and password reset pages
│   │   ├── profile/           # Dashboard, profile edit, reviews, and password page
│   │   ├── CourseDetailPage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── FacultyDetailPage.jsx
│   │   ├── FacultyPage.jsx
│   │   ├── HomePage.jsx
│   │   └── NotFoundPage.jsx
│   ├── test/                  # Vitest and Testing Library tests
│   ├── App.jsx                # Router and route definitions
│   ├── index.css              # Global styles and theme variables
│   └── main.jsx               # React application entry point
├── components.json            # UI component configuration
├── eslint.config.js           # ESLint rules
├── index.html                 # Vite HTML entry point
├── jsconfig.json              # Import alias configuration
├── package.json               # Dependencies and npm scripts
└── vite.config.js             # Vite, Tailwind, alias, and test configuration
```

## Commands

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

The client uses `VITE_API_URL` for the backend address and defaults to `http://localhost:3000` when it is not set.
