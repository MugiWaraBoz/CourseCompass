# CourseCompass Client

The student-facing web application for CourseCompass. It lets students browse courses and faculty, read reviews, manage their account, write reviews, vote on reviews, and generate AI-powered review summaries when a Gemini API key is configured.

## Tech stack

- React 19 and Vite
- React Router
- Tailwind CSS and shadcn/ui
- Axios for API requests
- Lucide React icons

## Prerequisites

- Node.js 20 or later
- npm
- The CourseCompass server running locally or deployed and reachable from the browser

## Getting started

From this `client` directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite prints the local URL when it starts, normally [http://localhost:5173](http://localhost:5173).

## Environment variables

Create a `.env` file inside this directory to point the client at the backend:

```env
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` is optional during local development: the application falls back to `http://localhost:3000` when it is unset. For a deployed frontend, set it to the public backend URL, without a trailing slash.

After changing `.env`, restart the Vite development server.

> Only use `VITE_` variables for values safe to expose in the browser. Never put database credentials, JWT secrets, or Gemini API keys in this file.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Serve the production build locally for verification. |
| `npm run lint` | Run ESLint across the client source. |

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Home page with featured courses and faculty. |
| `/courses` | Course directory with filtering and sorting. |
| `/courses/:courseId` | Course details and reviews. |
| `/faculty` | Faculty directory with filtering and sorting. |
| `/faculty/:facultyId` | Faculty details and reviews. |
| `/login`, `/register` | Student authentication. |
| `/forgot-password`, `/auth/reset-password/:token` | Password recovery. |
| `/auth/verify-email/:token` | Email verification. |
| `/profile` | Protected student profile and review management. |
| `/profile/change-password` | Protected password update page. |
| `/profile/write-review` | Protected review submission page. |

## Project structure

```text
client/
├── public/          # Static files
├── src/
│   ├── api/         # Axios client and backend API modules
│   ├── assets/      # Images and other bundled assets
│   ├── components/  # Reusable layout, auth, home, and UI components
│   ├── context/     # Authentication state provider
│   ├── hooks/       # Reusable React hooks
│   ├── pages/       # Route-level page components
│   ├── App.jsx      # Application routes and shared layout
│   └── main.jsx     # React entry point
├── .env             # Local environment variables (create locally)
├── package.json
└── vite.config.js
```

## Authentication and API behavior

The shared Axios client is in `src/api/client.js`. It uses `VITE_API_URL` as its base URL and automatically attaches the saved JWT from local storage (`courseCompassToken`) as a Bearer token. Public endpoints continue to work without signing in; profile, review, voting, and AI features require an authenticated student session.

## Production deployment

1. Set `VITE_API_URL` to the deployed backend URL in your hosting provider's environment settings.
2. Run `npm run build`.
3. Deploy the generated `dist/` directory.
4. Configure SPA fallback so unknown paths serve `index.html`; this is required for direct visits to routes such as `/courses/:courseId`.
