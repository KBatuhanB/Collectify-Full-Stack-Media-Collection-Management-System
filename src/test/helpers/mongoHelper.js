import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection
const MONGODB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'fullstack-app';

let client;
let db;

// Establish MongoDB connection
const connectDB = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URL);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('MongoDB connection established (test helper)');
  }
  return db;
};

// Close MongoDB connection
const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed (test helper)');
  }
};

// Books Collection CRUD Operations
const booksDB = {
  // Add book (directly to DB without validation)
  async insertBook(bookData) {
    const database = await connectDB();
    const book = {
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await database.collection('books').insertOne(book);
    const savedBook = await database.collection('books').findOne({ _id: result.insertedId });
    return savedBook;
  },

  // Find book (by ID)
  async findBookById(id) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid book ID');
    }
    return await database.collection('books').findOne({ _id: new ObjectId(id) });
  },

  // Get all books
  async findAllBooks() {
    const database = await connectDB();
    return await database.collection('books').find({}).sort({ createdAt: -1 }).toArray();
  },

  // Update book
  async updateBook(id, updateData) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid book ID');
    }
    const bookData = {
      ...updateData,
      updatedAt: new Date()
    };
    delete bookData.createdAt;
    const result = await database.collection('books').updateOne(
      { _id: new ObjectId(id) },
      { $set: bookData }
    );
    if (result.matchedCount === 0) {
      throw new Error('Book not found');
    }
    return await database.collection('books').findOne({ _id: new ObjectId(id) });
  },

  // Delete book
  async deleteBook(id) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid book ID');
    }
    const result = await database.collection('books').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new Error('Book not found');
    }
    return { message: 'Book deleted successfully' };
  },

  // Clean up test books
  async cleanupTestBooks() {
    const database = await connectDB();
    const testTitles = [
      'Test Book 1',
      'Test Book 2',
      'Test Book Context 1',
      'Test Book Context 2',
      'Updated Book',
      'Updated Project',
      'Common Name Test',
      'Cross API Test',
      'Same Name'
    ];
    
    await database.collection('books').deleteMany({
      $or: [
        { title: { $in: testTitles } },
        { title: { $in: ['', null] } },
        { title: { $exists: false } }
      ]
    });
  },

  async cleanupBooksByTestId(testId) {
    const database = await connectDB();
    await database.collection('books').deleteMany({ testId });
  }
};


// Games Collection CRUD Operations
const gamesDB = {
  // Add game (directly to DB without validation)
  async insertGame(gameData) {
    const database = await connectDB();
    const game = {
      ...gameData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await database.collection('games').insertOne(game);
    const savedGame = await database.collection('games').findOne({ _id: result.insertedId });
    return savedGame;
  },

  // Find game (by ID)
  async findGameById(id) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid game ID');
    }
    return await database.collection('games').findOne({ _id: new ObjectId(id) });
  },

  // Get all games
  async findAllGames() {
    const database = await connectDB();
    return await database.collection('games').find({}).sort({ createdAt: -1 }).toArray();
  },

  // Update game
  async updateGame(id, updateData) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid game ID');
    }
    const gameData = {
      ...updateData,
      updatedAt: new Date()
    };
    delete gameData.createdAt;
    const result = await database.collection('games').updateOne(
      { _id: new ObjectId(id) },
      { $set: gameData }
    );
    if (result.matchedCount === 0) {
      throw new Error('Game not found');
    }
    return await database.collection('games').findOne({ _id: new ObjectId(id) });
  },

  // Delete game
  async deleteGame(id) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid game ID');
    }
    const result = await database.collection('games').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new Error('Game not found');
    }
    return { message: 'Game deleted successfully' };
  },

  // Clean up test games
  async cleanupTestGames() {
    const database = await connectDB();
    const testTitles = [
      'Test Game 1',
      'Test Game 2',
      'Test Game',
      'Test Game Context 1',
      'Test Game Context 2',
      'Updated Game',
      'Updated Game',
      'Updated Project'
    ];
    
    await database.collection('games').deleteMany({
      $or: [
        { title: { $in: testTitles } },
        { title: { $in: ['', null] } },
        { title: { $exists: false } }
      ]
    });
  },

  async cleanupTestGamesByTestId(testId) {
    const database = await connectDB();
    await database.collection('games').deleteMany({ testId });
  }
};

// Movies Collection CRUD Operations
const moviesDB = {
  // Add movie (directly to DB without validation)
  async insertMovie(movieData) {
    const database = await connectDB();
    const movie = {
      ...movieData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await database.collection('movies').insertOne(movie);
    const savedMovie = await database.collection('movies').findOne({ _id: result.insertedId });
    return savedMovie;
  },

  // Find movie (by ID)
  async findMovieById(id) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid movie ID');
    }
    return await database.collection('movies').findOne({ _id: new ObjectId(id) });
  },

  // Get all movies
  async findAllMovies() {
    const database = await connectDB();
    return await database.collection('movies').find({}).sort({ createdAt: -1 }).toArray();
  },

  // Update movie
  async updateMovie(id, updateData) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid movie ID');
    }
    const movieData = {
      ...updateData,
      updatedAt: new Date()
    };
    delete movieData.createdAt;
    const result = await database.collection('movies').updateOne(
      { _id: new ObjectId(id) },
      { $set: movieData }
    );
    if (result.matchedCount === 0) {
      throw new Error('Movie not found');
    }
    return await database.collection('movies').findOne({ _id: new ObjectId(id) });
  },

  // Delete movie
  async deleteMovie(id) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid movie ID');
    }
    const result = await database.collection('movies').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new Error('Movie not found');
    }
    return { message: 'Movie deleted successfully' };
  },

  // Clean up test movies
  async cleanupTestMovies() {
    const database = await connectDB();
    const testTitles = [
      'Test Movie 1',
      'Test Movie 2', 
      'Test Movie',
      'Test Movie Context 1',
      'Test Movie Context 2',
      'Updated Movie',
      'Updated Movie',
      'Updated Project'
    ];
    
    await database.collection('movies').deleteMany({
      $or: [
        { title: { $in: testTitles } },
        { title: { $in: ['', null] } },
        { title: { $exists: false } }
      ]
    });
  },

  async cleanupTestMoviesByTestId(testId) {
    const database = await connectDB();
    await database.collection('movies').deleteMany({ testId });
  }
};

// Clean up all test data (only test-added data)
const cleanupAllTestData = async () => {
  try {
    await booksDB.cleanupTestBooks();
    await gamesDB.cleanupTestGames();
    await moviesDB.cleanupTestMovies();
    console.log('Only test data cleaned up (MongoDB direct)');
  } catch (error) {
    console.log('Test data cleanup error:', error.message);
  }
};


export {
  connectDB,
  closeDB,
  booksDB,
  gamesDB,
  moviesDB,
  cleanupAllTestData,
  ObjectId
};
