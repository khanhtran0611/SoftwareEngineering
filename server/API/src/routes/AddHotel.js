const express = require('express')
const router = express.Router()
const AddHotelController = require('../controllers/AddHotelController')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require('path');
const fs = require('fs');

// Đường dẫn lưu ảnh hotel
const uploadPath = process.env.IMAGE_STORAGE;

// Cấu hình multer cho hotel images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tạo folder nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Tách tên file và phần mở rộng
    const nameWithoutExt = path.parse(file.originalname).name;
    const ext = path.parse(file.originalname).ext;
    let finalFileName = file.originalname;
    let index = 1;

    // Kiểm tra file đã tồn tại chưa
    while (fs.existsSync(path.join(uploadPath, finalFileName))) {
      finalFileName = `${nameWithoutExt}(${index})${ext}`;
      index++;
    }

    cb(null, finalFileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload file ảnh!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  }
});

// API upload ảnh hotel
router.post('/upload-hotel-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 0,
        message: 'Vui lòng chọn file ảnh để upload'
      });
    }

    res.status(200).json({
      status: 1,
      message: 'Upload ảnh thành công',
      originalName: req.file.originalname,
      filename: '/' + req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 0,
      message: 'Lỗi khi upload ảnh: ' + error.message
    });
  }
});

// API xóa ảnh hotel
router.delete('/delete-hotel-image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadPath, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(200).json({
        status: 0,
        message: 'File không tồn tại'
      });
    }

    fs.unlinkSync(filepath);

    res.status(200).json({
      status: 1,
      message: 'Xóa ảnh thành công'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      status: 0,
      message: 'Lỗi khi xóa ảnh: ' + error.message
    });
  }
});

router.post('/add-hotel', AddHotelController.AddNewHotel)
router.delete('/hotels/:hotel_id', AddHotelController.RemoveHotel)
router.get('/hotels/:hotel_id', AddHotelController.ViewHotelDetail)
router.put('/edit-hotel/:hotel_id', AddHotelController.EditHotelInfo)
router.get('/hotels', AddHotelController.ViewAllHotel)

module.exports = router


