const express = require('express')
const router = express.Router()
const RoomController = require('../controllers/RoomController')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Đường dẫn lưu ảnh room
const uploadPath = process.env.IMAGE_STORAGE

// Cấu hình multer cho room images
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



// Thêm phòng mới cho khách sạn
router.post('/rooms/:hotel_id', RoomController.AddNewRoom)

// Cập nhật thông tin phòng
router.put('/rooms/:room_id', RoomController.EditRoomInfo)

router.get('/rooms/:room_id', RoomController.ViewRoomDetail)

router.delete('/rooms/:room_id', RoomController.RemoveRoom)

router.get('/:hotel_id/rooms', RoomController.ListofRooms)

router.get('/rooms-hotel/:room_id', RoomController.GetHotelForRoom)

router.get('/rooms-lists/:room_id', RoomController.GetRoomListFromRoomId)

router.put('/update-room-status/:room_id', RoomController.updateRoomStatus)

// API upload ảnh room
router.post('/upload-room-image', upload.single('image'), (req, res) => {
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

// API xóa ảnh room
router.delete('/delete-room-image/:filename', (req, res) => {
  console.log(req.params.filename)
  try {
    console.log(req.params.filename)
    const filename = req.params.filename;
    const filepath = path.join(uploadPath, filename);
    console.log(filepath)
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

module.exports = router 