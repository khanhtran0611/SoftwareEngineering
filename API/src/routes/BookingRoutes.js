const express = require('express')
const router = express.Router()
const BookingController = require('../controllers/BookingController');
const { BookingRoom } = require('../config/db/queries');

function authenticate(req, res, next){
    const token = req.cookies.access_token; // Bearer <token>
    if (!token) return res.status(401).json({status : 4, message: 'Thiếu token' });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({status : 4, message: 'Token không hợp lệ hoặc đã hết hạn' });
        req.user = user;
        next(); // đi tiếp
    });
}

// Chấp nhận booking
router.get('bookings/pending',authenticate,BookingController.ViewPendingBooking)
router.put('/bookings/:booking_id/accept',authenticate, BookingController.AcceptBooking)

// Từ chối booking
router.get('/bookings/cancel/',authenticate,BookingController.ViewCancelBooking)
router.put('/bookings/:booking_id/reject',authenticate, BookingController.RejectBooking)

module.exports = router 