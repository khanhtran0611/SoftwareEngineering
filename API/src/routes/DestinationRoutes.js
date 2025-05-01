const express = require('express')
const router = express.Router()
const DestinationController = require('../controllers/DestinationController')

// Routes cho quản lý điểm đến
router.post('/', DestinationController.AddDestination)
router.put('/:destination_id', DestinationController.UpdateDestination)
router.delete('/:destination_id', DestinationController.DeleteDestination)
router.get('/', DestinationController.GetAllDestinations)
router.get('/:destination_id', DestinationController.GetDestinationDetail)

module.exports = router 