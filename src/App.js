import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Header from './components/Header.jsx';
import MainMenu from './components/MainMenu.jsx';
import BookDashboard from './components/dashboard/BookDashboard.jsx';
import GameDashboard from './components/dashboard/GameDashboard.jsx';
import SeriesDashboard from './components/dashboard/SeriesDashboard.jsx';
import { ProjectProvider } from './context/ProjectContext.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('MainMenu'); // 'MainMenu', 'Kitap', 'Oyun', 'Dizi/Film'

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#8b5cf6' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#06b6d4' : '#dc004e',
      },
      background: {
        default: darkMode ? '#0f0f23' : '#ffffff',
        paper: darkMode ? '#1a1b3c' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e2e8f0' : '#1a202c',
        secondary: darkMode ? '#94a3b8' : '#4a5568',
      }
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: darkMode ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)' : 'none',
          },
        },
      },
    },
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleTabChange = (tab) => {
    setCurrentView(tab);
  };

  const handleHomeClick = () => {
    setCurrentView('MainMenu');
  };

  const handleNavigateToCategory = (categoryType) => {
    const typeMapping = {
      'series': 'Dizi/Film',
      'game': 'Oyun', 
      'book': 'Kitap'
    };
    setCurrentView(typeMapping[categoryType] || 'Dizi/Film');
  };

  const isMainMenu = currentView === 'MainMenu';

  return (
    <ProjectProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            width: '100%',
            background: darkMode
              ? 'linear-gradient(135deg, #0f0f23 0%, #1a1b3c 50%, #2d2d5a 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e0c3fc 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: -2,
              background: darkMode
                ? 'radial-gradient(circle at 30% 20%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(6,182,212,0.10) 0%, transparent 50%)'
                : 'radial-gradient(circle at 60% 40%, rgba(240,147,251,0.09) 0%, transparent 70%)'
            }
          }}
        >
          <Header
            darkMode={darkMode}
            onThemeChange={handleThemeChange}
            activeTab={currentView}
            onTabChange={handleTabChange}
            onHomeClick={handleHomeClick}
            showHeader={true}
          />
          
          {/* Content */}
          <Box
            sx={{
              maxWidth: 1440,
              mx: 'auto',
              px: { xs: 1, sm: 2, md: 4 },
              py: isMainMenu ? { xs: 2, md: 4 } : { xs: 2, md: 4 },
              minHeight: isMainMenu ? '100vh' : 'calc(100vh - 64px)',
              transition: 'background 0.3s',
              position: 'relative',
              paddingTop: isMainMenu ? { xs: 2, md: 4 } : { xs: 8, md: 10 } // Ana menüde üst padding az
            }}
          >
            {currentView === 'MainMenu' && <MainMenu onNavigate={handleNavigateToCategory} />}
            {currentView === 'Kitap' && <BookDashboard />}
            {currentView === 'Oyun' && <GameDashboard />}
            {currentView === 'Dizi/Film' && <SeriesDashboard />}
          </Box>
        </Box>
      </ThemeProvider>
    </ProjectProvider>
  );
}

export default App;
