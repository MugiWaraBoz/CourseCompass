<div align="center">

<img src="./misc/course_compass_logo.png" alt="CourseCompass logo" width="500">

![React]
![Vite]
![Tailwind CSS]
![shadcn/ui]
![Node.js]
![Express.js]
![MongoDB]
![JWT]
![Axios]

[Frontend](https://course-compass-lcmf.vercel.app/) · [Admin portal](https://course-compass-admin-portal.vercel.app/) · [Backend](https://coursecompass-backend-8pe2.onrender.com)

_A modern course-review platform for university students._

</div>

# CourseCompass

CourseCompass helps students make informed academic decisions through transparent course and faculty reviews. Students can discover courses, rate instructors, share experiences, and post anonymously when they choose.

## Tech stack

| Component | Technology | Purpose |
| --- | --- | --- |
| Frontend | React, Vite, Tailwind CSS, shadcn/ui | Student-facing web app |
| Admin portal | React, Vite, Tailwind CSS | Administration interface |
| Backend | Node.js, Express | REST API and server-side logic |
| Database | MongoDB | Stores users, courses, faculty, reviews, and votes |
| Authentication | JWT and bcrypt | Session and password security |

## Features

- Student registration, email verification, and JWT authentication
- Course and faculty search, filtering, sorting, and pagination
- Public and anonymous reviews, plus course/faculty ratings
- Review voting and duplicate-review prevention
- Student profile and review management
- Admin management for students, courses, faculty, and reviews
- Optional Gemini-powered review summaries

## Quick start

### Prerequisites

- Node.js 20 or later
- MongoDB, either local or Atlas
- Git

### Clone and install

```bash
git clone https://github.com/MugiWaraBoz/CourseCompass.git
cd CourseCompass
```

Install and run each application in a separate terminal:

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

```bash
cd admin-portal
npm install
npm run dev
```

The server normally runs on `http://localhost:3000`; Vite normally serves the client at `http://localhost:5173`.

See [client/README.md](client/README.md) for frontend-specific setup and [server/readme.md](server/readme.md) for server, environment, and database setup.

## API documentation

The complete API reference is maintained separately in [server/API_DOCUMENTATION.md](server/API_DOCUMENTATION.md). It covers every route currently mounted by the Express application, including public, student, and admin endpoints.

<!-- Badge references -->

[Vite]: https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white
[React]: https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black
[Tailwind CSS]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white
[shadcn/ui]: https://img.shields.io/badge/shadcn/ui-000000?style=flat&logo=shadcnui&logoColor=white
[Axios]: https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white
[JWT]: https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white
