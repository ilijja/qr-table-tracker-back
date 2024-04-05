const express = require('express')
const mapController = require('../controllers/map')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.post('/',isAuth, mapController.addMap )
router.get('/', isAuth, mapController.getMap)
router.put('/', isAuth, mapController.editMap)

module.exports = router