import axios from 'axios';

// MongoDB Helper - for direct database operations
const { moviesDB, cleanupAllTestData, closeDB } = require('./helpers/mongoHelper.js');

// API URL
const MOVIES_API_URL = 'http://localhost:5000/api/movies';

// Test data
const testMovies = [
  {
    title: 'Test Movie 1',
    genre: 'Action',
    status: 'Watched',
    rating: 8.5,
    releaseYear: 2023,
    image: 'test-image-1.jpg'
  },
  {
    title: 'Test Movie 2', 
    genre: 'Drama',
    status: 'To Watch',
    rating: 0,
    releaseYear: 2024,
    image: 'test-image-2.jpg'
  }
];

describe('Movies API Integration Tests', () => {
  beforeEach(async () => {
    // Clean up test data before each test (direct MongoDB)  
    await moviesDB.cleanupTestMovies();
  });
  afterAll(async () => {
    // Clean up test data after all tests and close DB connection
    await moviesDB.cleanupTestMovies();
    await closeDB();
  });

  describe('Movies API - POST /api/movies', () => {
    test('should create a new movie with valid data', async () => {   
      // Given - Valid test movie data
      const movieData = testMovies[0];

      // When - Call the real API
      const response = await axios.post(MOVIES_API_URL, movieData);

      // Then - Check the real response
      expect(response).toMatchObject({
        status: 201,
        data: {
          title: movieData.title,
          genre: movieData.genre
        }
      });
      expect(response.data).toHaveProperty('_id');

      // Then - Verify the movie was actually added to the database using mongoHelper
      await expect(moviesDB.findMovieById(response.data._id.toString())).resolves.toMatchObject({title: movieData.title});
    });

    test('should return 400 for movie data without required fields', async () => {
      // Given - Movie data without required title field
      const incompleteMovie = {
        genre: 'Action',
        status: 'To Watch'
      };

      // When & Then - API call should fail (title missing)
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
      // Given - Movie data without genre field
      const incompleteMovie = {
        title: 'Test Movie',
        status: 'Watched'
      };

      // When & Then - API call should fail (genre missing)
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
      // Given - Movie data without status field
      const incompleteMovie = {
        title: 'Test Movie',
        genre: 'Action'
      };

      // When & Then - API call should fail (status missing)
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
      // Given - Add test data directly with MongoDB (without API)
      const savedMovie1 = await moviesDB.insertMovie(testMovies[0]);
      const savedMovie2 = await moviesDB.insertMovie(testMovies[1]);

      // Given - Verify data was actually added
      const dbMovie1 = await moviesDB.findMovieById(savedMovie1._id.toString());
      const dbMovie2 = await moviesDB.findMovieById(savedMovie2._id.toString());
      expect(dbMovie1.title).toBe(testMovies[0].title);
      expect(dbMovie2.title).toBe(testMovies[1].title);

      // When - Call the real API
      const response = await axios.get(MOVIES_API_URL);

      // Then - Verify test movies exist
      expect(response.status).toBe(200);
      const testMovieTitles = response.data.map(movie => movie.title);
      testMovies.forEach(testMovie => {
        expect(testMovieTitles).toContain(testMovie.title);
      });
    });

    test('should return movies array even when no test movies exist', async () => {
      // Given - Clean up previous test data for this test
      await cleanupAllTestData();
      
      // When - Call the API
      const response = await axios.get(MOVIES_API_URL);

      // Then - Array should be returned (may include non-test movies)
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      
      // Then - Verify test movies don't exist
      const movieTitles = response.data.map(movie => movie.title);
      expect(movieTitles).not.toContain(testMovies[0].title);
      expect(movieTitles).not.toContain(testMovies[1].title);
    });
  });

  describe('Movies API - GET /api/movies/:id', () => {
    test('should return a single movie by ID', async () => {
      // Given - Add test movie directly with MongoDB (without API)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();
      
      // Given - Verify data was actually added
      const dbMovie = await moviesDB.findMovieById(movieId);
      expect(dbMovie.title).toBe(testMovies[0].title);
      
      // When - Get specific movie by ID
      const response = await axios.get(`${MOVIES_API_URL}/${movieId}`);

      // Then - Correct movie should be returned
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
      // Given - Valid but non-existent ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API call should return 404
      await expect(axios.get(`${MOVIES_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid ID format', async () => {
      // Given - Invalid ObjectId format
      const invalidId = 'invalid-id';

      // When & Then - API call should return 400
      await expect(axios.get(`${MOVIES_API_URL}/${invalidId}`)).rejects.toMatchObject({response: {status: 400}});
    });
  });

  describe('Movies API - PUT /api/movies/:id', () => {
    test('should update an existing movie', async () => {
      // Given - Add test movie directly with MongoDB (without API)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();

      // Given - Verify data was actually added
      const dbMovie = await moviesDB.findMovieById(movieId);
      expect(dbMovie.title).toBe(testMovies[0].title);
      expect(dbMovie.genre).toBe(testMovies[0].genre);

      const updateData = {
        title: 'Updated Movie',
        genre: 'Comedy',
        status: 'Watched',
        rating: 9.0
      };

      // When - Update the movie
      const response = await axios.put(`${MOVIES_API_URL}/${movieId}`, updateData);

      // Then - Updated movie should be returned
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: updateData.title,
          genre: updateData.genre,
          rating: updateData.rating
        }
      });

      // Then - Verify update is persistent using mongoHelper
      const dbMovieAfterUpdate = await moviesDB.findMovieById(movieId);
      expect(dbMovieAfterUpdate).toMatchObject({
        title: updateData.title,
        genre: updateData.genre
      });
    });

    test('should return 404 for non-existent movie ID', async () => {
      // Given - Valid but non-existent ObjectId and update data
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';
      const updateData = { title: 'Updated Movie', genre: 'Comedy', status: 'Watched' };

      // When & Then - API call should return 404
      await expect(axios.put(`${MOVIES_API_URL}/${nonExistentId}`, updateData)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid update data', async () => {
      // Given - Add valid movie directly with MongoDB and invalid update data (without API)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();
      
      // Given - Verify data was actually added
      const dbMovie = await moviesDB.findMovieById(movieId);
      expect(dbMovie.title).toBe(testMovies[0].title);
      
      const invalidUpdateData = { title: '', genre: 'Action', status: 'Watched' }; // Empty title

      // When & Then - API call should return 400 with specific error message
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
      // Given - Add test movie directly with MongoDB (without API)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();

      // Given - Verify data was actually added
      const dbMovie = await moviesDB.findMovieById(movieId);
      expect(dbMovie.title).toBe(testMovies[0].title);

      // When - Delete the movie
      const response = await axios.delete(`${MOVIES_API_URL}/${movieId}`);

      // Then - Successful delete response
      expect(response).toMatchObject({
        status: 200,
        data: {
          message: 'Movie deleted successfully'
        }
      });

      // Then - Verify movie was deleted using mongoHelper
      const deletedMovie = await moviesDB.findMovieById(movieId);
      expect(deletedMovie).toBeNull();
    });

    test('should return 404 for non-existent movie ID', async () => {
      // Given - Valid but non-existent ObjectId
      const nonExistentId = '64a7b8c9d0e1f2a3b4c5d6e7';

      // When & Then - API call should return 404
      await expect(axios.delete(`${MOVIES_API_URL}/${nonExistentId}`)).rejects.toMatchObject({response: {status: 404}});
    });

    test('should return 400 for invalid movie ID format', async () => {
      // Given - Invalid ObjectId format
      const invalidId = 'invalid-id-format';

      // When & Then - API call should return 400
      await expect(axios.delete(`${MOVIES_API_URL}/${invalidId}`)).rejects.toMatchObject({
        response: {
          status: 400
        }
      });
    });
  });
});
