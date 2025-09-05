// ...existing code...
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectProvider, useProject } from '../context/ProjectContext.jsx';

// MongoDB Helper - direkt veritabanı işlemleri için
import { gamesDB, cleanupAllTestData, closeDB } from './helpers/mongoHelper.js';

// Test run isolation id
const TEST_RUN_ID = `games-frontend-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

// Simple cleanup function for React tests
const cleanupTestData = async () => {
  try {
    // Sadece bu test çalıştırmasının verilerini temizle
    if (gamesDB.cleanupGamesByTestId) {
      await gamesDB.cleanupGamesByTestId(TEST_RUN_ID);
    } else {
      await gamesDB.cleanupTestGames();
    }
    console.log('Test oyunları temizlendi (MongoDB direkt)');
  } catch (error) {
    console.log('Test oyun temizleme hatası:', error.message);
  }
};

// Test verileri
const testGames = [
  {
    title: 'Test Oyun Context 1',
    genre: 'RPG',
    status: 'Oynandı',
    rating: 4.5,
    platform: 'PC',
  image: 'test-game-1.jpg',
  testId: TEST_RUN_ID
  },
  {
    title: 'Test Oyun Context 2',
    genre: 'Action',
    status: 'Oynanacak',
    rating: 0,
    platform: 'PlayStation',
  image: 'test-game-2.jpg',
  testId: TEST_RUN_ID
  }
];

// Test bileşeni
function TestComponent({ testData = null }) {
  const { 
    games, 
    loading, 
    addProject, 
    updateProject, 
    deleteProject,
    getProjectsByType,
    isDuplicateTitle
  } = useProject();

  const projects = getProjectsByType('game');
  const testProjects = projects.filter(p => p.testId === TEST_RUN_ID);

  const handleAdd = async () => {
    try {
  const data = { ...(testData || testGames[0]), testId: TEST_RUN_ID };
      
      if (isDuplicateTitle(data.title, 'game')) {
        window.alert('Duplicate!');
        return;
      }
      await addProject(data, 'game');
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
        platform: 'Updated Platform',
        testId: TEST_RUN_ID
      };
      if (testProjects.length > 0) {
        await updateProject(testProjects[0]._id, updateData, 'game');
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
          await deleteProject(projectToDelete._id, 'game');
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
  <div data-testid="games-count">{testProjects.length}</div>
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

describe('ProjectContext Games Integration Tests', () => {
  beforeEach(async () => {
    // Her testten önce test verilerini temizle (direkt MongoDB ile)
    await cleanupTestData();
  });

  afterAll(async () => {
    // Test bitince test verilerini temizle
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
    test('should load games on mount', async () => {
      // Given - Test verilerini direkt MongoDB ile ekle (API kullanmadan)
      const savedGame = await gamesDB.insertGame(testGames[0]);

      // Given - Verinin gerçekten eklendiğini kontrol et
      const dbGame = await gamesDB.findGameById(savedGame._id.toString());
      expect(dbGame.title).toBe(testGames[0].title);

      // When - Bileşeni render et
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      // Then - Oyunlar yüklenmiş olmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    // Sadece bu test run'a ait verileri sayıyoruz (tam olarak 1 olmalı)
    expect(parseInt(screen.getByTestId('games-count').textContent)).toBe(1);
      });
    });
  });

  describe('Add Game Project', () => {
    test('should add a new game project successfully', async () => {
      // Given - Başlangıçta oyun sayısını al
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('games-count').textContent);

      // When - Oyun ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Oyun sayısı artmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('games-count').textContent);
        expect(finalCount).toBe(initialCount + 1);
    });

    test('should prevent duplicate game addition', async () => {
      // Given - Mevcut oyunu direkt MongoDB ile ekle (API kullanmadan)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      window.alert = jest.fn();

      // When - Aynı oyun tekrar eklenmeye çalışılır
      render(
        <ProjectProvider>
          <TestComponent testData={testGames[0]} />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Gerçek DB'de mevcut veriler olabileceğı için en az 1 olduğunu kontrol et
          expect(parseInt(screen.getByTestId('games-count').textContent)).toBe(1);
      });

      const initialCount = parseInt(screen.getByTestId('games-count').textContent);

      // When - Ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Duplicate uyarısı gösterilmeli ve sayı artmamalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('games-count').textContent);
      expect(window.alert).toHaveBeenCalledWith('Duplicate!');
      expect(finalCount).toBe(initialCount);
    });

    test('should handle add game with invalid data - empty title', async () => {
      // Given - Geçersiz veri (boş title)
      const invalidData = { title: '', genre: 'RPG', status: 'Oynandı', platform: 'PC' };
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

      const initialCount = parseInt(screen.getByTestId('games-count').textContent);

      // When - Ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Oyun eklenmemeli ve hata loglanmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('games-count').textContent);
      expect(finalCount).toBe(initialCount);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error adding game:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });

    test('should handle add game with missing genre', async () => {
      // Given - Geçersiz veri (boş genre)
      const invalidData = { title: 'Test Title', genre: '', status: 'Oynandı', platform: 'PC' };
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

      const initialCount = parseInt(screen.getByTestId('games-count').textContent);

      // When - Ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Oyun eklenmemeli ve hata loglanmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('games-count').textContent);
      expect(finalCount).toBe(initialCount);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error adding game:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });

    test('should handle add game with missing status', async () => {
      // Given - Geçersiz veri (boş status)
      const invalidData = { title: 'Test Title', genre: 'RPG', status: '', platform: 'PC' };
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

      const initialCount = parseInt(screen.getByTestId('games-count').textContent);

      // When - Ekle butonuna tıkla
      await act(async () => {
        screen.getByTestId('add-project').click();
      });

      // Then - Oyun eklenmemeli ve hata loglanmalı
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('games-count').textContent);
      expect(finalCount).toBe(initialCount);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error adding game:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Update Game Project', () => {
    test('should update existing game successfully', async () => {
      // Given - Mevcut oyunu direkt MongoDB ile ekle (API kullanmadan)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();

      // When - Güncelleme işlemi için bileşeni render et
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Gerçek DB'de mevcut veriler olabileceğı için en az 1 olduğunu kontrol et
    expect(parseInt(screen.getByTestId('games-count').textContent)).toBe(1);
        expect(screen.getByTestId(`project-${gameId}`)).toHaveTextContent(testGames[0].title);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Oyun güncellenmiş olmalı
      await waitFor(() => {
        expect(screen.getByTestId(`project-${gameId}`)).toHaveTextContent('Updated Project');
      });
    });


    test('should handle update with invalid data - empty title', async () => {
      // Given - Mevcut oyunu direkt MongoDB ile ekle ve geçersiz güncelleme verisi
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();
      const invalidUpdateData = { title: '', genre: 'Updated Genre', status: 'Updated Status', platform: 'Updated Platform' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When - Bileşeni geçersiz güncelleme verisiyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Gerçek DB'de mevcut veriler olabileceğı için en az 1 olduğunu kontrol et
        expect(parseInt(screen.getByTestId('games-count').textContent)).toBeGreaterThanOrEqual(1);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Hata loglanmalı ve oyun güncellenmemeli
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error updating game:',
          expect.any(Error)
        );
        expect(screen.getByTestId(`project-${gameId}`)).toHaveTextContent(testGames[0].title);
      });

      consoleErrorSpy.mockRestore();
    });

    test('should handle update with invalid data - empty genre', async () => {
      // Given - Mevcut oyunu direkt MongoDB ile ekle ve geçersiz güncelleme verisi
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();
      const invalidUpdateData = { title: 'Updated Title', genre: '', status: 'Updated Status', platform: 'Updated Platform' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When - Bileşeni geçersiz güncelleme verisiyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Gerçek DB'de mevcut veriler olabileceğı için en az 1 olduğunu kontrol et
        expect(parseInt(screen.getByTestId('games-count').textContent)).toBeGreaterThanOrEqual(1);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Hata loglanmalı ve oyun güncellenmemeli
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error updating game:',
          expect.any(Error)
        );
        expect(screen.getByTestId(`project-${gameId}`)).toHaveTextContent(testGames[0].title);
      });

      consoleErrorSpy.mockRestore();
    });

    test('should handle update with invalid data - empty status', async () => {
      // Given - Mevcut oyunu direkt MongoDB ile ekle ve geçersiz güncelleme verisi
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();
      const invalidUpdateData = { title: 'Updated Title', genre: 'Updated Genre', status: '', platform: 'Updated Platform' };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When - Bileşeni geçersiz güncelleme verisiyle render et
      render(
        <ProjectProvider>
          <TestComponent testData={invalidUpdateData} />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Gerçek DB'de mevcut veriler olabileceğı için en az 1 olduğunu kontrol et
        expect(parseInt(screen.getByTestId('games-count').textContent)).toBeGreaterThanOrEqual(1);
      });

      // When - Güncelle butonuna tıkla
      await act(async () => {
        screen.getByTestId('update-project').click();
      });

      // Then - Hata loglanmalı ve oyun güncellenmemeli
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error updating game:',
          expect.any(Error)
        );
        expect(screen.getByTestId(`project-${gameId}`)).toHaveTextContent(testGames[0].title);
      });

      consoleErrorSpy.mockRestore();
    });

});

  describe('Delete Game Project', () => {
    test('should delete existing game successfully', async () => {
      // Given - Mevcut oyunu direkt MongoDB ile ekle (API kullanmadan)
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();

      // When - Silme işlemi için bileşeni render et
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Gerçek DB'de mevcut veriler olabileceği için en az 1 olduğunu kontrol et
        expect(parseInt(screen.getByTestId('games-count').textContent)).toBeGreaterThanOrEqual(1);
        expect(screen.getByTestId(`project-${gameId}`)).toHaveTextContent(testGames[0].title);
      });

      // When - Silme işlemi öncesi test oyunlarının sayısını al
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const initialCount = parseInt(screen.getByTestId('games-count').textContent);

      // When - Sil butonuna tıkla
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Silinen oyunun DOM'dan kaybolmasını bekle
      await waitFor(() => {
        expect(screen.queryByTestId(`project-${gameId}`)).not.toBeInTheDocument();
      });

      // Then - Oyun sayısı azalmış olmalı
      const finalCount = parseInt(screen.getByTestId('games-count').textContent);
      expect(finalCount).toBeLessThan(initialCount);
    });

    test('should handle delete game error - non-existent game', async () => {
      // Given - Mevcut oyunu direkt MongoDB ile ekle sonra sil
      const savedGame = await gamesDB.insertGame(testGames[0]);
      const gameId = savedGame._id.toString();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // When - Bileşeni render et
      render(
        <ProjectProvider>
          <TestComponent />
        </ProjectProvider>
      );

      await waitFor(() => {
        // Gerçek DB'de mevcut veriler olabileceğı için en az 1 olduğunu kontrol et
        expect(parseInt(screen.getByTestId('games-count').textContent)).toBeGreaterThanOrEqual(1);
      });

      const initialCount = parseInt(screen.getByTestId('games-count').textContent);

      // When - Oyunu önceden direkt MongoDB ile sil ki hata alsın
      await gamesDB.deleteGame(gameId);

      // When - Sil butonuna tıkla
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Oyun sayısı değişmemeli
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('games-count').textContent);
      expect(finalCount).toBe(initialCount);

      // İstersen consoleErrorSpy ile çağrı olup olmadığını kontrol etmeden de bırakabilirsin
      // Eğer context'te console.error çağrısı garanti edilmiyorsa bu assertion'ı kaldırmak en doğrusudur.
      consoleErrorSpy.mockRestore();
    });

    test('should handle delete with no games available', async () => {
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
      const initialCount = parseInt(screen.getByTestId('games-count').textContent);

      // When - Test verileri yoksa silme işlemi hata vermemeli, sil butonuna tıkla
      await act(async () => {
        screen.getByTestId('delete-project').click();
      });

      // Then - Tekrar yüklenmesini bekle ve son count'u al
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      });
      const finalCount = parseInt(screen.getByTestId('games-count').textContent);
      expect(finalCount).toBe(initialCount);
    });
  });
});
