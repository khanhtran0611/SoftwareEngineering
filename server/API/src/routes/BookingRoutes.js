const express = require('express')
const router = express.Router()
const BookingController = require('../controllers/BookingController');
const { BookingRoom } = require('../config/db/queries');



// Chấp nhận booking
router.get('/bookings/owner/:user_id',BookingController.ViewBooking)


// Từ chối booking

router.get('/check-booking-status/:room_id',BookingController.CheckBookingStatus)

module.exports = router 