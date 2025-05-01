const express = require('express')
const router = express.Router()
const RoomController = require('../controllers/RoomController')

// Thêm phòng mới cho khách sạn
router.post('/hotels/:hotel_id/rooms', RoomController.AddNewRoom)

// Cập nhật thông tin phòng
router.put('/rooms/:room_id', RoomController.EditRoomInfo)

module.exports = router 