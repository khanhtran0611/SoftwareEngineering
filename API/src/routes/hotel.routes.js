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
// router.post('/', hotelController.createHotel);

// // Route để lấy danh sách khách sạn
router.get('/owner/:user_id',hotelController.getAllHotels);

// ... existing code ...
router.put('/arround',hotelController.updateHotelArround);
router.put('/facility',hotelController.updateHotelFacilities);
router.put('/service',hotelController.updateRoomService);
router.get('/hotel-facilities/:hotel_id',hotelController.getHotelFacilities)      // for hotel owner
router.get('/room-services/:room_id',hotelController.getRoomServices)         // for hotel owner
router.get('/nearby/:hotel_id',hotelController.getNearbyDestination)    
router.get('/allfacilities',serviceController.getAllFacilities)      // for hotel owne
router.get('/allservices',serviceController.getAllServices)  // for hotel owner


router.post('/facility-add',serviceController.AddFacility);
router.put('/facility-edit',serviceController.UpdateFacility);
router.get('/facilities/:hotel_id',serviceController.ViewFacility);
router.delete('/facility-delete/:hotel_id/:facility_id',serviceController.DeleteFacility);
router.post('/service-add',serviceController.AddService);
router.get('/services/:room_id',serviceController.ViewService);
router.delete('/service-delete/:room_id/:service_id',serviceController.DeleteService);

module.exports = router; 