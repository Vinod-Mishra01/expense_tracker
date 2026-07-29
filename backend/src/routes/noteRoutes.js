const express = require('express')
const router = express.Router()

const auth = require('../middleware/authMiddleware')

const {
    createNote,
    getNotes,
    updateNote,
    deleteNote,
} = require('../controllers/noteController')

router.post('/create', auth, createNote)
router.get('/list', auth, getNotes)
router.put('/update/:id', auth, updateNote)
router.delete('/delete/:id', auth, deleteNote)

module.exports = router