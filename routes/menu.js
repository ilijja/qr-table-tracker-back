const express = require('express')
const menuController = require('../controllers/menu')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.post('/', isAuth, menuController.addMenu)
router.delete('/:id', isAuth, menuController.deleteMenu)
router.get('/', isAuth, menuController.getMenus)
router.get('/:menuId', isAuth, menuController.getCategories)

router.post('/category', isAuth,  menuController.addCategory)
router.put('/category/:categoryId', isAuth, menuController.updateCategory)
router.delete('/category/:categoryId', isAuth, menuController.deleteCategory)

router.post('/product', isAuth, menuController.addProduct)
router.delete('/product/:productId', isAuth, menuController.deleteProduct)
router.put('/product', isAuth, menuController.updateProduct)


module.exports = router;
