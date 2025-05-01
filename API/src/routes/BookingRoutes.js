const express = require('express')
const router = express.Router()
const BookingController = require('../controllers/BookingController')

// Chấp nhận booking
router.put('/bookings/:booking_id/accept', BookingController.AcceptBooking)

// Từ chối booking
router.put('/bookings/:booking_id/reject', BookingController.RejectBooking)

module.exports = router 