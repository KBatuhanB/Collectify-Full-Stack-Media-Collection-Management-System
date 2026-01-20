import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  Badge,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Movie as MovieIcon,
  SportsEsports as GamesIcon,
  MenuBook as BooksIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  CloudUpload as UploadIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

function Sidebar({ open, onToggle, activeView, onNavigate, darkMode }) {
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const mainMenuItems = [
    { 
      id: 'MainMenu', 
      label: 'Dashboard', 
      icon: <DashboardIcon />,
      badge: null
    },
    { 
      id: 'Series', 
      label: 'Movies & Series', 
      icon: <MovieIcon />,
      badge: null
    },
    { 
      id: 'Game', 
      label: 'Games', 
      icon: <GamesIcon />,
      badge: null
    },
    { 
      id: 'Book', 
      label: 'Books', 
      icon: <BooksIcon />,
      badge: null
    },
  ];

  const analyticsItems = [
    { id: 'performance', label: 'Performance', icon: <SpeedIcon /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUpIcon /> },
    { id: 'storage', label: 'Storage Usage', icon: <StorageIcon /> },
  ];

  const bottomMenuItems = [
    { id: 'uploads', label: 'Media Library', icon: <UploadIcon /> },
    { id: 'security', label: 'Security', icon: <SecurityIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const getGradient = (itemId) => {
    switch(itemId) {
      case 'Series':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'Game':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'Book':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          boxSizing: 'border-box',
          background: darkMode 
            ? 'linear-gradient(180deg, #0f0f23 0%, #1a1b3c 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          borderRight: darkMode 
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(0,0,0,0.08)',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          minHeight: 72,
        }}
      >
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
                C
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.1rem',
                  letterSpacing: '-0.5px',
                }}
              >
                Collectify
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
              >
                Media CMS Platform
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton 
          onClick={onToggle}
          size="small"
          sx={{
            bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            '&:hover': {
              bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            }
          }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ opacity: 0.1 }} />

      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: open ? 'flex-start' : 'center',
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#22c55e',
                border: '2px solid',
                borderColor: darkMode ? '#1a1b3c' : 'white',
              }}
            />
          }
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            AD
          </Avatar>
        </Badge>
        {open && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              Admin User
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}
            >
              Pro Plan • Active
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ opacity: 0.1, mb: 1 }} />

      {/* Main Navigation */}
      <Box sx={{ px: 1.5, py: 1 }}>
        {open && (
          <Typography
            variant="overline"
            sx={{ 
              color: 'text.secondary', 
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '1px',
              px: 1.5,
            }}
          >
            Main Menu
          </Typography>
        )}
        <List sx={{ py: 0.5 }}>
          {mainMenuItems.map((item) => (
            <Tooltip 
              key={item.id} 
              title={!open ? item.label : ''} 
              placement="right"
              arrow
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={activeView === item.id}
                  onClick={() => onNavigate(item.id)}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    justifyContent: open ? 'flex-start' : 'center',
                    px: open ? 2 : 1.5,
                    '&.Mui-selected': {
                      background: getGradient(item.id),
                      color: 'white',
                      '& .MuiListItemIcon-root': { color: 'white' },
                      '&:hover': {
                        background: getGradient(item.id),
                      }
                    },
                    '&:hover': {
                      bgcolor: darkMode 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.04)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: open ? 40 : 'auto',
                      justifyContent: 'center',
                      color: activeView === item.id ? 'inherit' : 'text.secondary',
                    }}
                  >
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  {open && (
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: activeView === item.id ? 600 : 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* Analytics Section */}
      <Box sx={{ px: 1.5, py: 1 }}>
        {open && (
          <Typography
            variant="overline"
            sx={{ 
              color: 'text.secondary', 
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '1px',
              px: 1.5,
            }}
          >
            Analytics
          </Typography>
        )}
        <List sx={{ py: 0.5 }}>
          <Tooltip title={!open ? 'Analytics' : ''} placement="right" arrow>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => open && setAnalyticsOpen(!analyticsOpen)}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  justifyContent: open ? 'flex-start' : 'center',
                  px: open ? 2 : 1.5,
                  '&:hover': {
                    bgcolor: darkMode 
                      ? 'rgba(255,255,255,0.05)' 
                      : 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open ? 40 : 'auto',
                    justifyContent: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <AnalyticsIcon />
                </ListItemIcon>
                {open && (
                  <>
                    <ListItemText 
                      primary="Analytics"
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    />
                    {analyticsOpen ? <ExpandLess /> : <ExpandMore />}
                  </>
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
          
          {open && (
            <Collapse in={analyticsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {analyticsItems.map((item) => (
                  <ListItemButton
                    key={item.id}
                    sx={{
                      pl: 4,
                      borderRadius: 2,
                      minHeight: 40,
                      '&:hover': {
                        bgcolor: darkMode 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.8rem',
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </List>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ mt: 'auto', px: 1.5, pb: 2 }}>
        <Divider sx={{ opacity: 0.1, mb: 1 }} />
        {open && (
          <Typography
            variant="overline"
            sx={{ 
              color: 'text.secondary', 
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '1px',
              px: 1.5,
            }}
          >
            System
          </Typography>
        )}
        <List sx={{ py: 0.5 }}>
          {bottomMenuItems.map((item) => (
            <Tooltip 
              key={item.id} 
              title={!open ? item.label : ''} 
              placement="right"
              arrow
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    minHeight: 44,
                    justifyContent: open ? 'flex-start' : 'center',
                    px: open ? 2 : 1.5,
                    '&:hover': {
                      bgcolor: darkMode 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: open ? 40 : 'auto',
                      justifyContent: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>

        {/* Storage Usage Indicator */}
        {open && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              background: darkMode 
                ? 'rgba(255,255,255,0.03)' 
                : 'rgba(0,0,0,0.02)',
              border: '1px solid',
              borderColor: darkMode 
                ? 'rgba(255,255,255,0.06)' 
                : 'rgba(0,0,0,0.06)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Storage Used
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2.4 GB / 10 GB
              </Typography>
            </Box>
            <Box
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: '24%',
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

export default Sidebar;
