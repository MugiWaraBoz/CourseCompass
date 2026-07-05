# CourseCompass — Team Setup & Collaboration Guide

Two people, one repo. This doc covers what to do **together** before splitting up,
and how to not step on each other afterward.

---

## Part 1 — Do this together, in one sitting, before anyone writes app code

Block out an hour or two for this. It's boring but it's the stuff that's genuinely
annoying to redo later if only one person set it up.

### 1. Create the GitHub repo
- One of you creates the repo (public or private, doesn't matter for a uni project).
- Add the other as a **collaborator** immediately.
- Set the default branch to `main`.

### 2. Agree on the folder structure
Monorepo, two folders, one repo:
```
coursecompass/
├── client/          # React + Vite + Tailwind
├── server/          # Node + Express
├── API_CONTRACT.md
├── TEAM_SETUP_GUIDE.md
└── README.md
```
Whoever sets up the repo scaffolds both folders (even just `npm create vite@latest client` and
a bare `npm init` in `server`) so nobody starts on an empty repo alone.

### 3. Agree on the auth approach (no Firebase)
No third-party auth service — the backend handles it directly. Agree on this together up front
so nobody builds against different assumptions:
- Passwords are hashed with **bcrypt** before saving — never store plain-text passwords, even
  in a class project.
- Login/register returns a **JWT** (`jsonwebtoken` npm package), signed with a secret string.
- The secret lives in `server/.env` as `JWT_SECRET` — just a long random string, e.g. generate
  one with:
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Whoever runs this pastes the result into their own `.env`. **Both of you can have a different
  value locally** — it only needs to match between the token that was signed and the token being
  checked, both of which happen on the same running server. It does NOT need to be shared between
  frontend/backend or between teammates.
- Decide a token expiry, e.g. 7 days (`JWT_EXPIRES_IN=7d`), so you don't have to log in constantly
  while developing, but it's not permanent either.
- Frontend stores the token in `localStorage` after login/register, and attaches it as
  `Authorization: Bearer <token>` on every request that needs to know who's logged in.

### 4. Set up MongoDB Atlas together
- Create a free-tier (M0) cluster together, or one person creates it and adds the other as a
  **project member** in Atlas so both can see logs/data if needed.
- Create a database user (username/password, not your Atlas login).
- Under Network Access, add `0.0.0.0/0` (allow from anywhere) — fine for a dev project, don't
  worry about IP allowlisting for this.
- Copy the connection string — this goes in `server/.env`, never committed.

### 5. Agree on the API contract
Read through `API_CONTRACT.md` together. If anything about the routes, field names, or the
schema additions doesn't make sense or doesn't match what you want, **change it now** — it's
one file edit today vs. a merge conflict headache in three weeks.

### 6. Set up environment variable templates
Both `client/.env.example` and `server/.env.example` should exist in the repo (committed),
listing the variable *names* with no real values:

**`server/.env.example`**
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**`client/.env.example`**
```
VITE_API_BASE_URL=http://localhost:5000/api
```
Each of you copies these to a real `.env` locally and fills in actual values. `.env` must be in
`.gitignore` from commit one.

### 7. Basic `.gitignore`
```
node_modules/
.env
.env.local
dist/
build/
.DS_Store
```

### 8. Agree on code style (5 minutes, don't overthink it)
- 2-space indent, semicolons or not — just pick one and both stick to it.
- If you want, add Prettier with a shared `.prettierrc` so formatting arguments don't happen.
  Not required for a uni project, but removes a class of pointless diffs.

Once all 8 are done, you can genuinely work independently — frontend against the mock data
described in `API_CONTRACT.md` §9, backend against the real routes.

---

## Part 2 — GitHub workflow for the rest of the project

Keep this simple. You don't need a heavyweight process for a 2-person, few-week project.

### Branching
- `main` is always the working, non-broken version.
- Nobody pushes directly to `main` (even though it's just two of you — this habit catches bugs
  before they hit the branch the other person is pulling from).
- Every piece of work gets its own branch:
  ```
  feature/review-form
  fix/vote-count-bug
  chore/setup-eslint
  ```

### Commits
Doesn't need to be fancy, just consistent:
```
feat: add review submission endpoint
fix: correct vote toggle logic
docs: update API contract for semester field
chore: add prettier config
```

### Pull requests
1. Push your branch, open a PR into `main`.
2. Write 2-3 lines describing what changed — future-you will thank present-you.
3. The **other person** takes a quick look before merging — even a 2-minute skim catches things
   like "wait, this doesn't match the API contract."
4. Merge, delete the branch.

### Keeping in sync
Since you're working in different folders (`client/` vs `server/`) most of the time, conflicts
should be rare. Still:
- Pull `main` before starting new work each day: `git pull origin main`
- If you do hit a merge conflict, talk to each other rather than guessing — it's almost always
  faster than untangling it solo.

### Tracking tasks
For a team of 2, a full Jira-style board is overkill. Use **GitHub Issues** + the built-in
**Projects** tab (free Kanban board: To Do / In Progress / Done). Create one issue per feature
(e.g. "Course listing page", "Review CRUD endpoints"), assign it to whoever's doing it. This
also gives you a paper trail for the project submission/report if your course asks for one.

### Integration checkpoints
Since frontend builds against mock data and backend builds against the real contract, agree on
2-3 checkpoints during the project (e.g. end of each week) to actually run both together and
verify they talk to each other correctly. Catching contract drift early is much cheaper than
finding it the night before the deadline.

---

## Quick reference: who owns what after setup

| Area | Owner | Depends on |
|---|---|---|
| React UI, Tailwind styling, routing, forms | Frontend dev | `API_CONTRACT.md` shapes only |
| Express routes, Mongoose models, bcrypt/JWT auth, MongoDB | Backend dev | `JWT_SECRET`, MongoDB URI |
| `API_CONTRACT.md` | Both — edit together whenever it changes | — |
