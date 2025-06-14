const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');
const serviceController = require('../controllers/ServiceController')

const jwt = require('jsonwebtoken');


// Route để tạo khách sạn mới
// router.post('/', hotelController.createHotel);

// // Route để lấy danh sách khách sạn
router.get('/owner/:user_id',hotelController.getAllHotels);

// ... existing code ...
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

router.post('/rec_hotel', hotelController.processNearbyHotel)

module.exports = router; 