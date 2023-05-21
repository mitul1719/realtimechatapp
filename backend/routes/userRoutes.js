const { registerUser, loginUser, googleLogin, getAllUsers } = require('../controllers/userController')
const { checkAuth } = require('../middlewares/authMiddleware')

const router = require('express').Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/socialLogin', googleLogin)
router.get('/all', checkAuth, getAllUsers)

module.exports = router
