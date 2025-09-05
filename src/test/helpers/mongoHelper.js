import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection
const MONGODB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'fullstack-app';

let client;
let db;

// MongoDB bağlantısı kur
const connectDB = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URL);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('MongoDB bağlantısı kuruldu (test helper)');
  }
  return db;
};

// MongoDB bağlantısını kapat
const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB bağlantısı kapatıldı (test helper)');
  }
};

// Books Collection CRUD Operations
const booksDB = {
  // Kitap ekle (validation olmadan direkt DB'ye)
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

  // Kitap bul (ID ile)
  async findBookById(id) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid book ID');
    }
    return await database.collection('books').findOne({ _id: new ObjectId(id) });
  },

  // Tüm kitapları getir
  async findAllBooks() {
    const database = await connectDB();
    return await database.collection('books').find({}).sort({ createdAt: -1 }).toArray();
  },

  // Kitap güncelle
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

  // Kitap sil
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

  // Test kitaplarını temizle
  async cleanupTestBooks() {
    const database = await connectDB();
    const testTitles = [
      'Test Kitap 1',
      'Test Kitap 2',
      'Test Kitap Context 1',
      'Test Kitap Context 2',
      'Güncellenmiş Kitap',
      'Updated Project',
      'Ortak İsim Test',
      'Cross API Test',
      'Aynı İsim'
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
  // Oyun ekle (validation olmadan direkt DB'ye)
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

  // Oyun bul (ID ile)
  async findGameById(id) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid game ID');
    }
    return await database.collection('games').findOne({ _id: new ObjectId(id) });
  },

  // Tüm oyunları getir
  async findAllGames() {
    const database = await connectDB();
    return await database.collection('games').find({}).sort({ createdAt: -1 }).toArray();
  },

  // Oyun güncelle
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

  // Oyun sil
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

  // Test oyunlarını temizle
  async cleanupTestGames() {
    const database = await connectDB();
    const testTitles = [
      'Test Oyun 1',
      'Test Oyun 2',
      'Test Oyun',
      'Test Oyun Context 1',
      'Test Oyun Context 2',
      'Güncellenmiş Oyun',
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
  // Film ekle (validation olmadan direkt DB'ye)
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

  // Film bul (ID ile)
  async findMovieById(id) {
    const database = await connectDB();
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid movie ID');
    }
    return await database.collection('movies').findOne({ _id: new ObjectId(id) });
  },

  // Tüm filmleri getir
  async findAllMovies() {
    const database = await connectDB();
    return await database.collection('movies').find({}).sort({ createdAt: -1 }).toArray();
  },

  // Film güncelle
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

  // Film sil
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

  // Test filmlerini temizle
  async cleanupTestMovies() {
    const database = await connectDB();
    const testTitles = [
      'Test Film 1',
      'Test Film 2', 
      'Test Film',
      'Test Film Context 1',
      'Test Film Context 2',
      'Güncellenmiş Film',
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

// Tüm test verilerini (sadece test amaçlı eklenenleri) temizle
const cleanupAllTestData = async () => {
  try {
    await booksDB.cleanupTestBooks();
    await gamesDB.cleanupTestGames();
    await moviesDB.cleanupTestMovies();
    console.log('Sadece test verileri temizlendi (MongoDB direkt)');
  } catch (error) {
    console.log('Test veri temizleme hatası:', error.message);
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
