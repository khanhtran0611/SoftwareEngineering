const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { validateRoomData } = require('../middleware/validation');
const { authenticateOwner } = require('../middleware/auth');

router.post('/:user_id/rooms', 
  authenticateOwner, 
  validateRoomData, 
  roomController.addRoom
);

module.exports = router;