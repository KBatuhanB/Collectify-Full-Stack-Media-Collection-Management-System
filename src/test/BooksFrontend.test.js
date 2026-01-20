// ...existing code...
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectProvider, useProject } from '../context/ProjectContext.jsx';

// MongoDB Helper - for direct database operations
import { booksDB, closeDB } from './helpers/mongoHelper.js';

// Test run isolation id to tag and filter documents
const TEST_RUN_ID = `books-frontend-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// Simple cleanup function for React tests
const cleanupTestData = async () => {
  try {
    // Only clean up data created in this test run
    if (booksDB.cleanupBooksByTestId) {
      await booksDB.cleanupBooksByTestId(TEST_RUN_ID);
    } else {
      await booksDB.cleanupTestBooks();
    }
    console.log('Test books cleaned up (MongoDB direct)');
  } catch (error) {
    console.log('Test book cleanup error:', error.message);
  }
};

// Test data
const testBooks = [
  {
    title: 'Test Book Context 1',
    genre: 'Fiction',
    status: 'Read',
    rating: 4.5,
    author: 'Test Author 1',
    image: 'test-book-1.jpg',
    testId: TEST_RUN_ID
  },
  {
    title: 'Test Book Context 2',
    genre: 'Sci-Fi',
    status: 'To Read',
    rating: 0,
    author: 'Test Author 2',
    image: 'test-book-2.jpg',
    testId: TEST_RUN_ID
  }
];

// Test component
function TestComponent({ testData = null }) {
  const {
    books,
    loading,
    addProject,
    updateProject,
    deleteProject,
    getProjectsByType,
    isDuplicateTitle
  } = useProject();

  const projects = getProjectsByType('book');
  // Sadece bu test çalıştırmasına ait verileri göster
  const testProjects = projects.filter(p => p.testId === TEST_RUN_ID);

  const handleAdd = async () => {
    try {
      const data = { ...(testData || testBooks[0]), testId: TEST_RUN_ID };

      if (isDuplicateTitle(data.title, 'book')) {
        window.alert('Duplicate!');
        return;
      }
      await addProject(data, 'book');
    } catch (error) {
      // Error handled in context
    }
  };

  const handleUpdate = async () => {
    try {
      const updateData = (testData && { ...testData, testId: TEST_RUN_ID }) || {
        title: 'Updated Project',
        genre: 'Updated Genre',
        status: 'Updated Status',
        author: 'Updated Author',
        testId: TEST_RUN_ID
      };
      if (testProjects.length > 0) {
        await updateProject(testProjects[0]._id, updateData, 'book');
      }
    } catch (error) {
      // Error handled in context
    }
  };

  const handleDelete = async () => {
    try {
      if (testProjects.length > 0) {
        // Sadece bu test kapsamındaki kitabı sil
        const projectToDelete = testProjects[0];
        if (projectToDelete && projectToDelete.testId === TEST_RUN_ID) {
          await deleteProject(projectToDelete._id, 'book');
        } else if (projectToDelete) {
          console.warn('Attempted to delete real data, operation blocked.');
        }
      }
    } catch (error) {
      // Error handled in context
    }
  };

  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="books-count">{testProjects.length}</div>
      <div data-testid="projects-count">{testProjects.length}</div>
      <button data-testid="add-project" onClick={handleAdd}>Add Project</button>
      <button data-testid="update-project" onClick={handleUpdate}>Update Project</button>
      <button data-testid="delete-project" onClick={handleDelete}>Delete Project</button>
      {testProjects.map(project => (
        <div key={project._id} data-testid={`project-${project._id}`}>
          {project.title}
        </div>
      ))}
    </div>
  );
}

describe('ProjectContext Books Integration Tests', () => {
  beforeEach(async () => {
    // Clean up test data before each test (direct MongoDB)
    await cleanupTestData();
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await cleanupTestData();
    // Close open DB connection
    await closeDB();
  });

  describe('Context Provider', () => {
    test('should throw error when used outside provider', () => {
      const TestWithoutProvider = () => {
        useProject();
        return <div>Test</div>;
      };

      expect(() => {
        render(<TestWithoutProvider />);
      }).toThrow('useProject must be used within a ProjectProvider');
    });
  });

  describe('Initial Data Fetching', () => {
    test('should load books on mount', async () => {
      // Given - Add test data directly with MongoDB (without API)
      const savedBook = await booksDB.insertBook(testBooks[0]);

      // Given - Verify data was actually added
      const dbBook = await booksDB.findBookById(savedBook._id.toString());
      expect(dbBook.title).toBe(testBooks[0].title);

      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
        // Only counting data from this test run (should be exactly 1)
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });
    });
  });

  describe('Add Book Project', () => {
    test('should add a new book project successfully', async () => {
      // Given - Get initial book count
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(initialCount).toBe(0);

      // When - Click add book button
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Book count should increase
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(initialCount + 1);
    });

    test('should prevent duplicate book addition', async () => {
      // Given - Book with same title already exists
      const savedBook = await booksDB.insertBook(testBooks[0]);
      window.alert = jest.fn();

      render(
        <ProjectProvider>
          <TestComponent testData={testBooks[0]} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });
      const initialCount = parseInt(screen.getByTestId('books-count').textContent);

      // When - Try to add the same book again
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Duplicate warning should be shown and count should not change
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(window.alert).toHaveBeenCalledWith('Duplicate!');
      expect(finalCount).toBe(initialCount);
    });

    test('should handle add book with invalid data - empty title', async () => {
      // Given - Invalid data (empty title)
      const invalidData = { title: '', genre: 'Fiction', status: 'Read', author: 'Test Author' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      render(
        <ProjectProvider>
          <TestComponent testData={invalidData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(initialCount).toBe(0);

      // When - Try to add book with empty title
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Book should not be added and error should be logged
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error adding book:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });

    test('should handle add book with missing genre', async () => {
      // Given - Invalid data (empty genre)
      const invalidData = { title: 'Test Title', genre: '', status: 'Read', author: 'Test Author' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      render(
        <ProjectProvider>
          <TestComponent testData={invalidData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(initialCount).toBe(0);

      // When - Try to add book with empty genre
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Book should not be added and error should be logged
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error adding book:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });

    test('should handle add book with missing status', async () => {
      // Given - Invalid data (empty status)
      const invalidData = { title: 'Test Title', genre: 'Fiction', status: '', author: 'Test Author' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      render(
        <ProjectProvider>
          <TestComponent testData={invalidData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(initialCount).toBe(0);

      // When - Try to add book with empty status
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Book should not be added and error should be logged
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error adding book:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Update Book Project', () => {
    test('should update existing book successfully', async () => {
      // Given - Add existing book directly with MongoDB (without API)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();

      // When - Render component for update operation
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Check real DB may have existing data so at least 1
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
        expect(screen.getByTestId(`project-${bookId}`)).toHaveTextContent(testBooks[0].title);
      });

      // When - Click update button
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Book should be updated
      await waitFor(() => {
        expect(screen.getByTestId(`project-${bookId}`)).toHaveTextContent('Updated Project');
      });
    });


    test('should handle update with invalid data - empty title', async () => {
      // Given - Add existing book directly with MongoDB and invalid update data
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      const invalidUpdateData = { title: '', genre: 'Updated Genre', status: 'Updated Status', author: 'Updated Author' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      // When - Render component with invalid update data
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Only data from this test run so should be exactly 1
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });

      // When - Click update button
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Error should be logged and book should not be updated
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error updating book:',
          expect.any(Error)
        );
        expect(screen.getByTestId(`project-${bookId}`)).toHaveTextContent(testBooks[0].title);
      });

      consoleErrorSpy.mockRestore();
    });

    test('should handle update with invalid data - empty genre', async () => {
      // Given - Add existing book directly with MongoDB and invalid update data
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      const invalidUpdateData = { title: 'Updated Title', genre: '', status: 'Updated Status', author: 'Updated Author' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      // When - Render component with invalid update data
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });

      // When - Click update button
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Error should be logged and book should not be updated
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error updating book:',
          expect.any(Error)
        );
        expect(screen.getByTestId(`project-${bookId}`)).toHaveTextContent(testBooks[0].title);
      });

      consoleErrorSpy.mockRestore();
    });

    test('should handle update with invalid data - empty status', async () => {
      // Given - Add existing book directly with MongoDB and invalid update data
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      const invalidUpdateData = { title: 'Updated Title', genre: 'Updated Genre', status: '', author: 'Updated Author' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      // When - Render component with invalid update data
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });

      // When - Click update button
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Error should be logged and book should not be updated
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error updating book:',
          expect.any(Error)
        );
        expect(screen.getByTestId(`project-${bookId}`)).toHaveTextContent(testBooks[0].title);
      });

      consoleErrorSpy.mockRestore();
    });

  });

  describe('Delete Book Project', () => {
    test('should delete existing book successfully', async () => {
      // Given - Add existing book directly with MongoDB (without API)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();

      // When - Render component for delete operation
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
        expect(screen.getByTestId(`project-${bookId}`)).toHaveTextContent(testBooks[0].title);
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('books-count').textContent);

      // When - Click delete button
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Book should be deleted
      await waitFor(() => {
        expect(screen.queryByTestId(`project-${bookId}`)).not.toBeInTheDocument();
      });

      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(initialCount - 1);
    });

    test('should handle delete book error - non-existent book', async () => {
      // Given - Add existing book directly with MongoDB
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      // When - Render component
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });
      const initialCount = parseInt(screen.getByTestId('books-count').textContent);

      // When - Delete book directly from DB first
      await booksDB.deleteBook(bookId);

      // When - Click delete button
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Book count should not change
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(initialCount);
    });

    test('should handle delete with no books available', async () => {
      // Given - No books exist
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('books-count').textContent);

      // When - Click delete button
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Book count should not change
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(initialCount);
    });
  });
});
