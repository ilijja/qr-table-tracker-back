const express = require('express')
const orderController = require('../controllers/order')

const router = express.Router()

router.post('/accept', orderController.acceptOrders)
router.post('/:tableId', orderController.takeOrder)

module.exports = router