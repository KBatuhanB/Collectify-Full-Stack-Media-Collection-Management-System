import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  MenuItem, FormControl, InputLabel, Select, Rating, Typography, Box, Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useProject } from '../context/ProjectContext';
import { uploadAPI } from '../services/api';
import { UI_TEXT, ERROR_MESSAGES, IMAGE_UPLOAD } from '../config/constants';

/**
 * Birleşik proje düzenleme modalı - film, oyun, kitap için kullanılır
 */
function EditProjectModal({ 
  open, onClose, project, type, title, genreOptions, statusOptions, additionalFields = [] 
}) {
  const { updateProject } = useProject();

  // Form verilerini başlangıç değerleriyle başlat
  const getInitialFormData = () => {
    const baseData = {
      title: '', genre: '', rating: 0, status: 'planned',
      comment: '', image: '', year: null,
    };
    additionalFields.forEach(field => { baseData[field.key] = ''; });
    return baseData;
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Proje verisi değiştiğinde formu güncelle
  useEffect(() => {
    if (project) {
      const newFormData = {
        title: project.title || '',
        genre: project.genre || '',
        rating: project.rating || 0,
        status: project.status || 'planned',
        comment: project.comment || '',
        image: project.image || '',
        year: project.year ? dayjs().year(project.year) : null,
      };
      
      // Ek alanları ekle
      additionalFields.forEach(field => {
        newFormData[field.key] = project[field.key] || '';
      });
      
      setFormData(newFormData);
    }
  }, [project, additionalFields]);

  // Form alanı değişikliklerini yönet
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Puan değişikliklerini yönet
  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, rating: newValue }));
  };

  // Tarih seçici değişikliklerini yönet
  const handleDateChange = (newValue) => {
    setFormData(prev => ({ ...prev, year: newValue }));
  };

  // Resim yükleme işlemi
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size before upload (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      alert(ERROR_MESSAGES.FILE_TOO_LARGE);
      return;
    }

    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      
      // Resim yüklenmiş mi ve dosya boyutu 0'dan büyük mü kontrol et
      if (response?.data?.imageData && response?.data?.size > 0) {
        setFormData(prev => ({
          ...prev,
          image: response.data.imageData
        }));
      } else {
        throw new Error('Resim yüklenemedi veya dosya boş');
      }
    } catch (error) {
      console.error('File upload error:', error);
      // Check if it's a file size error from backend (413 = Payload Too Large)
      if (error.response?.status === 413) {
        alert(ERROR_MESSAGES.FILE_TOO_LARGE);
      } else {
        alert(ERROR_MESSAGES.FILE_UPLOAD);
      }
    } finally {
      setUploading(false);
    }
  };

  // Form gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const cleanData = { ...formData };
      if (cleanData.year) cleanData.year = cleanData.year.year();
      
      await updateProject(project._id, cleanData, type);
      onClose();
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="xs" // daha küçük modal
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.1)'
              : '0 4px 16px rgba(0, 0, 0, 0.10)',
            maxWidth: 380,
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1b3c 0%, #2d2d5a 100%)'
              : undefined
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Modal Başlığı */}
          <DialogTitle sx={{ 
            textAlign: 'center',
            fontSize: '1.1rem', // başlık küçültüldü
            fontWeight: 600,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            mb: 1
          }}>
            {title}
          </DialogTitle>
          
          <DialogContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Başlık Alanı */}
              <TextField
                name="title"
                label={UI_TEXT.TITLE}
                fullWidth
                required
                value={formData.title}
                onChange={handleChange}
                variant="outlined"
                size="small"
                InputProps={{ sx: { fontSize: '0.95rem', height: 36 } }}
                InputLabelProps={{ sx: { fontSize: '0.95rem' } }}
              />

              {/* Tür */}
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: '0.95rem' }}>{UI_TEXT.GENRE}</InputLabel>
                <Select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  label={UI_TEXT.GENRE}
                  required
                  sx={{ fontSize: '0.95rem', height: 36 }}
                >
                  {genreOptions.map((genre) => (
                    <MenuItem key={genre} value={genre} sx={{ fontSize: '0.95rem' }}>{genre}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Durum */}
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: '0.95rem' }}>{UI_TEXT.STATUS}</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label={UI_TEXT.STATUS}
                  sx={{ fontSize: '0.95rem', height: 36 }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.95rem' }}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Puan Değerlendirme */}
              <Box sx={{ 
                p: 1,
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'grey.200'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.95rem' }}>
                  Puan
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating
                    name="rating"
                    value={formData.rating}
                    onChange={handleRatingChange}
                    size="small"
                    max={5}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                    {formData.rating}/5
                  </Typography>
                </Box>
              </Box>

              {/* Ek Alanlar (Platform, Yönetmen, Yazar vs.) */}
              {additionalFields.map(field => (
                <TextField
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  fullWidth
                  value={formData[field.key]}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  InputProps={{ sx: { fontSize: '0.95rem', height: 36 } }}
                  InputLabelProps={{ sx: { fontSize: '0.95rem' } }}
                />
              ))}

              {/* Yıl */}
              <DatePicker
                label={UI_TEXT.YEAR}
                views={['year']}
                value={formData.year}
                onChange={handleDateChange}
                slotProps={{
                  textField: { fullWidth: true, size: 'small', InputProps: { sx: { fontSize: '0.95rem', height: 36 } }, InputLabelProps: { sx: { fontSize: '0.95rem' } } }
                }}
              />

              {/* Yorum */}
              <TextField
                name="comment"
                label={UI_TEXT.COMMENT}
                fullWidth
                multiline
                rows={3}
                value={formData.comment}
                onChange={handleChange}
                variant="outlined"
                size="small"
                InputProps={{ sx: { fontSize: '0.95rem' } }}
                InputLabelProps={{ sx: { fontSize: '0.95rem' } }}
              />

              {/* Resim Yükleme */}
              <Box sx={{ 
                p: 1.5,
                border: '2px dashed',
                borderColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.2)' 
                  : 'grey.300',
                borderRadius: 1,
                textAlign: 'center',
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.03)' 
                  : 'grey.50'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                  <Avatar
                    src={formData.image}
                    sx={{ width: 48, height: 48 }}
                    variant="rounded"
                  />
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload-edit"
                      type="file"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="image-upload-edit">
                      <Button
                        variant="contained"
                        component="span"
                        disabled={uploading}
                        startIcon={<PhotoCameraIcon />}
                        sx={{ mb: 0.5, fontSize: '0.7rem', minHeight: 32, px: 1.5 }}
                        size="small"
                      >
                        {uploading ? IMAGE_UPLOAD.UPLOADING : IMAGE_UPLOAD.TEXT}
                      </Button>
                    </label>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.85rem' }}>
                      {IMAGE_UPLOAD.DESC}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          {/* Modal Alt Butonları */}
          <DialogActions sx={{ 
            p: 2, 
            borderTop: '1px solid',
            borderColor: 'divider',
            gap: 1,
            justifyContent: 'center'
          }}>
            <Button 
              onClick={onClose}
              variant="outlined"
              size="small"
              sx={{ minWidth: 80, fontSize: '0.95rem', height: 32 }}
            >
              {UI_TEXT.CANCEL}
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              size="small"
              disabled={loading || !formData.title.trim()}
              sx={{ minWidth: 80, fontSize: '0.95rem', height: 32 }}
            >
              {loading ? UI_TEXT.LOADING : UI_TEXT.SAVE}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}

export default EditProjectModal;
