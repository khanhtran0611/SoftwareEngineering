const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { validateRoomData } = require('../middleware/validation');
const { authenticateOwner } = require('../middleware/auth');
const multer = require('multer')

const storage = multer.diskStorage({
  destination: 'src\\public',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

router.post('/:user_id/rooms', 
  authenticateOwner, 
  validateRoomData, 
  roomController.addRoom
);

module.exports = router;