// ...existing code...
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectProvider, useProject } from '../context/ProjectContext.jsx';

// MongoDB Helper - direkt veritabanı işlemleri için
import { booksDB, closeDB } from './helpers/mongoHelper.js';

// Test run isolation id to tag and filter documents
const TEST_RUN_ID = `books-frontend-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// Simple cleanup function for React tests
const cleanupTestData = async () => {
  try {
    // Sadece bu test çalıştırmasında oluşturulan verileri temizle
    if (booksDB.cleanupBooksByTestId) {
      await booksDB.cleanupBooksByTestId(TEST_RUN_ID);
    } else {
      await booksDB.cleanupTestBooks();
    }
    console.log('Test kitapları temizlendi (MongoDB direkt)');
  } catch (error) {
    console.log('Test kitap temizleme hatası:', error.message);
  }
};

// Test verileri
const testBooks = [
  {
    title: 'Test Kitap Context 1',
    genre: 'Roman',
    status: 'Okundu',
    rating: 4.5,
    author: 'Test Yazar 1',
    image: 'test-book-1.jpg',
    testId: TEST_RUN_ID
  },
  {
    title: 'Test Kitap Context 2',
    genre: 'Bilim Kurgu',
    status: 'Okunacak',
    rating: 0,
    author: 'Test Yazar 2',
    image: 'test-book-2.jpg',
    testId: TEST_RUN_ID
  }
];

// Test bileşeni
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
          console.warn('Gerçek veri silinmeye çalışıldı, işlem engellendi.');
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
    // Her testten önce test verilerini temizle (direkt MongoDB ile)
    await cleanupTestData();
  });

  afterAll(async () => {
    // Test bitince test verilerini temizle
    await cleanupTestData();
    // Açık DB bağlantısını kapat
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
      // Given - Test verilerini direkt MongoDB ile ekle (API kullanmadan)
      const savedBook = await booksDB.insertBook(testBooks[0]);

      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbBook = await booksDB.findBookById(savedBook._id.toString());
      expect(dbBook.title).toBe(testBooks[0].title);

      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
        // Sadece bu test run'a ait verileri sayıyoruz (tam olarak 1 olmalı)
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });
    });
  });

  describe('Add Book Project', () => {
    test('should add a new book project successfully', async () => {
      // Given - Başlangıçta kitap sayısını al
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

      // When - Kitap ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Kitap sayısı artmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(initialCount + 1);
    });

    test('should prevent duplicate book addition', async () => {
      // Given - Aynı başlıkta kitap zaten ekli
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

      // When - Tekrar aynı kitap eklenmeye çalışılır
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Duplicate uyarısı gösterilmeli ve sayı değişmemeli
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(window.alert).toHaveBeenCalledWith('Duplicate!');
      expect(finalCount).toBe(initialCount);
    });

    test('should handle add book with invalid data - empty title', async () => {
      // Given - Geçersiz veri (boş title)
      const invalidData = { title: '', genre: 'Roman', status: 'Okundu', author: 'Test Yazar' };
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

      // When - Boş başlıkla kitap eklenmeye çalışılır
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Kitap eklenmemeli ve hata loglanmalı
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
      // Given - Geçersiz veri (boş genre)
      const invalidData = { title: 'Test Title', genre: '', status: 'Okundu', author: 'Test Yazar' };
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

      // When - Boş genre ile kitap eklenmeye çalışılır
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Kitap eklenmemeli ve hata loglanmalı
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
      // Given - Geçersiz veri (boş status)
      const invalidData = { title: 'Test Title', genre: 'Roman', status: '', author: 'Test Yazar' };
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

      // When - Boş status ile kitap eklenmeye çalışılır
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Kitap eklenmemeli ve hata loglanmalı
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
      // Given - Mevcut kitabı direkt MongoDB ile ekle (API kullanmadan)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();

      // When - Güncelleme işlemi için bileşeni render et
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Gerçek DB'de mevcut veriler olabileceğı için en az 1 olduğunu kontrol et
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
        expect(screen.getByTestId(`project-${bookId}`)).toHaveTextContent(testBooks[0].title);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Kitap güncellenmiş olmalı
      await waitFor(() => {
        expect(screen.getByTestId(`project-${bookId}`)).toHaveTextContent('Updated Project');
      });
    });


    test('should handle update with invalid data - empty title', async () => {
      // Given - Mevcut kitabı direkt MongoDB ile ekle ve geçersiz güncelleme verisi
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      const invalidUpdateData = { title: '', genre: 'Updated Genre', status: 'Updated Status', author: 'Updated Author' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      // When - Bileşeni geçersiz güncelleme verisiyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Sadece bu test run'ındaki veriler olduğundan tam 1 olmalı
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Hata loglanmalı ve kitap güncellenmemeli
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
      // Given - Mevcut kitabı direkt MongoDB ile ekle ve geçersiz güncelleme verisi
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      const invalidUpdateData = { title: 'Updated Title', genre: '', status: 'Updated Status', author: 'Updated Author' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      // When - Bileşeni geçersiz güncelleme verisiyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Hata loglanmalı ve kitap güncellenmemeli
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
      // Given - Mevcut kitabı direkt MongoDB ile ekle ve geçersiz güncelleme verisi
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      const invalidUpdateData = { title: 'Updated Title', genre: 'Updated Genre', status: '', author: 'Updated Author' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      // When - Bileşeni geçersiz güncelleme verisiyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Hata loglanmalı ve kitap güncellenmemeli
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
      // Given - Mevcut kitabı direkt MongoDB ile ekle (API kullanmadan)
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();

      // When - Silme işlemi için bileşeni render et
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

      // When - Sil butonuna tıkla
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Kitap silinmiş olmalı
      await waitFor(() => {
        expect(screen.queryByTestId(`project-${bookId}`)).not.toBeInTheDocument();
      });

      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(initialCount - 1);
    });

    test('should handle delete book error - non-existent book', async () => {
      // Given - Mevcut kitabı direkt MongoDB ile ekle
      const savedBook = await booksDB.insertBook(testBooks[0]);
      const bookId = savedBook._id.toString();
      // When - Bileşeni render et
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(parseInt(screen.getByTestId('books-count').textContent)).toBe(1);
      });
      const initialCount = parseInt(screen.getByTestId('books-count').textContent);

      // When - Kitabı doğrudan DB'den sil
      await booksDB.deleteBook(bookId);

      // When - Sil butonuna tıkla
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Kitap sayısı değişmemeli
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(initialCount);
    });

    test('should handle delete with no books available', async () => {
      // Given - Hiç kitap yokken
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('books-count').textContent);

      // When - Sil butonuna tıkla
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Kitap sayısı değişmemeli
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('books-count').textContent);
      expect(finalCount).toBe(initialCount);
    });
  });
});
