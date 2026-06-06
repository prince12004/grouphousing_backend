const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only jpg, png, webp images allowed'));
};

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage: diskStorage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });
const uploadAvatar = multer({ storage: diskStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

module.exports = { upload, uploadAvatar };
