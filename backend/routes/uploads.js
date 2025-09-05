const express = require('express');
const multer = require('multer');
const router = express.Router();

// Multer configuration for memory storage (no file system storage)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5* 1024 * 1024 // 5MB limit
  }
});

// Upload single image
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    
    // Create data URL format for storing in database
    const imageData = `data:${mimeType};base64,${base64Image}`;
    
    //console.log('REQ:,\n\n', req);
    console.log('RES:,\n\n', req);
    
    res.json({ 
      imageData: imageData,
      mimeType: mimeType,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    // Handle file size limit error
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        message: 'Dosya boyutu çok büyük. Maksimum 5MB yükleyebilirsiniz.',
        code: 'FILE_TOO_LARGE'
      });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
