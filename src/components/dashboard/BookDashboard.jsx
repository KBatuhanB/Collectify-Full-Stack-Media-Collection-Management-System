import { useState } from 'react';
import { Box, Grid, Typography, Fab, Container, CircularProgress } from '@mui/material';
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
  UI_TEXT,
  STATUS_OPTIONS,
  DELETE_DIALOG,
  CARD_LABELS,
  MODAL_TITLES,
  GENRE_OPTIONS
} from '../../config/constants';

function BookDashboard() {
  const { books, loading } = useProject();
  const [openBookModal, setOpenBookModal] = useState(false);
  const [openEditBookModal, setOpenEditBookModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAddClick = () => setOpenBookModal(true);
  const handleCloseModal = () => setOpenBookModal(false);
  const handleEditProject = (project) => {
    setSelectedProject(project);
    setOpenEditBookModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditBookModal(false);
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
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: 4,
            color: 'white',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)'
                : '0 8px 32px rgba(79, 172, 254, 0.3)',
            position: 'relative',
            overflow: 'hidden'
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
              📚 {DASHBOARD_TITLES.BOOKS}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Manage and explore your book collection
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
              width: '100%'
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
                    data={books} 
                    title="📖 Genre Distribution"
                    type="doughnut"
                    dataKey="genre"
                    height={220}
                    colors={['#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#ffecd2']}
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
                    data={books} 
                    title="📊 Reading Status"
                    type="pie"
                    dataKey="status"
                    labelTransform={(status) => {
                      const statusOption = STATUS_OPTIONS.BOOKS.find(option => option.value === status);
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
                    value: books.length,
                    label: 'Total Books',
                    bg: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
                      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white'
                  },
                  {
                    value: books.filter(b => b.status === 'completed').length,
                    label: 'Completed',
                    bg: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white'
                  },
                  {
                    value: books.filter(b => b.status === 'reading').length,
                    label: 'Reading',
                    bg: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      : 'linear-gradient(135deg, #66bb6a 0%, #43e97b 100%)',
                    color: 'white'
                  },
                  {
                    value: books.filter(b => b.rating > 0).length > 0
                      ? (books.filter(b => b.rating > 0).reduce((sum, b) => sum + b.rating, 0) /
                        books.filter(b => b.rating > 0).length).toFixed(1)
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
                        : '0 4px 16px rgba(79, 172, 254, 0.12)',
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
            {books.length === 0 ? (
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
                <Box sx={{
                  width: 150, height: 150, borderRadius: '50%',
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mb: 4, 
                  boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 12px 40px rgba(139, 92, 246, 0.4)'
                    : '0 12px 40px rgba(79, 172, 254, 0.3)'
                }}>
                  <Typography variant="h1" sx={{ color: 'white', fontSize: '4rem' }}>📚</Typography>
                </Box>
                <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  {EMPTY_STATE_MESSAGES.BOOKS}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 500, lineHeight: 1.6, opacity: 0.8 }}>
                  {EMPTY_STATE_MESSAGES.DESCRIPTION}
                </Typography>
              </Box>
            ) : (
              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ mt: 0 }} // should not be on the same row as info cards
              >
                {books.map((project) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={project._id}>
                    <ProjectCard
                      data={{ ...project, type: 'book' }}
                      fields={[
                        { key: 'title', label: CARD_LABELS.TITLE },
                        { key: 'genre', label: CARD_LABELS.GENRE },
                        { key: 'author', label: CARD_LABELS.AUTHOR },
                        { key: 'year', label: CARD_LABELS.YEAR }
                      ]}
                      statusOptions={STATUS_OPTIONS.BOOKS}
                      deleteDialogConfig={{
                        title: DELETE_DIALOG.TITLE.BOOK,
                        content: DELETE_DIALOG.CONTENT.BOOK
                      }}
                      onEdit={handleEditProject}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        <Fab 
          color="primary" aria-label="add" onClick={handleAddClick} 
          sx={{ 
            position: 'fixed', bottom: 32, right: 32,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            width: 72, height: 72,
            boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
              transform: 'scale(1.1) rotate(90deg)',
              boxShadow: '0 16px 50px rgba(139, 92, 246, 0.6)'
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <AddIcon fontSize="large" />
        </Fab>

        <AddProjectModal 
          open={openBookModal} 
          onClose={handleCloseModal}
          type="book"
          title={MODAL_TITLES.ADD_BOOK}
          genreOptions={GENRE_OPTIONS.BOOKS}
          statusOptions={STATUS_OPTIONS.BOOKS}
          additionalFields={[
            { key: 'author', label: UI_TEXT.AUTHOR }
          ]}
        />
        <EditProjectModal 
          open={openEditBookModal} 
          onClose={handleCloseEditModal} 
          project={selectedProject}
          type="book"
          title={MODAL_TITLES.EDIT_BOOK}
          genreOptions={GENRE_OPTIONS.BOOKS}
          statusOptions={STATUS_OPTIONS.BOOKS}
          additionalFields={[
            { key: 'author', label: UI_TEXT.AUTHOR }
          ]}
        />
      </Box>
    </Container>
  );
}

export default BookDashboard;