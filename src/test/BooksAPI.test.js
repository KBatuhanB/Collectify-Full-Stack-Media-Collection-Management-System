import axios from 'axios';

// MongoDB Helper - direkt veritabanı işlemleri için
const { booksDB, closeDB } = require('./helpers/mongoHelper.js');

// API URL
const BOOKS_API_URL = 'http://localhost:5000/api/books';

// Test verileri
const testBooks = [
  {
    title: 'Test Kitap 1',
    author: 'Test Yazar 1',
    genre: 'Fiction',
    status: 'Okundu',
    rating: 4.0,
    image: 'test-book-1.jpg'
  },
  {
    title: 'Test Kitap 2',
    author: 'Test Yazar 2',
    genre: 'Non-Fiction',
    status: 'Okunacak',
    rating: 0,
    image: 'test-book-2.jpg'
  }
];

describe('Books API Integration Tests', () => {
  beforeEach(async () => {
    // Her testten önce test verilerini temizle (direkt MongoDB ile)
    await booksDB.cleanupTestBooks();
  });

  afterAll(async () => {
    // Test bitince test verilerini temizle
    await booksDB.cleanupTestBooks();
  await closeDB();
  });

  describe('Books API - POST /api/books', () => {
    test('should create a new book with valid data', async () => {
      // Given - Geçerli test kitabı verisi
      const bookData = testBooks[0];

      // When - Gerçek API'yi çağır
      const response = await axios.post(BOOKS_API_URL, bookData);

      // Then - Gerçek response'u kontrol et
      expect(response).toMatchObject({
        status: 201,
        data: {
          title: bookData.title,
          author: bookData.author,
          genre: bookData.genre
        }
      });
      expect(response.data).toHaveProperty('_id');

      // Then - Kitabin gerçekten veritabanına eklendiğini mongoHelper ile kontrol et
      await expect(booksDB.findBookById(response.data._id.toString())).resolves.toMatchObject({title: bookData.title});
    });

    test('should return 400 for book data without required fields', async () => {
      // Given - Gerekli title alanı eksik kitap verisi
      const incompleteBook = {
        author: 'Test Author',
        genre: 'Fiction',
        status: 'Okundu'
      };

      // When & Then - API çağrısı başarısız olmalı (title eksik)
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
      // Given - genre alanı eksik kitap verisi
      const incompleteBook = {
        title: 'Test Kitap',
        author: 'Test Author',
        status: 'Okundu'
      };

      // When & Then - API çağrısı başarısız olmalı (genre eksik)
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
      // Given - status alanı eksik kitap verisi
      const incompleteBook = {
        title: 'Test Kitap',
        author: 'Test Author',
        genre: 'Fiction'
      };

      // When & Then - API çağrısı başarısız olmalı (status eksik)
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
      // Given - Test verilerini direkt MongoDB ile ekle (API kullanmadan)
      const savedBook1 = await booksDB.insertBook(testBooks[0]);
      const savedBook2 = await booksDB.insertBook(testBooks[1]);

      // Given - Verilerin gerçekten eklendiğini kontrol et
      const dbBook1 = await booksDB.findBookById(savedBook1._id.toString());
      const dbBook2 = await booksDB.findBookById(savedBook2._id.toString());
      expect(dbBook1.title).toBe(testBooks[0].title);
      expect(dbBook2.title).toBe(testBooks[1].title);

      // When - Gerçek API'yi çağır
      const response = await axios.get(BOOKS_API_URL);

      // Then - Test kitaplarının var olduğunu kontrol et
      expect(response.status).toBe(200);
      const testBookTitles = response.data.map(book => book.title);
      testBooks.forEach(testBook => {
        expect(testBookTitles).toContain(testBook.title);
      });
    });

    test('should return books array even when no test books exist', async () => {
      // Given - Test dışı kitaplar olabilir ama test kitapları temizlenmiş

      // When - API'yi çağır
      const response = await axios.get(BOOKS_API_URL);

      // Then - Array döndürülmeli (test dışı kitaplar da dahil olabilir)
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Then - Test kitaplarının olmadığını kontrol et
      const bookTitles = response.data.map(book => book.title);
      expect(bookTitles).not.toContain(testBooks[0].title);
      expect(bookTitles).not.toContain(testBooks[1].title);
    });
  });

  describe('Books API - GET /api/books/:id', () => {
    test('should return a single book by ID', async () => {
      // Given - Veritabanına direkt MongoDB ile test kitabı ekle (API kullanmadan)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      
      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbBook = await booksDB.findBookById(bookId);
      expect(dbBook.title).toBe(testBooks[0].title);
      
      // When - ID ile belirli kitabı getir
      const response = await axios.get(`${BOOKS_API_URL}/${bookId}`);

      // Then - Doğru kitap döndürülmeli
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
      // Given - Geçerli ama mevcut olmayan ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API çağrısı 404 döndürmeli
      await expect(axios.get(`${BOOKS_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid ID format', async () => {
      // Given - Geçersiz ObjectId formatı
      const invalidId = 'invalid-book-id';

      // When & Then - API çağrısı 400 döndürmeli
      await expect(axios.get(`${BOOKS_API_URL}/${invalidId}`)).rejects.toMatchObject({response: {status: 400}});
    });
  });

  describe('Books API - PUT /api/books/:id', () => {
    test('should update an existing book', async () => {
      // Given - Veritabanına direkt MongoDB ile test kitabı ekle (API kullanmadan)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();

      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbBook = await booksDB.findBookById(bookId);
      expect(dbBook.title).toBe(testBooks[0].title);
      expect(dbBook.author).toBe(testBooks[0].author);

      const updateData = {
        title: 'Güncellenmiş Kitap',
        author: 'Güncellenmiş Yazar',
        genre: 'Mystery',
        status: 'Okundu',
        rating: 4.5
      };

      // When - Kitabı güncelle
      const response = await axios.put(`${BOOKS_API_URL}/${bookId}`, updateData);

      // Then - Güncellenmiş kitap döndürülmeli
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: updateData.title,
          author: updateData.author,
          genre: updateData.genre,
          rating: updateData.rating
        }
      });

      // Then - Güncellemenin kalıcı olduğunu mongoHelper ile doğrula
      const dbBookAfterUpdate = await booksDB.findBookById(bookId);
      expect(dbBookAfterUpdate).toMatchObject({
        title: updateData.title,
        author: updateData.author
      });
    });

    test('should return 404 for non-existent book ID', async () => {
      // Given - Geçerli ama mevcut olmayan ObjectId ve güncelleme verisi
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';
      const updateData = { title: 'Updated Book', author: 'Updated Author', genre: 'Fiction', status: 'Okundu' };

      // When & Then - API çağrısı 404 döndürmeli
      await expect(axios.put(`${BOOKS_API_URL}/${nonExistentId}`, updateData)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid update data', async () => {
      // Given - Direkt MongoDB ile geçerli kitap ekle ve geçersiz güncelleme verisi (API kullanmadan)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      
      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbBook = await booksDB.findBookById(bookId);
      expect(dbBook.title).toBe(testBooks[0].title);
      
      const invalidUpdateData = { title: '', author: '', genre: 'Fiction', status: 'Okundu' }; // Boş title

      // When & Then - API çağrısı 400 döndürmeli ve spesifik hata mesajı
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
      // Given - Veritabanına direkt MongoDB ile test kitabı ekle (API kullanmadan)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();

      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbBook = await booksDB.findBookById(bookId);
      expect(dbBook.title).toBe(testBooks[0].title);

      // When - Kitabı sil
      const response = await axios.delete(`${BOOKS_API_URL}/${bookId}`);

      // Then - Başarılı silme response'u
      expect(response).toMatchObject({
        status: 200,
        data: {
          message: 'Book deleted successfully'
        }
      });

      // Then - Kitabın silindiğini mongoHelper ile doğrula
      const deletedBook = await booksDB.findBookById(bookId);
      expect(deletedBook).toBeNull();
    });

    test('should return 404 for non-existent book ID', async () => {
      // Given - Geçerli ama mevcut olmayan ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API çağrısı 404 döndürmeli
      await expect(axios.delete(`${BOOKS_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid book ID format', async () => {
      // Given - Geçersiz ObjectId formatı
      const invalidId = 'invalid-book-id-format';

      // When & Then - API çağrısı 400 döndürmeli
      await expect(axios.delete(`${BOOKS_API_URL}/${invalidId}`)).rejects.toMatchObject({
        response: {
          status: 400
        }
      });
    });
  });
});
