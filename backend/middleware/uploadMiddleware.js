const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// ─── Cloudinary Config ─────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ─── Cloudinary Storage Engine ─────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const userId = req.user?._id || 'anonymous';
    const timestamp = Date.now();
    const baseName = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 40);

    return {
      folder: 'smartgov/documents',
      public_id: `${userId}-${timestamp}-${baseName}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      resource_type: 'auto',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    };
  },
});

// ─── File Filter ───────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype.toLowerCase().replace('application/', ''));

  if (extOk && (mimeOk || file.mimetype === 'application/pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed.'), false);
  }
};

// ─── Multer Instance ───────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// ─── Error Handler Wrapper ─────────────────────────────────────────────────
const handleUpload = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: 'File is too large. Maximum allowed size is 5MB.',
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

module.exports = {
  uploadSingle: handleUpload(upload.single('document')),
  uploadMultiple: handleUpload(upload.array('documents', 5)),
  cloudinary,
};
