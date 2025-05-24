const express = require('express')
const router = express.Router()
const DestinationController = require('../controllers/DestinationController')
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
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({status : 4, message: 'Thiếu token' });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({status : 4, message: 'Token không hợp lệ hoặc đã hết hạn' });
        req.user = user;
        next(); // đi tiếp
    });
}

const uploadFields = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
  { name: 'certificate', maxCount: 1 }
]);

// Routes cho quản lý điểm đến
router.post('/',authenticate,upload.single('thumbnail'), DestinationController.AddDestination)
router.put('/:destination_id',upload.single('thumbnail'),authenticate, DestinationController.UpdateDestination)
router.delete('/:destination_id',authenticate, DestinationController.DeleteDestination)
router.get('/',authenticate, DestinationController.GetAllDestinations)
router.get('/:destination_id',authenticate, DestinationController.GetDestinationDetail)
router.get('/images/:destination_id',authenticate,DestinationController.GetDestinationImage)
router.post('/images/:destination_id',authenticate,uploadFields,DestinationController.UpdateDestinationImage)
module.exports = router 
