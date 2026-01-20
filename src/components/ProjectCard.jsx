import React, { useState } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Rating, Chip, Box, IconButton, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useProject } from '../context/ProjectContext';
import { DELETE_DIALOG, IMAGE_UPLOAD, UI_TEXT } from '../config/constants';

// data: data to display (e.g., project)
// fields: [{ key: 'title', label: 'Title' }, ...]
// statusOptions: [{ value, label }]
function ProjectCard({ data, fields, statusOptions = [], deleteDialogConfig = {}, onEdit }) {
  const { deleteProject } = useProject();
  const [open, setOpen] = useState(false);

  const handleDelete = () => setOpen(true);
  const handleCancel = () => setOpen(false);

  const handleConfirmDelete = async () => {
    try {
      await deleteProject(data._id, data.type);
    } catch (error) {
      console.error(`Error deleting ${data.type}:`, error);
    }
    setOpen(false);
  };

  const getStatusColor = (status) => {
    const statusColorMap = {
      completed: 'success',
      watching: 'primary',
      playing: 'primary',
      reading: 'primary',
      planned: 'warning',
      dropped: 'error'
    };
    return statusColorMap[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.label || status;
  };

  const renderField = (field) => {
    if (!data[field.key] || ['status', 'rating', 'comment'].includes(field.key)) {
      return null;
    }

    const isTitle = field.key === 'title';
    
    return (
      <Typography 
        key={field.key} 
        variant={isTitle ? 'h6' : 'body1'} 
        color={isTitle ? 'text.primary' : 'text.secondary'} 
        gutterBottom 
        noWrap={isTitle}
        sx={{
          fontWeight: isTitle ? 600 : 400,
          fontSize: isTitle ? '1.1rem' : '0.95rem',
          mb: isTitle ? 1.5 : 0.8,
          lineHeight: 1.5
        }}
      >
        {isTitle ? (
          data[field.key]
        ) : (
          <>
            <Box component="span" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' }}>
              {field.label}
            </Box>{' '}
            <Box component="span" sx={{ fontSize: '0.95rem' }}>
              {data[field.key]}
            </Box>
          </>
        )}
      </Typography>
    );
  };

  const renderRating = () => {
    if (!('rating' in data)) return null;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        p: 1.5,
        backgroundColor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.03)' 
          : 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'divider',
        width: '100%',
        minWidth: 0
      }}>
        <Rating 
          value={data.rating} 
          readOnly 
          size="medium"
          max={5}
          sx={{
            '& .MuiRating-iconFilled': {
              color: '#ff6d75',
            }
          }}
        />
        <Box sx={{ flex: 1 }} />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: '1rem',
            whiteSpace: 'nowrap',
            textAlign: 'right',
            minWidth: 36
          }}
        >
          {data.rating}/5
        </Typography>
      </Box>
    );
  };

  const renderStatus = () => {
    if (!('status' in data)) return null;
    
    return (
      <Box sx={{ mb: 2 }}>
        <Chip
          label={getStatusLabel(data.status)}
          color={getStatusColor(data.status)}
          size="medium"
          sx={{ 
            fontWeight: 500,
            fontSize: '0.8rem',
            height: 28,
            '& .MuiChip-label': {
              px: 1.5
            }
          }}
        />
      </Box>
    );
  };

  const renderComment = () => {
    if (!data.comment) return null;
    
    return (
      <Box sx={{
        mt: 2,
        p: 1.5,
        backgroundColor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.03)' 
          : 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'divider',
      }}>
        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5, display: 'block' }}>
          {UI_TEXT.COMMENT}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            wordBreak: 'break-word', 
            whiteSpace: 'pre-line', 
            overflowWrap: 'break-word',
            lineHeight: 1.4,
            fontSize: '0.85rem'
          }}
        >
          {data.comment}
        </Typography>
      </Box>
    );
  };

  const renderImage = () => {
    if (data.image) {
      return (
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia 
            component="img" 
            height="240" 
            image={data.image} 
            alt={data.title} 
            sx={{ 
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }} 
          />
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)'
          }} />
        </Box>
      );
    }
    
    // Show small icon like MiniCard
    let icon = "📷";
    if (data.type === "series") icon = "🎬";
    else if (data.type === "game") icon = "🎮";
    else if (data.type === "book") icon = "📚";

    return (
      <Box sx={{ 
        height: 240, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'grey.50',
        border: '2px dashed',
        borderColor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.2)' 
          : 'grey.300',
        borderRadius: '8px 8px 0 0'
      }}>
        <Box sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1
        }}>
          <Typography variant="h3" sx={{ 
            color: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.4)' 
              : 'grey.400',
            fontSize: 40,
            lineHeight: 1
          }}>
            {icon}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {IMAGE_UPLOAD.NO_IMAGE}
        </Typography>
      </Box>
    );
  };

  const dialogTitle = deleteDialogConfig.title || DELETE_DIALOG.TITLE.MOVIE;
  const dialogContent = deleteDialogConfig.content || DELETE_DIALOG.CONTENT.MOVIE;

  return (
    <>
      <Card sx={{ 
        width: 250, 
        maxWidth: 250, 
        minWidth: 250, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
          : '0 2px 4px -1px rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'divider',
        overflow: 'hidden',
        backgroundColor: (theme) => theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
          : 'background.paper',
        '&:hover': { 
          transform: 'translateY(-6px)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 10px 15px -5px rgba(0, 0, 0, 0.3), 0 5px 5px -5px rgba(0, 0, 0, 0.1)'
            : '0 10px 15px -5px rgba(0, 0, 0, 0.08), 0 5px 5px -5px rgba(0, 0, 0, 0.03)',
          borderColor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(139, 92, 246, 0.5)' 
            : 'primary.light'
        } 
      }}>
        {renderImage()}
        
        <CardContent sx={{ 
          flexGrow: 1, 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          {fields.map(renderField)}
          {renderRating()}
          {renderStatus()}
          {renderComment()}
        </CardContent>
        
        <CardActions sx={{ 
          justifyContent: 'space-between', 
          px: 1.5, 
          pb: 1.5,
          pt: 1,
          borderTop: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'divider',
          backgroundColor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.02)' 
            : 'rgba(0, 0, 0, 0.02)'
        }}>
          <IconButton 
            size="medium"
            color="primary" 
            onClick={() => onEdit(data)} 
            aria-label="Edit"
            sx={{
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(139, 92, 246, 0.15)'
                : 'rgba(25, 118, 210, 0.08)',
              width: 36,
              height: 36,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(139, 92, 246, 0.25)'
                  : 'rgba(25, 118, 210, 0.12)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s'
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="medium"
            color="error" 
            onClick={handleDelete} 
            aria-label="Delete"
            sx={{
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(211, 47, 47, 0.08)',
              width: 36,
              height: 36,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(239, 68, 68, 0.25)'
                  : 'rgba(211, 47, 47, 0.12)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s'
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
      </Card>
      
      <Dialog 
        open={open} 
        onClose={handleCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
              : undefined,
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.1)'
              : undefined
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCancel} 
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
          >
            {DELETE_DIALOG.CANCEL}
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
          >
            {DELETE_DIALOG.CONFIRM}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProjectCard;

