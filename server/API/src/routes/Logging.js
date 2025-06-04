const loginController = require('../controllers/LoginController.js')
const express = require('express')
const router2 = express.Router()
const jwt = require('jsonwebtoken');



router2.post('/signup',loginController.AddNewCustomerAccount)
router2.post('/login',loginController.Login)
router2.get('/test',loginController.returnToken)
router2.post('/check-email',loginController.checkEmail)
module.exports = router2;


