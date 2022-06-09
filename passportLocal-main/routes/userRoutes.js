const router = require('express').Router()
const userController = require('../controllers/useControllers')
// Post Routes
router.post('/register', userController.createUser)
router.post('/login', userController.LoginUser)
router.get('/logout', userController.LogoutUser)

module.exports = router
