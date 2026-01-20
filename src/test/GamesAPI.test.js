import axios from 'axios';
// MongoDB Helper - for direct database operations
const { gamesDB, closeDB } = require('./helpers/mongoHelper.js');

// API URL
const GAMES_API_URL = 'http://localhost:5000/api/games';

// Test data
const testGames = [
  {
    title: 'Test Game 1',
    genre: 'RPG',
    status: 'Played',
    rating: 9.0,
    platform: 'PC',
    image: 'test-game-1.jpg'
  },
  {
    title: 'Test Game 2',
    genre: 'Action',
    status: 'To Play',
    rating: 0,
    platform: 'PS5',
    image: 'test-game-2.jpg'
  }
];

describe('Games API Integration Tests', () => {
  beforeEach(async () => {
    // Clean up test data before each test (direct MongoDB)
    await gamesDB.cleanupTestGames();
  });

  afterAll(async () => {
    // Clean up test data after all tests and close DB connection
  await gamesDB.cleanupTestGames();
  await closeDB();
  });

  describe('Games API - POST /api/games', () => {
    test('should create a new game with valid data', async () => {
      // Given - Valid test game data
      const gameData = testGames[0];

      // When - Call the real API
      const response = await axios.post(GAMES_API_URL, gameData);

      // Then - Check the real response
      expect(response).toMatchObject({
        status: 201,
        data: {
          title: gameData.title,
          genre: gameData.genre,
          platform: gameData.platform
        }
      });
      expect(response.data).toHaveProperty('_id');

      // Then - Verify the game was actually added to the database using mongoHelper
      await expect(gamesDB.findGameById(response.data._id.toString())).resolves.toMatchObject({title: gameData.title});
    });

    test('should return 400 for game data without required fields', async () => {
      // Given - Game data without required title field
      const incompleteGame = {
        genre: 'RPG',
        platform: 'PC',
        status: 'Played'
      };

      // When & Then - API call should fail (title missing)
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
      // Given - Game data without genre field
      const incompleteGame = {
        title: 'Test Game',
        platform: 'PC',
        status: 'Played'
      };

      // When & Then - API call should fail (genre missing)
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
      // Given - Game data without status field
      const incompleteGame = {
        title: 'Test Game',
        genre: 'RPG',
        platform: 'PC'
      };

      // When & Then - API call should fail (status missing)
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
      // Given - Add test data directly with MongoDB (without API)
      const savedGame1 = await gamesDB.insertGame(testGames[0]);
      const savedGame2 = await gamesDB.insertGame(testGames[1]);

      // Given - Verify data was actually added
      const dbGame1 = await gamesDB.findGameById(savedGame1._id.toString());
      const dbGame2 = await gamesDB.findGameById(savedGame2._id.toString());
      expect(dbGame1.title).toBe(testGames[0].title);
      expect(dbGame2.title).toBe(testGames[1].title);

      // When - Call the real API
      const response = await axios.get(GAMES_API_URL);

      // Then - Verify test games exist
      expect(response.status).toBe(200);
      const testGameTitles = response.data.map(game => game.title);
      testGames.forEach(testGame => {
        expect(testGameTitles).toContain(testGame.title);
      });
    });

    test('should return games array even when no test games exist', async () => {
      // When - Call the API
      const response = await axios.get(GAMES_API_URL);

      // Then - Array should be returned (may include non-test games)
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Then - Verify test games don't exist
      const gameTitles = response.data.map(game => game.title);
      expect(gameTitles).not.toContain(testGames[0].title);
      expect(gameTitles).not.toContain(testGames[1].title);
    });
  });

  describe('Games API - GET /api/games/:id', () => {
    test('should return a single game by ID', async () => {
      // Given - Add test game directly with MongoDB (without API)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();
      
      // Given - Verify data was actually added
      const dbGame = await gamesDB.findGameById(gameId);
      expect(dbGame.title).toBe(testGames[0].title);
      
      // When - Get specific game by ID
      const response = await axios.get(`${GAMES_API_URL}/${gameId}`);

      // Then - Correct game should be returned
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
      // Given - Valid but non-existent ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API call should return 404
      await expect(axios.get(`${GAMES_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid ID format', async () => {
      // Given - Invalid ObjectId format
      const invalidId = 'invalid-game-id';

      // When & Then - API call should return 400
      await expect(axios.get(`${GAMES_API_URL}/${invalidId}`)).rejects.toMatchObject({response: {status: 400}});
    });
  });

  describe('Games API - PUT /api/games/:id', () => {
    test('should update an existing game', async () => {
      // Given - Add test game directly with MongoDB (without API)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();

      // Given - Verify data was actually added
      const dbGame = await gamesDB.findGameById(gameId);
      expect(dbGame.title).toBe(testGames[0].title);
      expect(dbGame.genre).toBe(testGames[0].genre);

      const updateData = {
        title: 'Updated Game',
        genre: 'Strategy',
        status: 'Played',
        rating: 8.5
      };

      // When - Update the game
      const response = await axios.put(`${GAMES_API_URL}/${gameId}`, updateData);

      // Then - Updated game should be returned
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: updateData.title,
          genre: updateData.genre,
          rating: updateData.rating
        }
      });

      // Then - Verify update is persistent using mongoHelper
      const dbGameAfterUpdate = await gamesDB.findGameById(gameId);
      expect(dbGameAfterUpdate).toMatchObject({
        title: updateData.title,
        genre: updateData.genre
      });
    });

    test('should return 404 for non-existent game ID', async () => {
      // Given - Valid but non-existent ObjectId and update data
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';
      const updateData = { title: 'Updated Game', genre: 'Strategy', status: 'Played' };

      // When & Then - API call should return 404
      await expect(axios.put(`${GAMES_API_URL}/${nonExistentId}`, updateData)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid update data', async () => {
      // Given - Add valid game directly with MongoDB and invalid update data (without API)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();
      
      // Given - Verify data was actually added
      const dbGame = await gamesDB.findGameById(gameId);
      expect(dbGame.title).toBe(testGames[0].title);
      
      const invalidUpdateData = { title: '', genre: 'RPG', status: 'Played' }; // Empty title

      // When & Then - API call should return 400 with specific error message
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
      // Given - Add test game directly with MongoDB (without API)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();

      // Given - Verify data was actually added
      const dbGame = await gamesDB.findGameById(gameId);
      expect(dbGame.title).toBe(testGames[0].title);

      // When - Delete the game
      const response = await axios.delete(`${GAMES_API_URL}/${gameId}`);

      // Then - Successful delete response
      expect(response).toMatchObject({
        status: 200,
        data: {
          message: 'Game deleted successfully'
        }
      });

      // Then - Verify game was deleted using mongoHelper
      const deletedGame = await gamesDB.findGameById(gameId);
      expect(deletedGame).toBeNull();
    });

    test('should return 404 for non-existent game ID', async () => {
      // Given - Valid but non-existent ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API call should return 404
      await expect(axios.delete(`${GAMES_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid game ID format', async () => {
      // Given - Invalid ObjectId format
      const invalidId = 'invalid-game-id-format';

      // When & Then - API call should return 400
      await expect(axios.delete(`${GAMES_API_URL}/${invalidId}`)).rejects.toMatchObject({
        response: {
          status: 400
        }
      });
    });
  });
});
