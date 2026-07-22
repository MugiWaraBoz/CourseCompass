# Instructions
## Env Setup
create a copy of `.env_example` and name it `.env`
```
# Database connection string
MONGO_URL= --your mongodb url--
DB_NAME= --your database name--

# Server port
API_PORT=3000 -- dont change this!!

# JWT secret key
JWT_SECRET= --any-text-- -/or/- --generate-a-secreat-key--
```
**important: dont use space after equal(=) is env files** 

## Server setup
Run `npm init` first then,

Run the server using `npm run server` 

make sure to run the command inside the `server` folder

Successfull connection example 

```
◇ injected env (4) from .env // tip: ⌘ suppress logs { quiet: true }
◇ injected env (0) from ..\.env // tip: ⌁ auth for agents [www.vestauth.com]
◇ injected env (0) from .env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
◇ injected env (0) from ..\..\.env // tip: ◈ encrypted .env [www.dotenvx.com]
◇ injected env (0) from ..\..\.env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }

            -> Server is running on port 3000,
            -> connected to database: CourseCompass

```

## Mock Database Setup
Upload the json files accordingly inside mongoDB

**Courses** - courses_seed_with_prereq_ids.json

**Faculty** - faculty_mongodb_seed_final.json

And the database is ready to go!