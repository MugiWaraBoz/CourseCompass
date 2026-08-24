const express = require('express');
const cors = require('cors');

// Routes
const auth = require('./routes/authRoutes');
const course = require('./routes/courseRoutes');
const faculty = require('./routes/facultyRoutes');
const student = require('./routes/studentRoutes');
const review = require('./routes/reviewRoutes');
const ai = require('./routes/aiRoutes');
const status = require('./routes/statusRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', auth);
app.use('/courses', course);
app.use('/faculty', faculty);
app.use('/students', student);
app.use('/reviews', review);
app.use('/ai', ai);
app.use('/status', status);

module.exports = app;
