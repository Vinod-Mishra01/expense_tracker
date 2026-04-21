const express = require('express')
const router = express.Router()

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const auth = require('../middleware/authMiddleware')

const {
    createSalary,
    getSalary,
    deleteSalary,
} = require('../controllers/salaryController')

/* create folder if not exists */
const uploadPath =
    'uploads/salary'

if (
    !fs.existsSync(
        uploadPath,
    )
) {
    fs.mkdirSync(
        uploadPath,
        {
            recursive: true,
        },
    )
}

/* multer storage */
const storage =
    multer.diskStorage({
        destination:
            (
                req,
                file,
                cb,
            ) => {
                cb(
                    null,
                    uploadPath,
                )
            },

        filename:
            (
                req,
                file,
                cb,
            ) => {
                const fileName =
                    Date.now() +
                    '-' +
                    Math.round(
                        Math.random() *
                            1000000,
                    ) +
                    path.extname(
                        file.originalname,
                    )

                cb(
                    null,
                    fileName,
                )
            },
    })

/* file filter */
const fileFilter =
    (
        req,
        file,
        cb,
    ) => {
        const allowed =
            [
                '.pdf',
                '.jpg',
                '.jpeg',
                '.png',
            ]

        const ext =
            path.extname(
                file.originalname,
            )
                .toLowerCase()

        if (
            allowed.includes(
                ext,
            )
        ) {
            cb(
                null,
                true,
            )
        } else {
            cb(
                new Error(
                    'Only PDF / JPG / PNG allowed',
                ),
            )
        }
    }

/* multer upload */
const upload =
    multer({
        storage,
        fileFilter,
        limits: {
            fileSize:
                5 *
                1024 *
                1024,
        },
    })

/* routes */

/* create salary */
router.post(
    '/create',
    auth,
    upload.single(
        'slipFile',
    ),
    createSalary,
)

/* get all salary */
router.get(
    '/list',
    auth,
    getSalary,
)

/* delete salary */
router.delete(
    '/delete/:id',
    auth,
    deleteSalary,
)

module.exports =
    router