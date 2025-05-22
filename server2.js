const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// MongoDB Connection String
const url = 'mongodb+srv://chandrothayanr:chandru%40123@cluster0.nlehg3q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'courses';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
let db;

async function connectDB() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    
    // Create collections if they don't exist
    await db.createCollection('users');
    await db.createCollection('courses');
    await db.createCollection('enrollments');
    await db.createCollection('assessments');
    await db.createCollection('feedback');
    await db.createCollection('discussions');
    
    console.log('Collections created or already exist');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Endpoints
// User Registration & Login
app.post('/api/users/register', async (req, res) => {
  try {
    await db.collection('users').insertOne(req.body);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.collection('users').findOne({ email, password });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Endpoints
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/courses', async (req, res) => {
  try {
    const courses = await db.collection('courses').find().toArray();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Learner Endpoints
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await db.collection('courses').find().toArray();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/enrollments', async (req, res) => {
  try {
    await db.collection('enrollments').insertOne(req.body);
    res.status(201).json({ message: 'Enrolled in course' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/enrollments/', async (req, res) => {
  const { userId } = req.query;
  try {
    const enrollments = await db.collection('enrollments').find({ userId }).toArray();
    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/assessments', async (req, res) => {
  const { userId } = req.query;
  try {
    const enrollments = await db.collection('assessments').find({ userId }).toArray();
    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/assessments', async (req, res) => {
  try {
    await db.collection('assessments').insertOne(req.body);
    res.status(201).json({ message: 'Assessment submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    await db.collection('feedback').insertOne(req.body);
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/discussion', async (req, res) => {
  try {
    await db.collection('discussions').insertOne(req.body);
    res.status(201).json({ message: 'Question posted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Instructor Endpoints
app.post('/api/courses', async (req, res) => {
  try {
    await db.collection('courses').insertOne(req.body);
    res.status(201).json({ message: 'Course created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
async function start() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

start()