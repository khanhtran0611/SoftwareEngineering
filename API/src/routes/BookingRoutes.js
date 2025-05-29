const express = require('express')
const router = express.Router()
const BookingController = require('../controllers/BookingController');
const { BookingRoom } = require('../config/db/queries');

function authenticate(req, res, next){
    const token = req.cookies.access_token; // Bearer <token>
    console.log(token)
    if (!token) return res.status(401).json({status : 4, message: 'Thiếu token' });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({status : 4, message: 'Token không hợp lệ hoặc đã hết hạn' });
        req.user = user;
        next(); // đi tiếp
    });
}

// Chấp nhận booking
router.get('/bookings/owner/:user_id',BookingController.ViewBooking)
router.get('bookings/pending',BookingController.ViewPendingBooking)
router.put('/bookings/:booking_id/accept',BookingController.AcceptBooking)

// Từ chối booking
router.get('/bookings/cancel/',BookingController.ViewCancelBooking)
router.put('/bookings/:booking_id/reject', BookingController.RejectBooking)

module.exports = router 