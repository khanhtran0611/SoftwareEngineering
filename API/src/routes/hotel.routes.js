const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');

// Route để tạo khách sạn mới
router.post('/', hotelController.createHotel);

// Route để lấy danh sách khách sạn
router.get('/', hotelController.getAllHotels);

// ... existing code ...
router.put('/arround', hotelController.updateHotelArround);

module.exports = router; 