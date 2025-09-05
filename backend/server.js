const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const mongoUrl = process.env.MONGODB_URI;
let db;

MongoClient.connect(mongoUrl)
.then(client => {
  console.log('MongoDB connected');
  db = client.db('fullstack-app');
  // Make db available to routes
  app.locals.db = db;
})
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/movies', require('./routes/movies'));
app.use('/api/games', require('./routes/games'));
app.use('/api/books', require('./routes/books'));
app.use('/api/uploads', require('./routes/uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'FullStack App API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
