const { sendMessage, allMessages } = require('../controllers/messageController')
const { checkAuth } = require('../middlewares/authMiddleware')

const router = require('express').Router()

router.post('/', checkAuth, sendMessage)
router.get('/:chatId', checkAuth, allMessages)

module.exports = router
