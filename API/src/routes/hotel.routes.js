const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');
const serviceController = require('../controllers/ServiceController')

const jwt = require('jsonwebtoken');

function authenticate(req, res, next){
    const token = req.cookies.access_token; // Bearer <token> // Bearer <token>
    if (!token) return res.status(401).json({status : 4, message: 'Thiếu token' });
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({status : 4, message: 'Token không hợp lệ hoặc đã hết hạn' });
    
        req.user = user;
        next(); // đi tiếp
    });
}
// Route để tạo khách sạn mới
router.post('/',authenticate, hotelController.createHotel);

// Route để lấy danh sách khách sạn
router.get('/',authenticate, hotelController.getAllHotels);

// ... existing code ...
router.put('/arround',authenticate, hotelController.updateHotelArround);
router.put('/facility',authenticate,hotelController.updateHotelFacilities);
router.put('/service',authenticate,hotelController.updateRoomService);
router.get('/hotel-facilities/:hotel_id',authenticate,hotelController.getHotelFacilities)      // for hotel owner
router.get('/room-services/:room_id',authenticate,hotelController.getRoomServices)         // for hotel owner
router.get('/nearby/:hotel_id',authenticate,hotelController.getNearbyDestination)          // for hotel owne

router.put('/facility-edit',authenticate,serviceController.UpdateFacility);
router.get('/facility',authenticate,serviceController.ViewFacility);
router.put('/service-edit',authenticate,serviceController.UpdateService);
router.get('/service',authenticate,serviceController.ViewService);

module.exports = router; 