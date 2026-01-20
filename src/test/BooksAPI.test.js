import axios from 'axios';

// MongoDB Helper - for direct database operations
const { booksDB, closeDB } = require('./helpers/mongoHelper.js');

// API URL
const BOOKS_API_URL = 'http://localhost:5000/api/books';

// Test data
const testBooks = [
  {
    title: 'Test Book 1',
    author: 'Test Author 1',
    genre: 'Fiction',
    status: 'Read',
    rating: 4.0,
    image: 'test-book-1.jpg'
  },
  {
    title: 'Test Book 2',
    author: 'Test Author 2',
    genre: 'Non-Fiction',
    status: 'To Read',
    rating: 0,
    image: 'test-book-2.jpg'
  }
];

describe('Books API Integration Tests', () => {
  beforeEach(async () => {
    // Clean up test data before each test (direct MongoDB)
    await booksDB.cleanupTestBooks();
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await booksDB.cleanupTestBooks();
  await closeDB();
  });

  describe('Books API - POST /api/books', () => {
    test('should create a new book with valid data', async () => {
      // Given - Valid test book data
      const bookData = testBooks[0];

      // When - Call the real API
      const response = await axios.post(BOOKS_API_URL, bookData);

      // Then - Check the real response
      expect(response).toMatchObject({
        status: 201,
        data: {
          title: bookData.title,
          author: bookData.author,
          genre: bookData.genre
        }
      });
      expect(response.data).toHaveProperty('_id');

      // Then - Verify the book was actually added to the database using mongoHelper
      await expect(booksDB.findBookById(response.data._id.toString())).resolves.toMatchObject({title: bookData.title});
    });

    test('should return 400 for book data without required fields', async () => {
      // Given - Book data without required title field
      const incompleteBook = {
        author: 'Test Author',
        genre: 'Fiction',
        status: 'Read'
      };

      // When & Then - API call should fail (title missing)
      await expect(axios.post(BOOKS_API_URL, incompleteBook)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Title is required and cannot be empty.'
          }
        }
      });
    });

    test('should return 400 for book data without genre', async () => {
      // Given - Book data without genre field
      const incompleteBook = {
        title: 'Test Book',
        author: 'Test Author',
        status: 'Read'
      };

      // When & Then - API call should fail (genre missing)
      await expect(axios.post(BOOKS_API_URL, incompleteBook)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Genre is required and cannot be empty.'
          }
        }
      });
    });

    test('should return 400 for book data without status', async () => {
      // Given - Book data without status field
      const incompleteBook = {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction'
      };

      // When & Then - API call should fail (status missing)
      await expect(axios.post(BOOKS_API_URL, incompleteBook)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Status is required and cannot be empty.'
          }
        }
      });
    });
  });

  describe('Books API - GET /api/books', () => {
    test('should return all books', async () => {
      // Given - Add test data directly with MongoDB (without API)
      const savedBook1 = await booksDB.insertBook(testBooks[0]);
      const savedBook2 = await booksDB.insertBook(testBooks[1]);

      // Given - Verify data was actually added
      const dbBook1 = await booksDB.findBookById(savedBook1._id.toString());
      const dbBook2 = await booksDB.findBookById(savedBook2._id.toString());
      expect(dbBook1.title).toBe(testBooks[0].title);
      expect(dbBook2.title).toBe(testBooks[1].title);

      // When - Call the real API
      const response = await axios.get(BOOKS_API_URL);

      // Then - Verify test books exist
      expect(response.status).toBe(200);
      const testBookTitles = response.data.map(book => book.title);
      testBooks.forEach(testBook => {
        expect(testBookTitles).toContain(testBook.title);
      });
    });

    test('should return books array even when no test books exist', async () => {
      // Given - Non-test books may exist but test books are cleaned up

      // When - Call the API
      const response = await axios.get(BOOKS_API_URL);

      // Then - Array should be returned (may include non-test books)
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Then - Verify test books don't exist
      const bookTitles = response.data.map(book => book.title);
      expect(bookTitles).not.toContain(testBooks[0].title);
      expect(bookTitles).not.toContain(testBooks[1].title);
    });
  });

  describe('Books API - GET /api/books/:id', () => {
    test('should return a single book by ID', async () => {
      // Given - Add test book directly with MongoDB (without API)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      
      // Given - Verify data was actually added
      const dbBook = await booksDB.findBookById(bookId);
      expect(dbBook.title).toBe(testBooks[0].title);
      
      // When - Get specific book by ID
      const response = await axios.get(`${BOOKS_API_URL}/${bookId}`);

      // Then - Correct book should be returned
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: testBooks[0].title,
          author: testBooks[0].author,
          _id: bookId
        }
      });
    });

    test('should return 404 for non-existent book ID', async () => {
      // Given - Valid but non-existent ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API call should return 404
      await expect(axios.get(`${BOOKS_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid ID format', async () => {
      // Given - Invalid ObjectId format
      const invalidId = 'invalid-book-id';

      // When & Then - API call should return 400
      await expect(axios.get(`${BOOKS_API_URL}/${invalidId}`)).rejects.toMatchObject({response: {status: 400}});
    });
  });

  describe('Books API - PUT /api/books/:id', () => {
    test('should update an existing book', async () => {
      // Given - Add test book directly with MongoDB (without API)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();

      // Given - Verify data was actually added
      const dbBook = await booksDB.findBookById(bookId);
      expect(dbBook.title).toBe(testBooks[0].title);
      expect(dbBook.author).toBe(testBooks[0].author);

      const updateData = {
        title: 'Updated Book',
        author: 'Updated Author',
        genre: 'Mystery',
        status: 'Read',
        rating: 4.5
      };

      // When - Update the book
      const response = await axios.put(`${BOOKS_API_URL}/${bookId}`, updateData);

      // Then - Updated book should be returned
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: updateData.title,
          author: updateData.author,
          genre: updateData.genre,
          rating: updateData.rating
        }
      });

      // Then - Verify update is persistent using mongoHelper
      const dbBookAfterUpdate = await booksDB.findBookById(bookId);
      expect(dbBookAfterUpdate).toMatchObject({
        title: updateData.title,
        author: updateData.author
      });
    });

    test('should return 404 for non-existent book ID', async () => {
      // Given - Valid but non-existent ObjectId and update data
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';
      const updateData = { title: 'Updated Book', author: 'Updated Author', genre: 'Fiction', status: 'Read' };

      // When & Then - API call should return 404
      await expect(axios.put(`${BOOKS_API_URL}/${nonExistentId}`, updateData)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid update data', async () => {
      // Given - Add valid book directly with MongoDB and invalid update data (without API)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      
      // Given - Verify data was actually added
      const dbBook = await booksDB.findBookById(bookId);
      expect(dbBook.title).toBe(testBooks[0].title);
      
      const invalidUpdateData = { title: '', author: '', genre: 'Fiction', status: 'Read' }; // Empty title

      // When & Then - API call should return 400 with specific error message
      await expect(axios.put(`${BOOKS_API_URL}/${bookId}`, invalidUpdateData)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Title is required and cannot be empty.'
          }
        }
      });
    });
  });

  describe('Books API - DELETE /api/books/:id', () => {
    test('should delete an existing book', async () => {
      // Given - Add test book directly with MongoDB (without API)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();

      // Given - Verify data was actually added
      const dbBook = await booksDB.findBookById(bookId);
      expect(dbBook.title).toBe(testBooks[0].title);

      // When - Delete the book
      const response = await axios.delete(`${BOOKS_API_URL}/${bookId}`);

      // Then - Successful delete response
      expect(response).toMatchObject({
        status: 200,
        data: {
          message: 'Book deleted successfully'
        }
      });

      // Then - Verify book was deleted using mongoHelper
      const deletedBook = await booksDB.findBookById(bookId);
      expect(deletedBook).toBeNull();
    });

    test('should return 404 for non-existent book ID', async () => {
      // Given - Valid but non-existent ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API call should return 404
      await expect(axios.delete(`${BOOKS_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid book ID format', async () => {
      // Given - Invalid ObjectId format
      const invalidId = 'invalid-book-id-format';

      // When & Then - API call should return 400
      await expect(axios.delete(`${BOOKS_API_URL}/${invalidId}`)).rejects.toMatchObject({
        response: {
          status: 400
        }
      });
    });
  });
});
