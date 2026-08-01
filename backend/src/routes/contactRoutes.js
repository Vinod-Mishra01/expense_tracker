const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
// const vCardParser = require('vcard-parser')

const {
    createContact,
    getContacts,
    getContact,
    updateContact,
    deleteContact,
    toggleFavorite,
        importVCF,
} = require('../controllers/contactController')

const protect = require('../middleware/authMiddleware')

console.log('protect =>', typeof protect)
console.log('createContact =>', typeof createContact)
console.log('getContacts =>', typeof getContacts)
console.log('getContact =>', typeof getContact)
console.log('updateContact =>', typeof updateContact)
console.log('deleteContact =>', typeof deleteContact)
console.log('toggleFavorite =>', typeof toggleFavorite)

const router = express.Router()

// Upload Folder
const uploadPath = path.join(__dirname, '../../uploads/contacts')

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
}

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname)

        cb(null, uniqueName)
    },
})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})

console.log('UPLOAD PATH =>', uploadPath)

// Routes
router.post(
    '/create',
    protect,
    upload.single('photo'),
    createContact,
)

router.get(
    '/list',
    protect,
    getContacts,
) 

router.get(
    '/:id',
    protect,
    getContact,
)

router.put(
    '/update/:id',
    protect,
    upload.single('photo'),
    updateContact,
)

router.delete(
    '/delete/:id',
    protect,
    deleteContact,
)

router.patch(
    '/favorite/:id',
    protect,
    toggleFavorite,
)


router.post(
    '/import-vcf',
    (req, res, next) => {
        console.log('✅ ROUTE HIT');
        next();
    },
    protect,
    upload.single('file'),
    importVCF,
)

module.exports = router