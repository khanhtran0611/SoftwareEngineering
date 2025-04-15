const orderController = require('../controllers/OrderController.js')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');

function authenticate(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Thiếu token' });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        req.user = user;
        next(); // đi tiếp
    });
}


router.get('/bookingView', authenticate, orderController.viewOrder);
router.post('/addloving', authenticate, orderController.SaveTolovingList);
router.get('/loving', authenticate, orderController.viewLovingList);
router.delete('/deleteloving', authenticate, orderController.DeleteLovingList);
router.get('/destinations', authenticate, orderController.viewDestination);
router.get('/:destination_id/destinationInfo', authenticate, orderController.viewDestination2);
router.get('/:hotel_id/hotels', authenticate, orderController.viewHotels);
router.post('/commenting', authenticate, orderController.addComment);
router.put('/:booking_id/cancel_requested', authenticate, orderController.RequestcancelBooking);
router.put('/:booking_id/cancel', authenticate, orderController.CancelBooking);
router.post('/:ordering', authenticate, orderController.PlaceOrder);
router.put('/profileEditing', authenticate, orderController.EditProfile);
router.put('/editbooking', authenticate, orderController.EditBooking);
router.get('/:type/browsing', authenticate, orderController.BrowseTypeBased);
router.get('/browsing/:location', authenticate, orderController.BrowseLocationBased);
router.get('/feebrowsing/:fee', authenticate, orderController.BrowseFeeBased);

module.exports = router;


