const express = require('express')
const guestController = require('../controllers/guest')

const router = express.Router()

router.get('/:id', guestController.getMenus)
router.get('/menu/:menuId', guestController.getMenu)
router.get('/order/:id', guestController.getOrder)

module.exports = router