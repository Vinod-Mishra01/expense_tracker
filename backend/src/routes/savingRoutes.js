// src/routes/savingRoutes.js

const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const {
    createSaving,
    getSavings,
    updateSaving,
    deleteSaving,
} = require('../controllers/savingController')

router.post(
    '/create',
    authMiddleware,
    createSaving
)

router.get(
    '/list',
    authMiddleware,
    getSavings
)

router.put(
    '/update/:id',
    authMiddleware,
    updateSaving
)

router.delete(
    '/delete/:id',
    authMiddleware,
    deleteSaving
)

module.exports = router