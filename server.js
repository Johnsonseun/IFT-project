2const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
// For public hosting, avoid unsafe/original filenames (overwrites, path chars, etc.)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    // Keep extension, but replace base name with a random value
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ext && ext.length <= 10 ? ext : '';
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${safeExt}`);
  }
});


// Optional but useful: reject empty uploads early
const fileFilter = (req, file, cb) => {
  if (!file) return cb(null, false);
  cb(null, true);
};


const upload = multer({ storage, fileFilter });


// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// Upload endpoint
// Expects: multipart/form-data with field name "file"
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  res.json({
    message: 'Upload successful',
    // Display name
    originalName: req.file.originalname,
    // Stored name on disk (used for download links)
    filename: req.file.filename,
    size: req.file.size
  });
});


// List files
app.get('/files', (req, res) => {
  fs.readdir(uploadsDir, { withFileTypes: true }, (err, entries) => {
    if (err) return res.status(500).json({ error: 'Unable to read uploads directory' });
    const files = entries
      .filter(e => e.isFile())
      .map(e => e.name);
    res.json({ files });
  });
});

// Download endpoint
app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  // Basic path traversal protection
  if (!filePath.startsWith(uploadsDir)) {
    return res.status(400).send('Invalid filename');
  }

  if (!fs.existsSync(filePath)) return res.status(404).send('File not found');

  res.download(filePath, filename);
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});

