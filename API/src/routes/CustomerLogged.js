const orderController = require('../controllers/OrderController.js')
const hotelController = require('../controllers/HotelController.js')
const desController = require('../controllers/DesController.js')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require('path');
const fs = require('fs');
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


router.get('/bookings', authenticate, orderController.viewOrder);
router.post('/addloving', authenticate, desController.SaveTolovingList);
router.get('/loving', authenticate, desController.viewLovingList);
router.delete('/deleteloving', authenticate, desController.DeleteLovingList);
router.get('/destinations', authenticate, desController.viewAllDestination);
router.get('/destinationInfo', authenticate, desController.viewDestination);  // need query parameter : destination_id
router.get('/hotels', authenticate, hotelController.viewHotels);  // need query parameter : hotel_id
router.post('/commenting', authenticate, hotelController.addComment);
router.get('/comments/:hotel_id',orderController.ViewComment)
router.get('/destinations/comment/:destination_id',orderController.ViewDestinationComment)
router.put('/:booking_id/cancel_requested', authenticate, orderController.RequestcancelBooking);
router.put('/:booking_id/cancel', authenticate, orderController.CancelBooking);
router.post('/ordering', authenticate, orderController.PlaceOrder);
router.put('/profileEditing', authenticate, orderController.EditProfile);
router.get('/profile', authenticate,orderController.ViewProfile);
router.put('/editbooking', authenticate,upload.single('profile_image'), orderController.EditBooking);
// router.get('/:type/browsing', authenticate, orderController.Browse); 
// router.get('/browsing/:location', authenticate, orderController.Browse);
// router.get('/feebrowsing/:fee', authenticate, orderController.Browse);
router.get('/browsing',authenticate,orderController.Browse)  // need query parameter : type= and ...=

module.exports = router;


