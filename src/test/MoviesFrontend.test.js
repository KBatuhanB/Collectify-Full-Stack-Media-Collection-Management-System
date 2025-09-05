// ...existing code...
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectProvider, useProject } from '../context/ProjectContext.jsx';

// MongoDB Helper - direkt veritabanı işlemleri için
import { moviesDB, cleanupAllTestData, closeDB } from './helpers/mongoHelper.js';

// Test run isolation id
const TEST_RUN_ID = `movies-frontend-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

// Simple cleanup function for React tests
const cleanupTestData = async () => {
  try {
    if (moviesDB.cleanupMoviesByTestId) {
      await moviesDB.cleanupMoviesByTestId(TEST_RUN_ID);
    } else {
      await moviesDB.cleanupTestMovies();
    }
    console.log('Test filmleri temizlendi (MongoDB direkt)');
  } catch (error) {
    console.log('Test film temizleme hatası:', error.message);
  }
};

// Test verileri
const testMovies = [
  {
    title: 'Test Film Context 1',
    genre: 'Aksiyon',
    status: 'İzlendi',
    rating: 4.5,
    director: 'Test Yönetmen 1',
  image: 'test-movie-1.jpg',
  testId: TEST_RUN_ID
  },
  {
    title: 'Test Film Context 2',
    genre: 'Komedi',
    status: 'İzlenecek',
    rating: 0,
    director: 'Test Yönetmen 2',
  image: 'test-movie-2.jpg',
  testId: TEST_RUN_ID
  }
];

// Test bileşeni
function TestComponent({ testData = null }) {
  const {
    movies,
    loading,
    addProject,
    updateProject,
    deleteProject,
    getProjectsByType,
    isDuplicateTitle
  } = useProject();

  const projects = getProjectsByType('movie');
  const testProjects = projects.filter(p => p.testId === TEST_RUN_ID);

  const handleAdd = async () => {
    try {
  const data = { ...(testData || testMovies[0]), testId: TEST_RUN_ID };
      if (isDuplicateTitle(data.title, 'movie')) {
        window.alert('Duplicate!');
        return;
      }
      await addProject(data, 'movie');
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
        director: 'Updated Director',
        testId: TEST_RUN_ID
      };
      if (testProjects.length > 0) {
        await updateProject(testProjects[0]._id, updateData, 'movie');
      }
    } catch (error) {
      // Error handled in context
    }
  };

  const handleDelete = async () => {
    try {
      if (testProjects.length > 0) {
        const projectToDelete = testProjects[0];
        if (projectToDelete && projectToDelete.testId === TEST_RUN_ID) {
          await deleteProject(projectToDelete._id, 'movie');
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
  <div data-testid="movies-count">{testProjects.length}</div>
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

describe('ProjectContext Movies Integration Tests', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
  await cleanupTestData();
  await closeDB();
  });

  describe('Context Provider', () => {
    test('should throw error when used outside provider', () => {
      // Given - Context provider dışında bir bileşen
      const TestWithoutProvider = () => {
        useProject();
        return <div>Test</div>;
      };

      // When - Bileşeni render et
      // Then - Hata fırlatılmalı
      expect(() => {
        render(<TestWithoutProvider />);
      }).toThrow('useProject must be used within a ProjectProvider');
    });
  });

  describe('Initial Data Fetching', () => {
    test('should load movies on mount', async () => {
      // Given - Test verilerini direkt MongoDB ile ekle (API kullanmadan)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);

      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbMovie = await moviesDB.findMovieById(savedMovie._id.toString());
      expect(dbMovie.title).toBe(testMovies[0].title);

      // When - Bileşeni render et
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      // Then - Filmler yüklenmiş olmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
        // Sadece bu test run'a ait verileri sayıyoruz (tam olarak 1 olmalı)
        expect(parseInt(screen.getByTestId('movies-count').textContent)).toBe(1);
      });
    });
  });

  describe('Add Movie Project', () => {
    test('should add a new movie project successfully', async () => {
      // Given - Başlangıçta film sayısını al
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('movies-count').textContent);
  expect(initialCount).toBe(0);

      // When - Film ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Film sayısı artmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('movies-count').textContent);
  expect(finalCount).toBe(initialCount + 1);
    });

    test('should prevent duplicate movie addition', async () => {
      // Given - Mevcut filmi direkt MongoDB ile ekle (API kullanmadan)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      window.alert = jest.fn();

      // When - Aynı film tekrar eklenmeye çalışılır
      render(
        <ProjectProvider>
          <TestComponent testData={testMovies[0]} />
        </ProjectProvider>
      );

      await waitFor(() => {
  expect(parseInt(screen.getByTestId('movies-count').textContent)).toBe(1);
      });
      const initialCount = parseInt(screen.getByTestId('movies-count').textContent);

      // When - Ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Duplicate uyarısı gösterilmeli ve sayı değişmemeli
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('movies-count').textContent);
      expect(window.alert).toHaveBeenCalledWith('Duplicate!');
      expect(finalCount).toBe(initialCount);
    });

    test('should handle add movie with invalid data - empty title', async () => {
      // Given - Geçersiz veri (boş title)
      const invalidData = { title: '', genre: 'Aksiyon', status: 'İzlendi', director: 'Test Yönetmen' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When - Bileşeni geçersiz veriyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('movies-count').textContent);
  expect(initialCount).toBe(0);

      // When - Ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Film eklenmemeli ve hata loglanmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('movies-count').textContent);
  expect(finalCount).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error adding movie:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });

    test('should handle add movie with missing genre', async () => {
      // Given - Geçersiz veri (boş genre)
      const invalidData = { title: 'Test Title', genre: '', status: 'İzlendi', director: 'Test Yönetmen' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When - Bileşeni geçersiz veriyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('movies-count').textContent);
  expect(initialCount).toBe(0);

      // When - Ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Film eklenmemeli ve hata loglanmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('movies-count').textContent);
  expect(finalCount).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error adding movie:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });

    test('should handle add movie with missing status', async () => {
      // Given - Geçersiz veri (boş status)
      const invalidData = { title: 'Test Title', genre: 'Aksiyon', status: '', director: 'Test Yönetmen' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When - Bileşeni geçersiz veriyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('movies-count').textContent);
  expect(initialCount).toBe(0);

      // When - Ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Film eklenmemeli ve hata loglanmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('movies-count').textContent);
  expect(finalCount).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error adding movie:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Update Movie Project', () => {
    test('should update existing movie successfully', async () => {
      // Given - Mevcut filmi direkt MongoDB ile ekle (API kullanmadan)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();

      // When - Güncelleme işlemi için bileşeni render et
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
  // Sadece bu test run'ındaki veriler olduğundan tam 1 olmalı
  expect(parseInt(screen.getByTestId('movies-count').textContent)).toBe(1);
        expect(screen.getByTestId(`project-${movieId}`)).toHaveTextContent(testMovies[0].title);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Film güncellenmiş olmalı
      await waitFor(() => {
        expect(screen.getByTestId(`project-${movieId}`)).toHaveTextContent('Updated Project');
      });
    });


    test('should handle update with invalid data - empty title', async () => {
      // Given - Mevcut filmi direkt MongoDB ile ekle ve geçersiz güncelleme verisi
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();
      const invalidUpdateData = { title: '', genre: 'Updated Genre', status: 'Updated Status', director: 'Updated Director' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When - Bileşeni geçersiz güncelleme verisiyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
  expect(parseInt(screen.getByTestId('movies-count').textContent)).toBe(1);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Hata loglanmalı ve film güncellenmemeli
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error updating movie:',
          expect.any(Error)
        );
        expect(screen.getByTestId(`project-${movieId}`)).toHaveTextContent(testMovies[0].title);
      });

      consoleErrorSpy.mockRestore();
    });

    test('should handle update with invalid data - empty genre', async () => {
      // Given - Mevcut filmi direkt MongoDB ile ekle ve geçersiz güncelleme verisi
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();
      const invalidUpdateData = { title: 'Updated Title', genre: '', status: 'Updated Status', director: 'Updated Director' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When - Bileşeni geçersiz güncelleme verisiyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
  expect(parseInt(screen.getByTestId('movies-count').textContent)).toBe(1);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Hata loglanmalı ve film güncellenmemeli
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error updating movie:',
          expect.any(Error)
        );
        expect(screen.getByTestId(`project-${movieId}`)).toHaveTextContent(testMovies[0].title);
      });

      consoleErrorSpy.mockRestore();
    });

    test('should handle update with invalid data - empty status', async () => {
      // Given - Mevcut filmi direkt MongoDB ile ekle ve geçersiz güncelleme verisi
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();
      const invalidUpdateData = { title: 'Updated Title', genre: 'Updated Genre', status: '', director: 'Updated Director' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When - Bileşeni geçersiz güncelleme verisiyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
  expect(parseInt(screen.getByTestId('movies-count').textContent)).toBe(1);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Hata loglanmalı ve film güncellenmemeli
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error updating movie:',
          expect.any(Error)
        );
        expect(screen.getByTestId(`project-${movieId}`)).toHaveTextContent(testMovies[0].title);
      });

      consoleErrorSpy.mockRestore();
    });

});

  describe('Delete Movie Project', () => {
    test('should delete existing movie successfully', async () => {
      // Given - Mevcut filmi direkt MongoDB ile ekle (API kullanmadan)
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();

      // When - Silme işlemi için bileşeni render et
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
  expect(parseInt(screen.getByTestId('movies-count').textContent)).toBe(1);
        expect(screen.getByTestId(`project-${movieId}`)).toHaveTextContent(testMovies[0].title);
      });

      // When - Silme işlemi öncesi test filmlerinin sayısını al
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('movies-count').textContent);

      // When - Sil butonuna tıkla
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Silinen filmin DOM'dan kaybolmasını bekle
      await waitFor(() => {
        expect(screen.queryByTestId(`project-${movieId}`)).not.toBeInTheDocument();
      });

      // Then - Film sayısı azalmış olmalı
      const finalCount = parseInt(screen.getByTestId('movies-count').textContent);
  expect(finalCount).toBe(initialCount - 1);
    });

    test('should handle delete movie error - non-existent movie', async () => {
      // Given - Mevcut filmi direkt MongoDB ile ekle sonra sil
      const savedMovie = await moviesDB.insertMovie(testMovies[0]);
      const movieId = savedMovie._id.toString();
      // Not: consoleErrorSpy ile hata logunu kontrol edebilirsin, ancak context'te garanti edilmiyorsa kaldırılabilir

      // When - Bileşeni render et
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(parseInt(screen.getByTestId('movies-count').textContent)).toBe(1);
      });
      const initialCount = parseInt(screen.getByTestId('movies-count').textContent);

      // When - Filmi önceden direkt MongoDB ile sil ki hata alsın
      await moviesDB.deleteMovie(movieId);

      // When - Sil butonuna tıkla
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Film sayısı değişmemeli
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('movies-count').textContent);
      expect(finalCount).toBe(initialCount);
    });

    test('should handle delete with no movies available', async () => {
      // Given - Boş liste (gerçek DB'de başka veriler olabilir ama test verileri yok)
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      // When - Sayfa yüklenmesini bekle ve initialCount'u al
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('movies-count').textContent);

      // When - Test verileri yoksa silme işlemi hata vermemeli, sil butonuna tıkla
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Tekrar yüklenmesini bekle ve son count'u al
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('movies-count').textContent);
      expect(finalCount).toBe(initialCount);
    });
  });
});
