const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Helper function to get books collection
const getBookCollection = (db) => db.collection('books');

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await getBookCollection(req.app.locals.db).find({}).sort({ createdAt: -1 }).toArray();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET book by ID
router.get('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    
    const book = await getBookCollection(req.app.locals.db).findOne({ _id: new ObjectId(req.params.id) });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new book
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
    const bookData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await getBookCollection(req.app.locals.db).insertOne(bookData);
    const savedBook = await getBookCollection(req.app.locals.db).findOne({ _id: result.insertedId });
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update book
router.put('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
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
    const bookData = {
      ...req.body,
      updatedAt: new Date()
    };
    delete bookData.createdAt;
    const result = await getBookCollection(req.app.locals.db).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: bookData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const updatedBook = await getBookCollection(req.app.locals.db).findOne({ _id: new ObjectId(req.params.id) });
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE book
router.delete('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    
    const result = await getBookCollection(req.app.locals.db).deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
