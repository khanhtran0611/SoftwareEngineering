const loginController = require('../controllers/LoginController.js')
const express = require('express')
const router2 = express.Router()
// const jwt = require('jsonwebtoken');

// function authenticate(req, res, next){
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
//     if (!token) return res.status(401).json({ message: 'Thiếu token' });
//     console.log(token)
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    
//         req.user = user;
//         next(); // đi tiếp
//     });
// }


router2.post('/signin',loginController.AddNewCustomerAccount)
router2.post('/login',loginController.Login)
router2.get('/test',loginController.returnToken)
module.exports = router2;