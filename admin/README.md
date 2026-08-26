# CourseCompass Admin Portal

The CourseCompass Admin Portal is the administrative frontend for managing the CourseCompass university course-review platform. Authorized administrators and moderators can review platform data, manage courses and faculty, verify students, and moderate reviews.

## Tech stack

- **React 19** for reusable UI components
- **Vite** for local development and production builds
- **React Router** for client-side navigation and protected routes
- **Axios** for communicating with the Express REST API
- **Tailwind CSS** and shadcn/ui components for styling

The portal is a **client-side rendered (CSR)** React application. Vite serves a small HTML page, and React mounts the application into the `#root` element in `src/main.jsx`. It does not use server-side rendering (SSR).

## Features

- Role-based sign-in for administrators and moderators
- JWT-protected routes and API calls
- Dashboard with student, course, faculty, and review statistics
- Course and faculty management
- Student listing and verification
- Review viewing, editing, and deletion for moderation

## Getting started

### Prerequisites

- Node.js 18 or later
- The CourseCompass backend running locally or deployed

### Install and run

```bash
cd admin
npm install
npm run dev
```

Vite will display the local URL, normally `http://localhost:5173`.

### Environment variables

Create an `admin/.env` file:

```env
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` is the base URL of the Express backend. Only variables prefixed with `VITE_` are exposed to Vite frontend code. Do not store secrets such as database URLs, JWT secrets, or email keys in this file because browser code is public.

## How the frontend talks to the backend

`src/api/clientApi.js` creates a shared Axios client using `VITE_API_URL`. Its request interceptor reads the token from `localStorage` and sends it with protected requests:

```http
Authorization: Bearer <JWT_TOKEN>
```

The Express backend uses CORS to allow requests from the frontend, then validates the token with JWT middleware. The backend checks authorization and user role before allowing administrator-only actions.

If an API response is `401 Unauthorized` or `403 Forbidden`, the Axios response interceptor clears the expired or invalid token and redirects the user to the login page.

## Authentication and routing

After a successful admin login, the portal stores the returned JWT in `localStorage`. `ProtectedRoute` in `src/App.jsx` prevents users without a token from opening dashboard, course, faculty, student, or review-management pages. `PublicRoute` redirects signed-in users away from the login page to the dashboard.

Main routes include:

- `/` — admin sign-in
- `/dashboard` — overview and statistics
- `/courses` — course management
- `/faculty` — faculty management
- `/students` — student management
- `/reviews` — review moderation

## React concepts used in this project

- **Components:** Pages, layouts, forms, tables, and controls are independent React components called from parent components.
- **`useState`:** Stores changing UI data such as records, search text, loading status, form fields, and errors.
- **`useEffect`:** Runs side effects such as loading courses, students, faculty, reviews, and dashboard data when a page opens or dependencies change.
- **Async functions:** API actions use `async`/`await` or Promise handlers to wait for Axios requests before updating state.
- **`className`:** React uses `className` rather than HTML's `class`; Tailwind utility classes define each component's appearance.
- **React Router:** Switches pages in the browser without a full page reload.

## Backend and database overview

The Express backend exposes REST endpoints for authentication, students, courses, faculty, reviews, votes, AI summaries, and status data. It uses middleware including `cors()`, `express.json()`, JWT token verification, and role verification.

MongoDB stores the platform records. The backend performs basic CRUD operations:

- **Create:** add a course, faculty member, review, or vote
- **Find:** retrieve lists, details, searches, and dashboard counts
- **Update:** edit course/faculty/review data or verify a student
- **Delete:** remove courses, faculty, students, or inappropriate reviews

## Available scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
npm run format    # Format source files with Prettier
```
