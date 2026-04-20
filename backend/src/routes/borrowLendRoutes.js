// src/routes/borrowLendRoutes.js

const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord,
} = require('../controllers/borrowLendController')

router.post(
    '/create',
    authMiddleware,
    createRecord
)

router.get(
    '/list',
    authMiddleware,
    getRecords
)

router.put(
    '/update/:id',
    authMiddleware,
    updateRecord
)

router.delete(
    '/delete/:id',
    authMiddleware,
    deleteRecord
)

module.exports = router