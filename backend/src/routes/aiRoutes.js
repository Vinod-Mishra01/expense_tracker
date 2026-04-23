const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const { askAi } = require('../controllers/aiController')

router.post('/chat', authMiddleware, askAi)

module.exports = router