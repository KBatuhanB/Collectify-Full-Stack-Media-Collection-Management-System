import axios from 'axios';

// MongoDB Helper - direkt veritabanı işlemleri için
const { moviesDB, cleanupAllTestData, closeDB } = require('./helpers/mongoHelper.js');

// API URL
const MOVIES_API_URL = 'http://localhost:5000/api/movies';

// Test verileri
const testMovies = [
  {
    title: 'Test Film 1',
    genre: 'Action',
    status: 'İzlendi',
    rating: 8.5,
    releaseYear: 2023,
    image: 'test-image-1.jpg'
  },
  {
    title: 'Test Film 2', 
    genre: 'Drama',
    status: 'İzlenecek',
    rating: 0,
    releaseYear: 2024,
    image: 'test-image-2.jpg'
  }
];

describe('Movies API Integration Tests', () => {
  beforeEach(async () => {
    // Her testten önce test verilerini temizle (direkt MongoDB ile)  
    await moviesDB.cleanupTestMovies();
  });
  afterAll(async () => {
    // Test bitince test verilerini temizle ve DB bağlantısını kapat
    await moviesDB.cleanupTestMovies();
    await closeDB();
  });

  describe('Movies API - POST /api/movies', () => {
    test('should create a new movie with valid data', async () => {   
      // Given - Geçerli test filmi verisi
      const movieData = testMovies[0];

      // When - Gerçek API'yi çağır
      const response = await axios.post(MOVIES_API_URL, movieData);

      // Then - Gerçek response'u kontrol et
      expect(response).toMatchObject({
        status: 201,
        data: {
          title: movieData.title,
          genre: movieData.genre
        }
      });
      expect(response.data).toHaveProperty('_id');

      // Then - Filmin gerçekten veritabanına eklendiğini mongoHelper ile kontrol et
      await expect(moviesDB.findMovieById(response.data._id.toString())).resolves.toMatchObject({title: movieData.title});
    });

    test('should return 400 for movie data without required fields', async () => {
      // Given - Gerekli title alanı eksik film verisi
      const incompleteMovie = {
        genre: 'Action',
        status: 'İzlenecek'
      };

      // When & Then - API çağrısı başarısız olmalı (title eksik)
      await expect(axios.post(MOVIES_API_URL, incompleteMovie)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Title is required and cannot be empty.'
          }
        }
      });
    });

    test('should return 400 for movie data without genre', async () => {
      // Given - genre alanı eksik film verisi
      const incompleteMovie = {
        title: 'Test Film',
        status: 'İzlendi'
      };

      // When & Then - API çağrısı başarısız olmalı (genre eksik)
      await expect(axios.post(MOVIES_API_URL, incompleteMovie)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Genre is required and cannot be empty.'
          }
        }
      });
    });

    test('should return 400 for movie data without status', async () => {
      // Given - status alanı eksik film verisi
      const incompleteMovie = {
        title: 'Test Film',
        genre: 'Action'
      };

      // When & Then - API çağrısı başarısız olmalı (status eksik)
      await expect(axios.post(MOVIES_API_URL, incompleteMovie)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Status is required and cannot be empty.'
          }
        }
      });
    });
  });

  describe('Movies API - GET /api/movies', () => {
    test('should return all movies', async () => {
      // Given - Test verilerini direkt MongoDB ile ekle (API kullanmadan)
      const savedMovie1 = await moviesDB.insertMovie(testMovies[0]);
      const savedMovie2 = await moviesDB.insertMovie(testMovies[1]);

      // Given - Verilerin gerçekten eklendiğini kontrol et
      const dbMovie1 = await moviesDB.findMovieById(savedMovie1._id.toString());
      const dbMovie2 = await moviesDB.findMovieById(savedMovie2._id.toString());
      expect(dbMovie1.title).toBe(testMovies[0].title);
      expect(dbMovie2.title).toBe(testMovies[1].title);

      // When - Gerçek API'yi çağır
      const response = await axios.get(MOVIES_API_URL);

      // Then - Test filmlerinin var olduğunu kontrol et
      expect(response.status).toBe(200);
      const testMovieTitles = response.data.map(movie => movie.title);
      testMovies.forEach(testMovie => {
        expect(testMovieTitles).toContain(testMovie.title);
      });
    });

    test('should return movies array even when no test movies exist', async () => {
      // Given - Bu test için önceki test verilerini temizle
      await cleanupAllTestData();
      
      // When - API'yi çağır
      const response = await axios.get(MOVIES_API_URL);

      // Then - Array döndürülmeli (test dışı filmler da dahil olabilir)
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Then - Test filmlerinin olmadığını kontrol et
      const movieTitles = response.data.map(movie => movie.title);
      expect(movieTitles).not.toContain(testMovies[0].title);
      expect(movieTitles).not.toContain(testMovies[1].title);
    });
  });

  describe('Movies API - GET /api/movies/:id', () => {
    test('should return a single movie by ID', async () => {
      // Given - Veritabanına direkt MongoDB ile test filmi ekle (API kullanmadan)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();
      
      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbMovie = await moviesDB.findMovieById(movieId);
      expect(dbMovie.title).toBe(testMovies[0].title);
      
      // When - ID ile belirli filmi getir
      const response = await axios.get(`${MOVIES_API_URL}/${movieId}`);

      // Then - Doğru film döndürülmeli
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: testMovies[0].title,
          genre: testMovies[0].genre,
          _id: movieId
        }
      });
    });

    test('should return 404 for non-existent movie ID', async () => {
      // Given - Geçerli ama mevcut olmayan ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API çağrısı 404 döndürmeli
      await expect(axios.get(`${MOVIES_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid ID format', async () => {
      // Given - Geçersiz ObjectId formatı
      const invalidId = 'invalid-id';

      // When & Then - API çağrısı 400 döndürmeli
      await expect(axios.get(`${MOVIES_API_URL}/${invalidId}`)).rejects.toMatchObject({response: {status: 400}});
    });
  });

  describe('Movies API - PUT /api/movies/:id', () => {
    test('should update an existing movie', async () => {
      // Given - Veritabanına direkt MongoDB ile test filmi ekle (API kullanmadan)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();

      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbMovie = await moviesDB.findMovieById(movieId);
      expect(dbMovie.title).toBe(testMovies[0].title);
      expect(dbMovie.genre).toBe(testMovies[0].genre);

      const updateData = {
        title: 'Güncellenmiş Film',
        genre: 'Comedy',
        status: 'İzlendi',
        rating: 9.0
      };

      // When - Filmi güncelle
      const response = await axios.put(`${MOVIES_API_URL}/${movieId}`, updateData);

      // Then - Güncellenmiş film döndürülmeli
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: updateData.title,
          genre: updateData.genre,
          rating: updateData.rating
        }
      });

      // Then - Güncellemenin kalıcı olduğunu mongoHelper ile doğrula
      const dbMovieAfterUpdate = await moviesDB.findMovieById(movieId);
      expect(dbMovieAfterUpdate).toMatchObject({
        title: updateData.title,
        genre: updateData.genre
      });
    });

    test('should return 404 for non-existent movie ID', async () => {
      // Given - Geçerli ama mevcut olmayan ObjectId ve güncelleme verisi
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';
      const updateData = { title: 'Updated Movie', genre: 'Comedy', status: 'İzlendi' };

      // When & Then - API çağrısı 404 döndürmeli
      await expect(axios.put(`${MOVIES_API_URL}/${nonExistentId}`, updateData)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid update data', async () => {
      // Given - Direkt MongoDB ile geçerli film ekle ve geçersiz güncelleme verisi (API kullanmadan)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();
      
      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbMovie = await moviesDB.findMovieById(movieId);
      expect(dbMovie.title).toBe(testMovies[0].title);
      
      const invalidUpdateData = { title: '', genre: 'Action', status: 'İzlendi' }; // Boş title

      // When & Then - API çağrısı 400 döndürmeli ve spesifik hata mesajı
      await expect(axios.put(`${MOVIES_API_URL}/${movieId}`, invalidUpdateData)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Title is required and cannot be empty.'
          }
        }
      });
    });
  });

  describe('Movies API - DELETE /api/movies/:id', () => {
    test('should delete an existing movie', async () => {
      // Given - Veritabanına direkt MongoDB ile test filmi ekle (API kullanmadan)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();

      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbMovie = await moviesDB.findMovieById(movieId);
      expect(dbMovie.title).toBe(testMovies[0].title);

      // When - Filmi sil
      const response = await axios.delete(`${MOVIES_API_URL}/${movieId}`);

      // Then - Başarılı silme response'u
      expect(response).toMatchObject({
        status: 200,
        data: {
          message: 'Movie deleted successfully'
        }
      });

      // Then - Filmin silindiğini mongoHelper ile doğrula
      const deletedMovie = await moviesDB.findMovieById(movieId);
      expect(deletedMovie).toBeNull();
    });

    test('should return 404 for non-existent movie ID', async () => {
      // Given - Geçerli ama mevcut olmayan ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API çağrısı 404 döndürmeli
      await expect(axios.delete(`${MOVIES_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid movie ID format', async () => {
      // Given - Geçersiz ObjectId formatı
      const invalidId = 'invalid-id-format';

      // When & Then - API çağrısı 400 döndürmeli
      await expect(axios.delete(`${MOVIES_API_URL}/${invalidId}`)).rejects.toMatchObject({
        response: {
          status: 400
        }
      });
    });
  });
});
