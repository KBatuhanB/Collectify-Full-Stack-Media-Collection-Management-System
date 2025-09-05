import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import { NAVIGATION } from '../config/constants';

function Header({ darkMode, onThemeChange, activeTab, onTabChange, onHomeClick, showHeader = true }) {
  const tabs = [
    { key: 'Dizi/Film', label: NAVIGATION.MOVIES },
    { key: 'Oyun', label: NAVIGATION.GAMES },
    { key: 'Kitap', label: NAVIGATION.BOOKS },
  ];

  // Aktif tab'a göre renk paleti belirleme
  const getColorPalette = () => {
    switch(activeTab) {
      case 'Dizi/Film':
        return {
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          activeButton: 'linear-gradient(90deg, #e084ea 0%, #e44e5b 100%)',
          shadow: 'rgba(240, 147, 251, 0.3)'
        };
      case 'Oyun':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          activeButton: 'linear-gradient(90deg, #5a6fd8 0%, #6a4190 100%)',
          shadow: 'rgba(102, 126, 234, 0.3)'
        };
      case 'Kitap':
        return {
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          activeButton: 'linear-gradient(90deg, #3e9bfd 0%, #00e1fe 100%)',
          shadow: 'rgba(79, 172, 254, 0.3)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          activeButton: 'linear-gradient(90deg, #5a6fd8 0%, #6a4190 100%)',
          shadow: 'rgba(102, 126, 234, 0.3)'
        };
    }
  };

  const colorPalette = getColorPalette();

  // Mouse ekranın üstüne gelince header'ı göster - Hook'u conditional render'dan önce çağır
  useEffect(() => {
    // Eğer header gösterilmiyorsa event listener'ı ekleme
    if (!showHeader) return;

    const header = document.getElementById('main-header');
    let timeout;
    function handleMouseMove(e) {
      if (!header) return;
      if (e.clientY <= 30) {
        header.classList.add('header-visible');
      } else {
        // Biraz gecikmeli gizle
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          header.classList.remove('header-visible');
        }, 300);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [showHeader]);

  // showHeader false ise header'ı gösterme - Hook'lardan sonra conditional render
  if (!showHeader) return null;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
          : colorPalette.background,
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? '0 4px 24px rgba(0, 0, 0, 0.4)'
          : `0 4px 24px ${colorPalette.shadow}`,
        borderRadius: 0,
        transform: 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1300,
        pointerEvents: 'auto',
        backdropFilter: 'blur(10px)',
        '&:hover': {
          transform: 'translateY(0%)',
        },
        '&.header-visible': {
          transform: 'translateY(0%)',
        }
      }}
      id="main-header"
    >
      <Toolbar
        sx={{
          justifyContent: 'center',
          minHeight: { xs: 44, md: 54 },
          px: { xs: 0.5, md: 2 },
        }}
      >
        {/* Sol taraf - Home butonu */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={onHomeClick}
            sx={{
              color: 'white',
              bgcolor: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.05)' 
                : 'rgba(255,255,255,0.08)',
              borderRadius: 2,
              p: 1,
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(255,255,255,0.15)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s'
            }}
          >
            <HomeIcon />
          </IconButton>
        </Box>

        {/* Orta - Tab butonları */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, md: 1.2 },
            bgcolor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.05)' 
              : 'rgba(255,255,255,0.08)',
            px: 1.2,
            py: 0.5,
            borderRadius: 2,
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 2px 8px rgba(0, 0, 0, 0.3)'
              : `0 2px 8px ${colorPalette.shadow}`,
            border: (theme) => theme.palette.mode === 'dark' 
              ? '1px solid rgba(255,255,255,0.1)' 
              : 'none',
          }}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              disableRipple
              onClick={() => onTabChange(tab.key)}
              sx={{
                px: { xs: 1.2, md: 2 },
                py: 0.5,
                fontWeight: 700,
                fontSize: { xs: '0.95rem', md: '1rem' },
                color: (theme) => theme.palette.mode === 'dark'
                  ? (activeTab === tab.key ? '#ffffff' : 'rgba(255,255,255,0.7)')
                  : (activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.85)'),
                background: activeTab === tab.key
                  ? (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)'
                    : colorPalette.activeButton
                  : 'transparent',
                boxShadow: activeTab === tab.key
                  ? (theme) => theme.palette.mode === 'dark'
                    ? '0 2px 12px rgba(139, 92, 246, 0.4)'
                    : `0 2px 12px ${colorPalette.shadow}`
                  : 'none',
                borderRadius: 2,
                transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
                '&:hover': {
                  background: activeTab === tab.key
                    ? (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)'
                      : colorPalette.activeButton
                    : (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  transform: activeTab === tab.key ? 'scale(1.04)' : 'none',
                },
                textTransform: 'none',
                minWidth: 70,
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {/* Sağ taraf - Theme toggle */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.05)' 
                : 'rgba(255,255,255,0.08)',
              px: 1,
              py: 0.2,
              borderRadius: 2,
              ml: 1,
              border: (theme) => theme.palette.mode === 'dark' 
                ? '1px solid rgba(255,255,255,0.1)' 
                : 'none',
            }}
          >
            <IconButton color="inherit" sx={{ mr: 0.5, p: 0.5 }}>
              {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
            <Switch
              checked={darkMode}
              onChange={onThemeChange}
              color="default"
              size="small"
              sx={{
                '& .MuiSwitch-switchBase': { p: 0.5 },
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#fff',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)'
                    : colorPalette.activeButton,
                  opacity: 1,
                },
                '& .MuiSwitch-track': {
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(255,255,255,0.3)',
                },
              }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
