const express = require('express')
const router = express.Router()
const DestinationController = require('../controllers/DestinationController')
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer')
const uploadPath = process.env.IMAGE_STORGAGE + '/destinations'
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


router.post('/upload-destination-image', upload.single('image'), (req, res) => {
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
            filename: '/destinations/' + req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            status: 0,
            message: 'Lỗi khi upload ảnh: ' + error.message
        });
    }
});



router.delete('/delete-destination-image/:filename', (req, res) => {
    try {
        // if(!filename){
        //   return res.status(404).json({
        //     status: 0,
        //     message: 'File không tồn tại'
        // });
        // }
        const filename = req.params.filename;
        console.log(uploadPath)
        const filepath = path.join(uploadPath, filename);
        console.log(filepath)
        if (!fs.existsSync(filepath)) {
            console.log("Not exist")
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

// function authenticate(req, res, next){
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
//     if (!token) return res.status(401).json({status : 4, message: 'Thiếu token' });
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.status(403).json({status : 4, message: 'Token không hợp lệ hoặc đã hết hạn' });
//         req.user = user;
//         next(); // đi tiếp
//     });
// }

const uploadFields = upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
]);

// Routes cho quản lý điểm đến
router.post('/', DestinationController.AddDestination)
router.put('/:destination_id', DestinationController.UpdateDestination)
router.delete('/:destination_id', DestinationController.DeleteDestination)
router.get('/', DestinationController.GetAllDestinations)
router.get('/api/filter', DestinationController.FilterDestination)
router.get('/:destination_id', DestinationController.GetDestinationDetail)
router.get('/images/:destination_id', DestinationController.GetDestinationImage)
router.post('/images/:destination_id', uploadFields, DestinationController.UpdateDestinationImage)


router.post('/create-destination-image', DestinationController.AddDestinationImage)
router.delete('/delete-destination-image-db/:images_id', DestinationController.DeleteDestinationImage)
router.put('/update-destination-image-db/:images_id', DestinationController.UpdateDestinationImage)

router.post("/destination/recommend", DestinationController.GetRecommendedDestinations);

module.exports = router 
