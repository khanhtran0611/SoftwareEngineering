const orderController = require('../controllers/OrderController.js')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');

/*
function authenticate(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Thiếu token' });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        req.user = user;
        next(); // đi tiếp
    });
}*/


router.get('/bookingView',orderController.viewOrder);
router.post('/addloving',orderController.SaveTolovingList);
router.get('/loving',orderController.viewLovingList);
router.delete('/deleteloving', orderController.DeleteLovingList);
router.get('/destinations', orderController.viewDestination);
router.get('/:destination_id/destinationInfo', orderController.viewDestination2);
router.get('/:hotel_id/hotels', orderController.viewHotels);
router.post('/commenting', orderController.addComment);
router.put('/:booking_id/cancel_requested', orderController.RequestcancelBooking);
router.put('/:booking_id/cancel', orderController.CancelBooking);
router.post('/:ordering', orderController.PlaceOrder);
router.put('/profileEditing', orderController.EditProfile);
router.put('/editbooking', orderController.EditBooking);
router.get('/:type/browsing', orderController.BrowseTypeBased);
router.get('/browsing/:location', orderController.BrowseLocationBased);
router.get('/feebrowsing/:fee', orderController.BrowseFeeBased);

module.exports = router;


