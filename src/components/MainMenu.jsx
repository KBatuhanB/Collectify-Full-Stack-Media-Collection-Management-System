import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Container, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MovieIcon from '@mui/icons-material/Movie';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useProject } from '../context/ProjectContext';
import { MAIN_MENU, DASHBOARD_TITLES, IMAGE_UPLOAD, EMPTY_STATE_MESSAGES } from '../config/constants';
import ProjectMiniCard from './ProjectMiniCard';

function MainMenu({ onNavigate }) {
  const { movies, games, books } = useProject();

  // Tüm projeleri birleştir ve tarihe göre sırala (son eklenenler önce)
  const allProjects = [
    ...movies.map(m => ({ ...m, type: 'movie', typeName: 'Film/Dizi', icon: '🎬' })),
    ...games.map(g => ({ ...g, type: 'game', typeName: 'Oyun', icon: '🎮' })),
    ...books.map(b => ({ ...b, type: 'book', typeName: 'Kitap', icon: '📚' }))
  ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  // Son 8 projeyi al
  const recentProjects = allProjects.slice(0, 8);

  const CategoryRow = ({ title, items, type, icon, gradient, onViewAll }) => (
    <Box sx={{ mb: 4 }}>
      {/* Kategori başlığı */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          p: 3,
          background: gradient,
          borderRadius: 3,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="5" cy="5" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ fontSize: '1.5rem' }}>{icon}</Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.25rem' } }}
            >
              {title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {items.length} öğe
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={() => onViewAll(type)}
          endIcon={<ArrowForwardIcon />}
          sx={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            position: 'relative',
            zIndex: 1,
            '&:hover': {
              background: 'rgba(255,255,255,0.3)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s'
          }}
        >
          {MAIN_MENU.VIEW_ALL}
        </Button>
      </Box>

      {/* İçerik kartları */}
      {items.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'grey.300'
          }}
        >
          <Box sx={{ fontSize: '3rem', mb: 2, opacity: 0.5 }}>{icon}</Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {EMPTY_STATE_MESSAGES.NO_ITEMS || `Henüz ${title.toLowerCase()} eklenmemiş`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {EMPTY_STATE_MESSAGES.DESCRIPTION}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            px: 1,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(0,0,0,0.3)',
              borderRadius: 4,
            },
          }}
        >
          {items.map((item) => (
            <Card
              key={item._id}
              sx={{
                width: 180,
                flexShrink: 0,
                borderRadius: 2,
                overflow: 'hidden',
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
                  : 'background.paper',
                boxShadow: (theme) => theme.palette.mode === 'dark'
                  ? '0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Box sx={{ height: 200, position: 'relative' }}>
                {item.image ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'grey.100',
                      border: '2px dashed',
                      borderColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.2)'
                        : 'grey.300'
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h2" sx={{ opacity: 0.5, mb: 1 }}>
                        {icon}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Resim yok
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Chip
                  label={item.genre}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontSize: '0.7rem',
                    height: 24,
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-label': { px: 1.5 }
                  }}
                />
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 1,
                    fontSize: '0.95rem'
                  }}
                >
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  {item.year && `${item.year} • `}
                  {item.author || item.director || item.platform || 'Bilinmiyor'}
                </Typography>
                {item.rating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">Puan:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {item.rating}/5
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Ana Başlık */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '3rem' },
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #8b5cf6, #06b6d4)'
              : 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          {MAIN_MENU.TITLE}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>
          {MAIN_MENU.SUBTITLE}
        </Typography>
      </Box>

      {/* Son Eklenenler Bölümü */}
      {recentProjects.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            ✨ {MAIN_MENU.RECENT_ADDED}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 2,
              px: 1,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(0,0,0,0.3)',
                borderRadius: 4,
              },
            }}
          >
            {recentProjects.map((project) => (
              <ProjectMiniCard key={project._id} project={project} />
            ))}
          </Box>
        </Box>
      )}

      {/* Kategoriler - Yatay Satırlar */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          🚀 {MAIN_MENU.EXPLORE_CATEGORIES}
        </Typography>

        <CategoryRow
          title={DASHBOARD_TITLES.MOVIES}
          items={movies.slice(0, 8)}
          type="series"
          icon="🎬"
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          onViewAll={onNavigate}
        />

        <CategoryRow
          title={DASHBOARD_TITLES.GAMES}
          items={games.slice(0, 8)}
          type="game"
          icon="🎮"
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          onViewAll={onNavigate}
        />

        <CategoryRow
          title={DASHBOARD_TITLES.BOOKS}
          items={books.slice(0, 8)}
          type="book"
          icon="📚"
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          onViewAll={onNavigate}
        />
      </Box>
    </Container>
  );
}

export default MainMenu;