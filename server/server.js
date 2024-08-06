
require('dotenv').config();
const express = require('express');

const connectDB = require('./config/db');


const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
const cors = require('cors');
app.use(cors());

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5200;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));