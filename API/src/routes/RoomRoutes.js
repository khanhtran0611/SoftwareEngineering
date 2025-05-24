const express = require('express')
const router = express.Router()
const RoomController = require('../controllers/RoomController')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = 'public\\img';
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const dest = 'src\\public\\img';
    const originalName = file.originalname;
    const filePath = path.join(dest, originalName);

    // ❗ Nếu file đã tồn tại, xóa nó
    if (fs.existsSync(filePath)) {
      console.log(`Đã tồn tại: ${filePath}, đang xóa...`);
      fs.unlinkSync(filePath); // Xóa ảnh cũ
    }
    // ✅ Lưu file với đúng tên
    cb(null, originalName);
  }
});
const upload = multer({ storage });

function authenticate(req, res, next){
    const token = req.cookies.access_token; // Bearer <token>
    if (!token) return res.status(401).json({status : 4, message: 'Thiếu token' });
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({status : 4, message: 'Token không hợp lệ hoặc đã hết hạn' });
    
        req.user = user;
        next(); // đi tiếp
    });
}


// Thêm phòng mới cho khách sạn
router.post('/hotels/:hotel_id/rooms',authenticate, RoomController.AddNewRoom)

// Cập nhật thông tin phòng
router.put('/rooms/:room_id',authenticate, RoomController.EditRoomInfo)

router.get('/rooms/:room_id',authenticate,upload.single('thumbnail'), RoomController.ViewRoomDetail)

module.exports = router 