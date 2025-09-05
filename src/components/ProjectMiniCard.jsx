import { Card, CardContent, CardMedia, Box, Typography, Chip } from '@mui/material';
import { IMAGE_UPLOAD } from '../config/constants';

function ProjectMiniCard({ project }) {
  return (
    <Card
      sx={{
        width: 140,
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
      <Box sx={{ height: 120, position: 'relative' }}>
        {project.image ? (
          <CardMedia
            component="img"
            height="120"
            image={project.image}
            alt={project.title}
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
                : 'grey.100'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ opacity: 0.5, fontSize: 40 }}>
                {project.type === "movie" || project.type === "series"
                  ? "🎬"
                  : project.type === "game"
                    ? "🎮"
                    : project.type === "book"
                      ? "📚"
                      : "📷"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {IMAGE_UPLOAD.NO_IMAGE}
              </Typography>
            </Box>
          </Box>
        )}
        <Chip
          label={project.typeName}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: '0.7rem',
            height: 20,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            '& .MuiChip-label': { px: 1 }
          }}
        />
      </Box>
      <CardContent sx={{ p: 1.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 0.5
          }}
        >
          {project.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {project.genre}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ProjectMiniCard;
