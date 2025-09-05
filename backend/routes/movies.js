const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Helper function to get movies collection
const getMovieCollection = (db) => db.collection('movies');

// GET all movies
router.get('/', async (req, res) => {
  try {
    const movies = await getMovieCollection(req.app.locals.db).find({}).sort({ createdAt: -1 }).toArray();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET movie by ID
router.get('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }
    
    const movie = await getMovieCollection(req.app.locals.db).findOne({ _id: new ObjectId(req.params.id) });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new movie
router.post('/', async (req, res) => {
  try {
    // Zorunlu alanlar validation
    const { title, genre, status } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required and cannot be empty.' });
    }
    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
      return res.status(400).json({ message: 'Genre is required and cannot be empty.' });
    }
    if (!status || typeof status !== 'string' || status.trim() === '') {
      return res.status(400).json({ message: 'Status is required and cannot be empty.' });
    }
    const movieData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await getMovieCollection(req.app.locals.db).insertOne(movieData);
    const savedMovie = await getMovieCollection(req.app.locals.db).findOne({ _id: result.insertedId });
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update movie
router.put('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }
    
    // Zorunlu alanlar validation
    const { title, genre, status } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required and cannot be empty.' });
    }
    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
      return res.status(400).json({ message: 'Genre is required and cannot be empty.' });
    }
    if (!status || typeof status !== 'string' || status.trim() === '') {
      return res.status(400).json({ message: 'Status is required and cannot be empty.' });
    }
    const movieData = {
      ...req.body,
      updatedAt: new Date()
    };
    delete movieData.createdAt;
    const result = await getMovieCollection(req.app.locals.db).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: movieData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    const updatedMovie = await getMovieCollection(req.app.locals.db).findOne({ _id: new ObjectId(req.params.id) });
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE movie
router.delete('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }
    
    const result = await getMovieCollection(req.app.locals.db).deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
