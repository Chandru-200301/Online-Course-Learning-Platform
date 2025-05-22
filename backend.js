const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'coding_learning_db';
let db;

async function connectDB() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    await db.createCollection('users');
    await db.createCollection('courses');
    await db.createCollection('enrollments');
    await db.createCollection('assessments');
    await db.createCollection('feedback');
    await db.createCollection('discussions');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

async function createUser(user) {
  if (!db) throw new Error('Database not connected');
  await db.collection('users').insertOne(user);
}

async function getUserByEmail(email) {
  if (!db) throw new Error('Database not connected');
  return await db.collection('users').findOne({ email });
}

async function getAllUsers() {
  if (!db) throw new Error('Database not connected');
  return await db.collection('users').find().toArray();
}

async function createCourse(course) {
  if (!db) throw new Error('Database not connected');
  await db.collection('courses').insertOne(course);
}

async function getAllCourses() {
  if (!db) throw new Error('Database not connected');
  return await db.collection('courses').find().toArray();
}

async function createEnrollment(enrollment) {
  if (!db) throw new Error('Database not connected');
  await db.collection('enrollments').insertOne(enrollment);
}

async function getEnrollments(userId) {
  if (!db) throw new Error('Database not connected');
  return await db.collection('enrollments').find({ userId }).toArray();
}

async function createAssessment(assessment) {
  if (!db) throw new Error('Database not connected');
  await db.collection('assessments').insertOne(assessment);
}

async function createFeedback(feedback) {
  if (!db) throw new Error('Database not connected');
  await db.collection('feedback').insertOne(feedback);
}

async function createDiscussionPost(post) {
  if (!db) throw new Error('Database not connected');
  await db.collection('discussions').insertOne(post);
}

module.exports = {
  connectDB,
  createUser,
  getUserByEmail,
  getAllUsers,
  createCourse,
  getAllCourses,
  createEnrollment,
  getEnrollments,
  createAssessment,
  createFeedback,
  createDiscussionPost,
};