import { Box, Grid, Paper, Typography, Avatar, Chip, LinearProgress, IconButton } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Movie as MovieIcon,
  SportsEsports as GamesIcon,
  MenuBook as BooksIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  MoreVert as MoreIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useProject } from '../../context/ProjectContext';

function StatsOverview({ darkMode }) {
  const { movies, games, books } = useProject();

  // Calculate statistics
  const totalItems = movies.length + games.length + books.length;
  const completedItems = [
    ...movies.filter(m => m.status === 'completed'),
    ...games.filter(g => g.status === 'completed'),
    ...books.filter(b => b.status === 'completed'),
  ].length;
  
  const avgRating = (() => {
    const allItems = [...movies, ...games, ...books].filter(i => i.rating > 0);
    if (allItems.length === 0) return 0;
    return (allItems.reduce((sum, i) => sum + Number(i.rating), 0) / allItems.length).toFixed(1);
  })();

  const inProgressItems = [
    ...movies.filter(m => m.status === 'watching'),
    ...games.filter(g => g.status === 'playing'),
    ...books.filter(b => b.status === 'reading'),
  ].length;

  const stats = [
    {
      title: 'Total Collection',
      value: totalItems,
      change: '+12%',
      changeType: 'positive',
      icon: <TrendingUpIcon />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtitle: 'All media items',
    },
    {
      title: 'Completed',
      value: completedItems,
      change: `${totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}%`,
      changeType: 'positive',
      icon: <CheckIcon />,
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      subtitle: 'Finished items',
    },
    {
      title: 'In Progress',
      value: inProgressItems,
      change: 'Active',
      changeType: 'neutral',
      icon: <ScheduleIcon />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      subtitle: 'Currently enjoying',
    },
    {
      title: 'Avg. Rating',
      value: avgRating,
      change: '★',
      changeType: 'positive',
      icon: <StarIcon />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      subtitle: 'Overall quality',
    },
  ];

  const categoryStats = [
    {
      title: 'Movies & Series',
      count: movies.length,
      icon: <MovieIcon />,
      color: '#f5576c',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      completed: movies.filter(m => m.status === 'completed').length,
    },
    {
      title: 'Games',
      count: games.length,
      icon: <GamesIcon />,
      color: '#764ba2',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      completed: games.filter(g => g.status === 'completed').length,
    },
    {
      title: 'Books',
      count: books.length,
      icon: <BooksIcon />,
      color: '#00f2fe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      completed: books.filter(b => b.status === 'completed').length,
    },
  ];

  // Recent activity (last 4 items added)
  const recentActivity = [
    ...movies.map(m => ({ ...m, type: 'Movie', icon: '🎬' })),
    ...games.map(g => ({ ...g, type: 'Game', icon: '🎮' })),
    ...books.map(b => ({ ...b, type: 'Book', icon: '📚' })),
  ]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4);

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, Admin! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your media collection today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: darkMode 
                  ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
                  : 'white',
                border: '1px solid',
                borderColor: darkMode 
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.08)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                width: '100%',
                flex: 1,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: darkMode 
                    ? '0 12px 24px rgba(0,0,0,0.4)'
                    : '0 12px 24px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    background: stat.gradient,
                    boxShadow: `0 4px 14px ${stat.gradient.includes('#667eea') ? 'rgba(102, 126, 234, 0.4)' : 'rgba(240, 147, 251, 0.4)'}`,
                  }}
                >
                  {stat.icon}
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  size="small"
                  label={stat.change}
                  icon={stat.changeType === 'positive' ? <ArrowUpIcon sx={{ fontSize: '0.9rem !important' }} /> : null}
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    bgcolor: stat.changeType === 'positive' 
                      ? 'rgba(34, 197, 94, 0.15)'
                      : 'rgba(234, 179, 8, 0.15)',
                    color: stat.changeType === 'positive' 
                      ? '#22c55e'
                      : '#eab308',
                    '& .MuiChip-icon': {
                      color: 'inherit',
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Category Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
        <Grid item xs={12} lg={8} sx={{ display: 'flex' }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: darkMode 
                ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
                : 'white',
              border: '1px solid',
              borderColor: darkMode 
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.08)',
              height: '100%',
              width: '100%',
              flex: 1,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Collection Breakdown
              </Typography>
              <IconButton size="small">
                <MoreIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'stretch' }}>
              {categoryStats.map((category, index) => (
                <Grid item xs={12} sm={4} key={index} sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: darkMode 
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(0,0,0,0.02)',
                      border: '1px solid',
                      borderColor: darkMode 
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(0,0,0,0.06)',
                      width: '100%',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: category.gradient,
                        }}
                      >
                        {category.icon}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {category.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {category.count}
                    </Typography>
                    
                    <Box sx={{ mb: 2, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {category.completed} / {category.count}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={category.count > 0 ? (category.completed / category.count) * 100 : 0}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: darkMode 
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: category.gradient,
                          }
                        }}
                      />
                    </Box>

                    {/* Additional Stats */}
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr',
                      gap: 1.5,
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          In Progress
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: category.color }}>
                          {category.count - category.completed - 
                           (index === 0 ? movies.filter(m => m.status === 'dropped').length :
                            index === 1 ? games.filter(g => g.status === 'dropped').length :
                            books.filter(b => b.status === 'dropped').length)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Progress
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: category.color }}>
                          {category.count > 0 ? Math.round((category.completed / category.count) * 100) : 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: darkMode 
                ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
                : 'white',
              border: '1px solid',
              borderColor: darkMode 
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.08)',
              height: '100%',
              width: '100%',
              flex: 1,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <Chip 
                label="Live" 
                size="small"
                sx={{
                  height: 24,
                  bgcolor: 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  '& .MuiChip-label': {
                    px: 1,
                  },
                  '&::before': {
                    content: '""',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#22c55e',
                    mr: 0.5,
                    animation: 'pulse 2s infinite',
                  },
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivity.length > 0 ? (
                recentActivity.map((item, index) => (
                  <Box
                    key={item._id || index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: darkMode 
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(0,0,0,0.02)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: darkMode 
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(0,0,0,0.04)',
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: '1.5rem' }}>
                      {item.icon}
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Added to {item.type}s
                      </Typography>
                    </Box>
                    <Chip
                      label={item.genre}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.65rem',
                        bgcolor: darkMode 
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.06)',
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activity
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Start adding items to your collection
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StatsOverview;
