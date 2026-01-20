const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Helper function to get games collection
const getGameCollection = (db) => db.collection('games');

// GET all games
router.get('/', async (req, res) => {
  try {
    const games = await getGameCollection(req.app.locals.db).find({}).sort({ createdAt: -1 }).toArray();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET game by ID
router.get('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid game ID' });
    }
    
    const game = await getGameCollection(req.app.locals.db).findOne({ _id: new ObjectId(req.params.id) });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new game
router.post('/', async (req, res) => {
  try {
    // Required fields validation
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
    const gameData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await getGameCollection(req.app.locals.db).insertOne(gameData);
    const savedGame = await getGameCollection(req.app.locals.db).findOne({ _id: result.insertedId });
    res.status(201).json(savedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update game
router.put('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid game ID' });
    }
    
    // Required fields validation
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
    const gameData = {
      ...req.body,
      updatedAt: new Date()
    };
    delete gameData.createdAt;
    const result = await getGameCollection(req.app.locals.db).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: gameData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const updatedGame = await getGameCollection(req.app.locals.db).findOne({ _id: new ObjectId(req.params.id) });
    res.json(updatedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE game
router.delete('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid game ID' });
    }
    
    const result = await getGameCollection(req.app.locals.db).deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
