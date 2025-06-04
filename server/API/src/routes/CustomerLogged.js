const orderController = require('../controllers/OrderController.js')
const hotelController = require('../controllers/HotelController.js')
const desController = require('../controllers/DesController.js')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require('path');
const fs = require('fs');
require('dotenv').config()

const uploadPath = process.env.IMAGE_STORAGE
// Cấu hình multer để upload file;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Thay đổi đường dẫn tới folder bạn muốn lưu ảnh
    // Tạo folder nếu chưa tồn tại
    console.log(uploadPath)
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Tách tên file và phần mở rộng
    const nameWithoutExt = path.parse(file.originalname).name;  // vd: "image"
    const ext = path.parse(file.originalname).ext;             // vd: ".jpg"
    let finalFileName = file.originalname;
    let index = 1;

    // Kiểm tra file đã tồn tại chưa
    while (fs.existsSync(path.join(uploadPath, finalFileName))) {
      // Nếu file đã tồn tại, thêm index vào tên
      // Ví dụ: image.jpg -> image(1).jpg -> image(2).jpg
      finalFileName = `${nameWithoutExt}(${index})${ext}`;
      index++;
    }

    // Callback với tên file cuối cùng
    cb(null, finalFileName);
  }
});

// Các phần còn lại giữ nguyên như cũ
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

// API upload ảnh
router.post('/upload-image-user', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 0,
        message: 'Vui lòng chọn file ảnh để upload'
      });
    }

    // Trả về cả tên file gốc và tên file đã được lưu
    res.status(200).json({
      status: 1,
      message: 'Upload ảnh thành công',
      originalName: req.file.originalname,          // Tên file gốc          // Tên file đã lưu (có thể có index)
      filename: '/' + req.file.filename  // Đường dẫn đầy đủ
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 0,
      message: 'Lỗi khi upload ảnh: ' + error.message
    });
  }
});

// API xóa ảnh vẫn giữ nguyên
router.delete('/delete-image-user/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadPath, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
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

router.get('/bookings/:user_id', orderController.viewOrder);
router.post('/addloving', desController.SaveTolovingList);
router.get('/bookingdetail/:booking_id', orderController.ViewBookingDetail);
router.get('/loving/:user_id', desController.viewLovingList);
router.delete('/deleteloving/:user_id/:destination_id', desController.DeleteLovingList);
router.get('/destinations', desController.viewAllDestination);
// router.get('/destinationInfo', desController.viewDestination);  // need query parameter : destination_id
router.get('/hotels/:hotel_id', hotelController.viewHotels);  // need query parameter : hotel_id
router.get('/roomdetail/:room_id', orderController.getRoomDetail);
router.post('/commenting', hotelController.addComment);
router.get('/comments/:hotel_id', orderController.ViewComment);
router.get('/destinations/comment/:destination_id', orderController.ViewDestinationComment)
router.post('/destinations/comment', desController.addComment)
router.put('/destinations/comment/', orderController.EditDestinationComment)
router.delete('/destinations/comment/:user_id/:destination_id', orderController.DeleteDestinationComment)
router.get('/comment/user/:user_id', desController.GetUsersFromDestinationReview)
router.put('/:booking_id/changestatus', orderController.BookingStatusChange);
router.put('/:booking_id/cancel', orderController.CancelBooking);
router.post('/ordering', orderController.PlaceOrder);
router.put('/profileEditing', orderController.EditProfile);
router.get('/profile/:user_id', orderController.ViewProfile);
router.put('/editbooking', orderController.EditBooking);
router.get('/checkuserreview/:user_id/:destination_id', desController.checkDestinationReview);
router.get('/checkhotelreview/:user_id/:hotel_id', hotelController.checkHotelReview);
router.get('/checkloving/:user_id/:destination_id', orderController.CheckLovingList);
// router.get('/:type/browsing', authenticate, orderController.Browse); 
// router.get('/browsing/:location', authenticate, orderController.Browse);
// router.get('/feebrowsing/:fee', authenticate, orderController.Browse);
router.get('/browsing', orderController.Browse)  // need query parameter : type= and ...=
router.put('/change-password',orderController.UpdatePassword)
router.post('/send-reset-email',orderController.sendEmail)
router.post('/reset-password',orderController.updatePasswordBasedEmail)
module.exports = router;


