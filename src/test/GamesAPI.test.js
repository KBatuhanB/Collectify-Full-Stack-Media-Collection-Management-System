import axios from 'axios';
// MongoDB Helper - direkt veritabanı işlemleri için
const { gamesDB, closeDB } = require('./helpers/mongoHelper.js');

// API URL
const GAMES_API_URL = 'http://localhost:5000/api/games';

// Test verileri
const testGames = [
  {
    title: 'Test Oyun 1',
    genre: 'RPG',
    status: 'Oynandı',
    rating: 9.0,
    platform: 'PC',
    image: 'test-game-1.jpg'
  },
  {
    title: 'Test Oyun 2',
    genre: 'Action',
    status: 'Oynanacak',
    rating: 0,
    platform: 'PS5',
    image: 'test-game-2.jpg'
  }
];

describe('Games API Integration Tests', () => {
  beforeEach(async () => {
    // Her testten önce test verilerini temizle (direkt MongoDB ile)
    await gamesDB.cleanupTestGames();
  });

  afterAll(async () => {
    // Test bitince test verilerini temizle ve DB bağlantısını kapat
  await gamesDB.cleanupTestGames();
  await closeDB();
  });

  describe('Games API - POST /api/games', () => {
    test('should create a new game with valid data', async () => {
      // Given - Geçerli test oyunu verisi
      const gameData = testGames[0];

      // When - Gerçek API'yi çağır
      const response = await axios.post(GAMES_API_URL, gameData);

      // Then - Gerçek response'u kontrol et
      expect(response).toMatchObject({
        status: 201,
        data: {
          title: gameData.title,
          genre: gameData.genre,
          platform: gameData.platform
        }
      });
      expect(response.data).toHaveProperty('_id');

      // Then - Oyunun gerçekten veritabanına eklendiğini mongoHelper ile kontrol et
      await expect(gamesDB.findGameById(response.data._id.toString())).resolves.toMatchObject({title: gameData.title});
    });

    test('should return 400 for game data without required fields', async () => {
      // Given - Gerekli title alanı eksik oyun verisi
      const incompleteGame = {
        genre: 'RPG',
        platform: 'PC',
        status: 'Oynandı'
      };

      // When & Then - API çağrısı başarısız olmalı (title eksik)
      await expect(axios.post(GAMES_API_URL, incompleteGame)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Title is required and cannot be empty.'
          }
        }
      });
    });

    test('should return 400 for game data without genre', async () => {
      // Given - genre alanı eksik oyun verisi
      const incompleteGame = {
        title: 'Test Oyun',
        platform: 'PC',
        status: 'Oynandı'
      };

      // When & Then - API çağrısı başarısız olmalı (genre eksik)
      await expect(axios.post(GAMES_API_URL, incompleteGame)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Genre is required and cannot be empty.'
          }
        }
      });
    });

    test('should return 400 for game data without status', async () => {
      // Given - status alanı eksik oyun verisi
      const incompleteGame = {
        title: 'Test Oyun',
        genre: 'RPG',
        platform: 'PC'
      };

      // When & Then - API çağrısı başarısız olmalı (status eksik)
      await expect(axios.post(GAMES_API_URL, incompleteGame)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Status is required and cannot be empty.'
          }
        }
      });
    });
  });

  describe('Games API - GET /api/games', () => {
    test('should return all games', async () => {
      // Given - Test verilerini direkt MongoDB ile ekle (API kullanmadan)
      const savedGame1 = await gamesDB.insertGame(testGames[0]);
      const savedGame2 = await gamesDB.insertGame(testGames[1]);

      // Given - Verilerin gerçekten eklendiğini kontrol et
      const dbGame1 = await gamesDB.findGameById(savedGame1._id.toString());
      const dbGame2 = await gamesDB.findGameById(savedGame2._id.toString());
      expect(dbGame1.title).toBe(testGames[0].title);
      expect(dbGame2.title).toBe(testGames[1].title);

      // When - Gerçek API'yi çağır
      const response = await axios.get(GAMES_API_URL);

      // Then - Test oyunlarının var olduğunu kontrol et
      expect(response.status).toBe(200);
      const testGameTitles = response.data.map(game => game.title);
      testGames.forEach(testGame => {
        expect(testGameTitles).toContain(testGame.title);
      });
    });

    test('should return games array even when no test games exist', async () => {
      // When - API'yi çağır
      const response = await axios.get(GAMES_API_URL);

      // Then - Array döndürülmeli (test dışı oyunlar da dahil olabilir)
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Then - Test oyunlarının olmadığını kontrol et
      const gameTitles = response.data.map(game => game.title);
      expect(gameTitles).not.toContain(testGames[0].title);
      expect(gameTitles).not.toContain(testGames[1].title);
    });
  });

  describe('Games API - GET /api/games/:id', () => {
    test('should return a single game by ID', async () => {
      // Given - Veritabanına direkt MongoDB ile test oyunu ekle (API kullanmadan)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();
      
      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbGame = await gamesDB.findGameById(gameId);
      expect(dbGame.title).toBe(testGames[0].title);
      
      // When - ID ile belirli oyunu getir
      const response = await axios.get(`${GAMES_API_URL}/${gameId}`);

      // Then - Doğru oyun döndürülmeli
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: testGames[0].title,
          genre: testGames[0].genre,
          _id: gameId
        }
      });
    });

    test('should return 404 for non-existent game ID', async () => {
      // Given - Geçerli ama mevcut olmayan ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API çağrısı 404 döndürmeli
      await expect(axios.get(`${GAMES_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid ID format', async () => {
      // Given - Geçersiz ObjectId formatı
      const invalidId = 'invalid-game-id';

      // When & Then - API çağrısı 400 döndürmeli
      await expect(axios.get(`${GAMES_API_URL}/${invalidId}`)).rejects.toMatchObject({response: {status: 400}});
    });
  });

  describe('Games API - PUT /api/games/:id', () => {
    test('should update an existing game', async () => {
      // Given - Veritabanına direkt MongoDB ile test oyunu ekle (API kullanmadan)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();

      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbGame = await gamesDB.findGameById(gameId);
      expect(dbGame.title).toBe(testGames[0].title);
      expect(dbGame.genre).toBe(testGames[0].genre);

      const updateData = {
        title: 'Güncellenmiş Oyun',
        genre: 'Strategy',
        status: 'Oynandı',
        rating: 8.5
      };

      // When - Oyunu güncelle
      const response = await axios.put(`${GAMES_API_URL}/${gameId}`, updateData);

      // Then - Güncellenmiş oyun döndürülmeli
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: updateData.title,
          genre: updateData.genre,
          rating: updateData.rating
        }
      });

      // Then - Güncellemenin kalıcı olduğunu mongoHelper ile doğrula
      const dbGameAfterUpdate = await gamesDB.findGameById(gameId);
      expect(dbGameAfterUpdate).toMatchObject({
        title: updateData.title,
        genre: updateData.genre
      });
    });

    test('should return 404 for non-existent game ID', async () => {
      // Given - Geçerli ama mevcut olmayan ObjectId ve güncelleme verisi
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';
      const updateData = { title: 'Updated Game', genre: 'Strategy', status: 'Oynandı' };

      // When & Then - API çağrısı 404 döndürmeli
      await expect(axios.put(`${GAMES_API_URL}/${nonExistentId}`, updateData)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid update data', async () => {
      // Given - Direkt MongoDB ile geçerli oyun ekle ve geçersiz güncelleme verisi (API kullanmadan)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();
      
      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbGame = await gamesDB.findGameById(gameId);
      expect(dbGame.title).toBe(testGames[0].title);
      
      const invalidUpdateData = { title: '', genre: 'RPG', status: 'Oynandı' }; // Boş title

      // When & Then - API çağrısı 400 döndürmeli ve spesifik hata mesajı
      await expect(axios.put(`${GAMES_API_URL}/${gameId}`, invalidUpdateData)).rejects.toMatchObject({
        response: {
          status: 400,
          data: {
            message: 'Title is required and cannot be empty.'
          }
        }
      });
    });
  });

  describe('Games API - DELETE /api/games/:id', () => {
    test('should delete an existing game', async () => {
      // Given - Veritabanına direkt MongoDB ile test oyunu ekle (API kullanmadan)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();

      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbGame = await gamesDB.findGameById(gameId);
      expect(dbGame.title).toBe(testGames[0].title);

      // When - Oyunu sil
      const response = await axios.delete(`${GAMES_API_URL}/${gameId}`);

      // Then - Başarılı silme response'u
      expect(response).toMatchObject({
        status: 200,
        data: {
          message: 'Game deleted successfully'
        }
      });

      // Then - Oyunun silindiğini mongoHelper ile doğrula
      const deletedGame = await gamesDB.findGameById(gameId);
      expect(deletedGame).toBeNull();
    });

    test('should return 404 for non-existent game ID', async () => {
      // Given - Geçerli ama mevcut olmayan ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API çağrısı 404 döndürmeli
      await expect(axios.delete(`${GAMES_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid game ID format', async () => {
      // Given - Geçersiz ObjectId formatı
      const invalidId = 'invalid-game-id-format';

      // When & Then - API çağrısı 400 döndürmeli
      await expect(axios.delete(`${GAMES_API_URL}/${invalidId}`)).rejects.toMatchObject({
        response: {
          status: 400
        }
      });
    });
  });
});
