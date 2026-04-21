const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const {
    createExpense,
    getExpenses,
    deleteExpense,
    updateExpense
} = require('../controllers/expenseController')

router.post('/create', authMiddleware, createExpense)

router.get('/list', authMiddleware, getExpenses)

router.put('/update/:id', authMiddleware, updateExpense)

router.delete('/delete/:id', authMiddleware, deleteExpense)

module.exports = router