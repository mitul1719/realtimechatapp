const { createGroup, renameGroup, removeFromGroup, addToGroup, accessChat, fetchChats } = require('../controllers/chatController')
const { checkAuth } = require('../middlewares/authMiddleware')

const router = require('express').Router()

router.get('/', checkAuth, fetchChats)
router.get('/:id', checkAuth, accessChat)
router.post('/group', checkAuth, createGroup)
router.put('/rename', checkAuth, renameGroup)
router.delete('/groupremove', checkAuth, removeFromGroup)
router.post('/groupadd', checkAuth, addToGroup)

module.exports = router
