<div align="center">

<img src="./misc/course_compass_logo.png" alt="CourseCompass" width="380">

### 🧭 Know before you enroll.

*A modern course-review platform for university students — discover courses, rate instructors, and share real experiences.*

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

<p>
  <a href="https://course-compass-live.vercel.app/"><b>🌐 Live App</b></a> &nbsp;·&nbsp;
  <a href="https://course-compass-admin-portal.vercel.app/"><b>🛡️ Admin Portal</b></a> 
</p>

<p>
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-demo">Demo</a>
</p>

</div>

<br>

## 📖 About

**CourseCompass** helps students make informed academic decisions through transparent, crowd-sourced course and faculty reviews. Search courses, compare instructors, read (or write) honest reviews, and post anonymously when you'd rather not put your name on it.

<br>

## ✨ Features

| | |
|:---:|---|
| 🔐 | **Secure auth** — registration, email verification, and JWT-based sessions |
| 🔎 | **Powerful search** — filter, sort, and paginate through courses and faculty |
| ⭐ | **Reviews & ratings** — public or anonymous, aggregated into live course/faculty scores |
| 👍 | **Voting system** — upvote or downvote reviews, with duplicate-review prevention |
| 🧑‍🎓 | **Student dashboard** — manage your profile and your own reviews in one place |
| 🛠️ | **Admin console** — moderate students, courses, faculty, and reviews |
| 🤖 | **AI summaries** — optional Gemini-powered TL;DRs of course & faculty reviews |

<br>

## 🛠️ Tech Stack

<table>
  <tr>
    <td><b>Frontend & Admin Portal</b></td>
    <td>
      <img src="https://skillicons.dev/icons?i=react,vite,tailwind" height="32" />
      <img src="https://avatars.githubusercontent.com/u/139895814?s=200&v=4" height="32" />
    </td>
  </tr>
  <tr>
    <td><b>Backend</b></td>
    <td><img src="https://skillicons.dev/icons?i=nodejs,express" height="32" /></td>
  </tr>
  <tr>
    <td><b>Database</b></td>
    <td><img src="https://skillicons.dev/icons?i=mongodb" height="32" /></td>
  </tr>
  <tr>
    <td><b>Auth</b></td>
    <td>
      <img src="https://skillicons.dev/icons?i=nodejs" height="32" />
      <img src="https://jwt.io/img/pic_logo.svg" height="32" />
    </td>
  </tr>
  <tr>
    <td><b>Testing</b></td>
    <td><img src="https://skillicons.dev/icons?i=jest" height="32" /></td>
  </tr>
  <tr>
    <td><b>Dev Tools</b></td>
    <td><img src="https://skillicons.dev/icons?i=git,github,postman" height="32" /></td>
  </tr>
  <tr>
    <td><b>Deployment</b></td>
    <td>
      <img src="https://skillicons.dev/icons?i=vercel" height="32" />
      <img src="./misc/Readme/Render logomark - Black.jpg" width="32" style="border-radius: 6px;" />
    </td>
  </tr>
</table>

<br>

## 🚀 Quick Start

> **Prerequisites:** Node.js 20+ &nbsp;·&nbsp; MongoDB (local or Atlas) &nbsp;·&nbsp; Git

```bash
git clone https://github.com/MugiWaraBoz/CourseCompass.git
cd CourseCompass
```

Spin up each app in its own terminal:

```bash
# 🖥️  Server → http://localhost:3000
cd server && npm install && npm run dev
```

```bash
# 🌐  Client → http://localhost:5173
cd client && npm install && npm run dev
```

```bash
# 🛡️  Admin Portal
cd admin-portal && npm install && npm run dev
```

📄 Setup details: [`client/README.md`](client/README.md) · [`server/readme.md`](server/readme.md)

<br>

## 📚 API Documentation

The complete API reference — every public, student, and admin route — lives in **[`server/API_DOCUMENTATION.md`](server/API_DOCUMENTATION.md)**.

<br>

## 🎬 Demo

### 🧑‍🎓 Student Website

**📝 Register**
![Register](./misc/gif/Register.webp)

**🔑 Login**
![Login](./misc/gif/Login.webp)

**📘 Course Pages**
![CoursePages](./misc/gif/CoursePages.webp)

**👩‍🏫 Faculty Pages**
![FacultyPages](./misc/gif/FacultyPages.webp)

**✍️ Writing a Review**
![WritingReview](./misc/gif/WritingReview.webp)

**👍 Upvote / Downvote**
![UpVoteAndDownvote](./misc/gif/UpVoteAndDownvote.webp)

**📊 User Dashboard**
![UserDashboard](./misc/gif/UserDashboard.webp)

**🤖 Gemini Key Setup**
![GeminiKeySetup](./misc/gif/GeminiKeySetup.webp)

### 🛡️ Admin Portal

**📈 Panel & Stat Dashboard**
![AdminPanel+StatDashboard](./misc/gif/AdminPanel+StatDashboard.webp)

**📘 Course Moderation**
![CourseModeration](./misc/gif/CourseModeration.webp)

**👩‍🏫 Faculty Moderation**
![FacultyModeration](./misc/gif/FacultyModeration.webp)

**⭐ Review Moderation**
![ReviewModeration](./misc/gif/ReviewModeration.webp)

**🧑‍🎓 Student Moderation**
![StudentModeration](./misc/gif/StudentModeration.webp)

<br>

<div align="center">

Built with 🧭 by the CourseCompass team

</div>
