const express = require('express')
const router = express.Router()
const AddHotelController = require('../controllers/AddHotelController')
const jwt = require('jsonwebtoken');
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = 'src\\public\\img';
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const dest = 'public\\img';
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
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({status : 4, message: 'Token không hợp lệ hoặc đã hết hạn' });
        req.user = user;
        next(); // đi tiếp
    });
}

router.post('/add-hotel',authenticate,upload.single('thumbnail'), AddHotelController.AddNewHotel)
router.delete('/hotels/:hotel_id',authenticate, AddHotelController.RemoveHotel)
router.get('/hotels/:hotel_id',authenticate, AddHotelController.ViewHotelDetail)
router.put('/hotels/:hotel_id',authenticate,upload.single('thumbnail'), AddHotelController.EditHotelInfo)


module.exports = router 


