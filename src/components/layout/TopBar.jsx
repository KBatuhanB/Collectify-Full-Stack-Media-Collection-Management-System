import { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Help as HelpIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';

function TopBar({ darkMode, onThemeChange, sidebarOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const notifications = [
    { id: 1, title: 'New movie added', message: 'Inception was added to your collection', time: '2 min ago', unread: true },
    { id: 2, title: 'Storage alert', message: 'You\'ve used 24% of your storage', time: '1 hour ago', unread: true },
    { id: 3, title: 'Backup complete', message: 'Your data has been backed up successfully', time: '3 hours ago', unread: false },
  ];

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        left: sidebarOpen ? 280 : 72,
        width: `calc(100% - ${sidebarOpen ? 280 : 72}px)`,
        background: darkMode 
          ? 'rgba(15, 15, 35, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: darkMode 
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Search Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: darkMode 
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.04)',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            width: { xs: 200, md: 400 },
            border: '1px solid',
            borderColor: darkMode 
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.08)',
            transition: 'all 0.2s',
            '&:focus-within': {
              borderColor: '#667eea',
              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.15)',
            }
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Search movies, games, books..."
            sx={{
              flex: 1,
              color: 'text.primary',
              '& input': {
                py: 0.5,
                fontSize: '0.9rem',
              },
              '& input::placeholder': {
                color: 'text.secondary',
                opacity: 1,
              }
            }}
          />
          <Chip 
            label="⌘K" 
            size="small" 
            sx={{ 
              height: 24,
              fontSize: '0.7rem',
              bgcolor: darkMode 
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.06)',
            }} 
          />
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
            <IconButton
              onClick={onThemeChange}
              sx={{
                bgcolor: darkMode 
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.04)',
                '&:hover': {
                  bgcolor: darkMode 
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.08)',
                }
              }}
            >
              {darkMode ? (
                <LightModeIcon sx={{ color: '#fbbf24' }} />
              ) : (
                <DarkModeIcon sx={{ color: '#6366f1' }} />
              )}
            </IconButton>
          </Tooltip>

          {/* Help */}
          <Tooltip title="Help & Support">
            <IconButton
              sx={{
                bgcolor: darkMode 
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.04)',
                '&:hover': {
                  bgcolor: darkMode 
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.08)',
                }
              }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationClick}
              sx={{
                bgcolor: darkMode 
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.04)',
                '&:hover': {
                  bgcolor: darkMode 
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.08)',
                }
              }}
            >
              <Badge 
                badgeContent={notifications.filter(n => n.unread).length} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 400,
                mt: 1.5,
                background: darkMode 
                  ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
                  : 'white',
                border: '1px solid',
                borderColor: darkMode 
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              <Typography variant="caption" color="text.secondary">
                You have {notifications.filter(n => n.unread).length} unread messages
              </Typography>
            </Box>
            <Divider />
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={handleNotificationClose}
                sx={{
                  py: 1.5,
                  px: 2,
                  bgcolor: notification.unread 
                    ? (darkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)')
                    : 'transparent',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {notification.title}
                    </Typography>
                    {notification.unread && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#667eea',
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              onClick={handleNotificationClose}
              sx={{ justifyContent: 'center', py: 1.5 }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#667eea', 
                  fontWeight: 600,
                }}
              >
                View All Notifications
              </Typography>
            </MenuItem>
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, opacity: 0.2 }} />

          {/* Profile */}
          <Box
            onClick={handleProfileClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              py: 0.5,
              px: 1.5,
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: darkMode 
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.04)',
              }
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              AD
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                Admin User
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                Administrator
              </Typography>
            </Box>
            <ArrowDownIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
            PaperProps={{
              sx: {
                width: 220,
                mt: 1.5,
                background: darkMode 
                  ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
                  : 'white',
                border: '1px solid',
                borderColor: darkMode 
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Admin User
              </Typography>
              <Typography variant="caption" color="text.secondary">
                admin@collectify.app
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleProfileClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">My Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Account Settings</Typography>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleProfileClose} sx={{ color: '#ef4444' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
              </ListItemIcon>
              <Typography variant="body2">Sign Out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
