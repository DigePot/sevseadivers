import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'upload/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter (allow images and videos)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|ogg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase());
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG) are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

// Create specific upload configurations
const uploadSingle = multer({ storage, fileFilter }).single('media');
const uploadMultiple = multer({ storage, fileFilter }).fields([
  { name: 'courseImage', maxCount: 1 },
  { name: 'instructorImage', maxCount: 1 },
  { name: 'curriculumVideo', maxCount: 1 }
]);

export default upload;
export { uploadSingle, uploadMultiple }; 