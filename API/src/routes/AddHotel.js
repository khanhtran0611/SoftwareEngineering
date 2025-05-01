const express = require('express')
const router = express.Router()
const AddHotelController = require('../controllers/AddHotelController')

router.post('/add-hotel', AddHotelController.AddNewHotel)
router.delete('/hotels/:hotel_id', AddHotelController.RemoveHotel)
router.get('/hotels/:hotel_id', AddHotelController.ViewHotelDetail)
router.put('/hotels/:hotel_id', AddHotelController.EditHotelInfo)

module.exports = router 