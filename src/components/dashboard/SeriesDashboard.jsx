import { useState } from 'react';
import { Box, Grid, Typography, Fab, Container, CircularProgress, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useProject } from '../../context/ProjectContext';
import AddProjectModal from '../AddProjectModal';
import EditProjectModal from '../EditProjectModal';
import UniversalChart from '../UniversalChart';
import ProjectCard from '../ProjectCard';
import { 
  DASHBOARD_TITLES, 
  CHART_TITLES, 
  EMPTY_STATE_MESSAGES,
  STATUS_OPTIONS,
  DELETE_DIALOG,
  CARD_LABELS,
  MODAL_TITLES,
  GENRE_OPTIONS,
  UI_TEXT
} from '../../config/constants';

function SeriesDashboard() {
  const { movies, loading } = useProject();
  const [openSeriesModal, setOpenSeriesModal] = useState(false);
  const [openEditSeriesModal, setOpenEditSeriesModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAddClick = () => setOpenSeriesModal(true);
  const handleCloseModal = () => setOpenSeriesModal(false);
  const handleEditProject = (project) => {
    setSelectedProject(project);
    setOpenEditSeriesModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditSeriesModal(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        minHeight: '100vh',
        py: 2,
        transition: 'background-color 0.3s'
      }}
    >
      <Box sx={{ py: 4 }}>
        {/* Modern header */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 5,
            p: 4,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: 4,
            color: 'white',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)'
                : '0 8px 32px rgba(240, 147, 251, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h4"
              component="h1" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '1.5rem', md: '2rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '1px',
                mb: 1
              }}
            >
              🎬 {DASHBOARD_TITLES.MOVIES}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 300 }}>
              {EMPTY_STATE_MESSAGES.MOVIES}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4} justifyContent="center" width="100%">
          <Grid item xs={12}>
            {/* Charts and statistics cards side by side */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              mb: 4,
              alignItems: 'stretch',
              justifyContent: 'center',
              width: '100%' // box fills the screen
            }}>
              {/* Charts */}
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                <Box sx={{
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
                    : theme.palette.background.paper,
                  borderRadius: 3,
                  p: 2,
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)'
                      : '0 8px 32px rgba(0, 0, 0, 0.08)',
                  minWidth: 320,
                  maxWidth: 360,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s'
                }}>
                  <UniversalChart 
                    data={movies} 
                    title="🎭 Genre Distribution"
                    type="doughnut"
                    dataKey="genre"
                    height={220}
                    colors={['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b']}
                  />
                </Box>
                <Box sx={{
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
                    : theme.palette.background.paper,
                  borderRadius: 3,
                  p: 2,
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)'
                      : '0 8px 32px rgba(0, 0, 0, 0.08)',
                  minWidth: 320,
                  maxWidth: 360,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s'
                }}>
                  <UniversalChart 
                    data={movies} 
                    title="📈 Watching Status"
                    type="pie"
                    dataKey="status"
                    labelTransform={(status) => {
                      const statusOption = STATUS_OPTIONS.MOVIES.find(option => option.value === status);
                      return statusOption ? statusOption.label : status;
                    }}
                    colors={['#FFA726', '#42A5F5', '#66BB6A', '#EF5350', '#9E9E9E']}
                    height={220}
                  />
                </Box>
              </Box>
              {/* Statistics cards 2x2 grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                  gap: 2,
                  width: 260,
                  justifyContent: 'center',
                  mx: 'auto',
                  ml: { xs: 0, md: 4 }
                }}
              >
                {[ // cards equal size
                  {
                    value: movies.length,
                    label: 'Total Movies/Series',
                    bg: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
                      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white'
                  },
                  {
                    value: movies.filter(m => m.status === 'completed').length,
                    label: 'Watched',
                    bg: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white'
                  },
                  {
                    value: movies.filter(m => m.status === 'watching').length,
                    label: 'Watching',
                    bg: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white'
                  },
                  {
                    value: movies.filter(m => m.rating > 0).length > 0
                      ? (movies.filter(m => m.rating > 0).reduce((sum, m) => sum + m.rating, 0) /
                        movies.filter(m => m.rating > 0).length).toFixed(1)
                      : '0',
                    label: 'Avg. Rating',
                    bg: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                      : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    color: (theme) => theme.palette.mode === 'dark' ? 'white' : '#a0522d'
                  }
                ].map((card, idx) => (
                  <Box key={idx} sx={{
                    p: 2,
                    background: card.bg,
                    borderRadius: 2,
                    color: card.color,
                    textAlign: 'center',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
                        : '0 4px 16px rgba(240, 147, 251, 0.12)',
                    width: 120,
                    height: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Typography variant="h5" data-testid={card.label === 'Avg. Rating' ? 'average-rating-value' : undefined} sx={{ fontWeight: 800, mb: 0.5, fontSize: '1.3rem', color: card.color }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.95rem', color: card.color }}>
                      {card.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
          {/* Project cards should not be on the same row as info cards, but displayed side by side */}
          <Grid item xs={12} sx={{ width: '100%' }}>
            {movies.length === 0 ? (
              // Empty state when no movies/series exist
              <Box sx={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                minHeight: '500px', textAlign: 'center',
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: 4, p: 6, 
                boxShadow: (theme) => theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1)'
                  : '0 8px 32px rgba(0, 0, 0, 0.08)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  {EMPTY_STATE_MESSAGES.MOVIES}
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, color: 'text.secondary' }}>
                  {EMPTY_STATE_MESSAGES.DESCRIPTION}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleAddClick}
                  sx={{ 
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
                      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    '&:hover': {
                      background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)'
                        : 'linear-gradient(135deg, #e084ea 0%, #e44e5b 100%)'
                    }
                  }}
                >
                  Add New Movie/Series
                </Button>
              </Box>
            ) : (
              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ mt: 0 }}
              >
                {movies.map((project) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={project._id}>
                    <ProjectCard
                      data={{ ...project, type: 'series' }}
                      fields={[
                        { key: 'title', label: CARD_LABELS.TITLE },
                        { key: 'genre', label: CARD_LABELS.GENRE },
                        { key: 'director', label: CARD_LABELS.DIRECTOR },
                        { key: 'year', label: CARD_LABELS.YEAR }
                      ]}
                      statusOptions={STATUS_OPTIONS.MOVIES}
                      deleteDialogConfig={{
                        title: DELETE_DIALOG.TITLE.MOVIE,
                        content: DELETE_DIALOG.CONTENT.MOVIE
                      }}
                      onEdit={handleEditProject}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Modern FAB */}
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={handleAddClick} 
          sx={{ 
            position: 'fixed', 
            bottom: 32, 
            right: 32,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            width: 72,
            height: 72,
            boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
              transform: 'scale(1.1) rotate(90deg)',
              boxShadow: '0 16px 50px rgba(139, 92, 246, 0.6)'
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
              zIndex: -1
            }
          }}
        >
          <AddIcon fontSize="large" />
        </Fab>

        {/* Global style for CSS animation */}
        <style>
          {`
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>

        <AddProjectModal 
          open={openSeriesModal} 
          onClose={handleCloseModal}
          type="series"
          title={MODAL_TITLES.ADD_MOVIE}
          genreOptions={GENRE_OPTIONS.MOVIES}
          statusOptions={STATUS_OPTIONS.MOVIES}
          additionalFields={[
            { key: 'director', label: UI_TEXT.DIRECTOR }
          ]}
        />
        <EditProjectModal 
          open={openEditSeriesModal} 
          onClose={handleCloseEditModal} 
          project={selectedProject}
          type="series"
          title={MODAL_TITLES.EDIT_MOVIE}
          genreOptions={GENRE_OPTIONS.MOVIES}
          statusOptions={STATUS_OPTIONS.MOVIES}
          additionalFields={[
            { key: 'director', label: UI_TEXT.DIRECTOR }
          ]}
        />
      </Box>
    </Container>
  );
}

export default SeriesDashboard;