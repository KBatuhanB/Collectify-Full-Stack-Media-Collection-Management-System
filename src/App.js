import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Sidebar from './components/layout/Sidebar.jsx';
import TopBar from './components/layout/TopBar.jsx';
import MainMenu from './components/MainMenu.jsx';
import StatsOverview from './components/dashboard/StatsOverview.jsx';
import BookDashboard from './components/dashboard/BookDashboard.jsx';
import GameDashboard from './components/dashboard/GameDashboard.jsx';
import SeriesDashboard from './components/dashboard/SeriesDashboard.jsx';
import { ProjectProvider } from './context/ProjectContext.jsx';

function App() {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode for SaaS look
  const [currentView, setCurrentView] = useState('MainMenu');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#667eea',
      },
      secondary: {
        main: '#f093fb',
      },
      background: {
        default: darkMode ? '#0f0f23' : '#f8fafc',
        paper: darkMode ? '#1a1b3c' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e2e8f0' : '#1a202c',
        secondary: darkMode ? '#94a3b8' : '#64748b',
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleNavigateToCategory = (categoryType) => {
    const typeMapping = {
      'series': 'Series',
      'game': 'Game', 
      'book': 'Book'
    };
    setCurrentView(typeMapping[categoryType] || 'Series');
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProjectProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <Sidebar
            open={sidebarOpen}
            onToggle={handleSidebarToggle}
            activeView={currentView}
            onNavigate={handleNavigate}
            darkMode={darkMode}
          />

          {/* Main Content Area */}
          <Box
            sx={{
              flexGrow: 1,
              minHeight: '100vh',
              background: darkMode
                ? 'linear-gradient(135deg, #0f0f23 0%, #1a1b3c 50%, #0f0f23 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              position: 'relative',
              overflow: 'auto',
              '&::before': {
                content: '""',
                position: 'fixed',
                top: 0,
                left: sidebarOpen ? 280 : 72,
                right: 0,
                height: '100vh',
                zIndex: -1,
                background: darkMode
                  ? 'radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(240, 147, 251, 0.05) 0%, transparent 50%)'
                  : 'radial-gradient(circle at 60% 40%, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
                transition: 'left 0.3s ease-in-out',
              }
            }}
          >
            {/* Top Bar */}
            <TopBar
              darkMode={darkMode}
              onThemeChange={handleThemeChange}
              sidebarOpen={sidebarOpen}
            />

            {/* Page Content */}
            <Box
              sx={{
                pt: 10, // Space for TopBar
                px: { xs: 2, sm: 3, md: 4, lg: 5 },
                pb: 4,
                maxWidth: 1800,
                width: '100%',
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
              }}
            >
              {currentView === 'MainMenu' && (
                <Box>
                  <StatsOverview darkMode={darkMode} />
                  <MainMenu onNavigate={handleNavigateToCategory} />
                </Box>
              )}
              {currentView === 'Book' && <BookDashboard />}
              {currentView === 'Game' && <GameDashboard />}
              {currentView === 'Series' && <SeriesDashboard />}
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ProjectProvider>
  );
}

export default App;
