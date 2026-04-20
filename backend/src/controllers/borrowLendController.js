// src/controllers/borrowLendController.js

const BorrowLend = require('../models/BorrowLend')

const createRecord = async (req, res) => {
    try {
        const {
            type,
            personName,
            amount,
            paidAmount,
            note,
            date,
        } = req.body

        if (
            !type ||
            !personName ||
            !amount ||
            !date
        ) {
            return res.status(400).json({
                message:
                    'Required fields missing',
            })
        }

        const total =
            Number(amount)

        const paid =
            Number(
                paidAmount || 0,
            )

        const pending =
            total - paid

        const status =
            pending <= 0
                ? 'Completed'
                : 'Pending'

        const record =
            await BorrowLend.create({
                userId:
                    req.user.id,
                recordId:
                    'BL' +
                    Date.now(),
                type,
                personName,
                amount:
                    total,
                paidAmount:
                    paid,
                pendingAmount:
                    pending,
                status,
                note,
                date,
            })

        res.status(201).json(
            record,
        )
    } catch (error) {
        res.status(500).json({
            message:
                'Create failed',
        })
    }
}

const getRecords = async (
    req,
    res,
) => {
    try {
        const data =
            await BorrowLend.find({
                userId:
                    req.user.id,
            }).sort({
                createdAt: -1,
            })

        res.json(data)
    } catch {
        res.status(500).json({
            message:
                'Fetch failed',
        })
    }
}

const updateRecord = async (
    req,
    res,
) => {
    try {
        const {
            amount,
            paidAmount,
        } = req.body

        const total =
            Number(amount)

        const paid =
            Number(
                paidAmount || 0,
            )

        const pending =
            total - paid

        req.body.pendingAmount =
            pending

        req.body.status =
            pending <= 0
                ? 'Completed'
                : 'Pending'

        const updated =
            await BorrowLend.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId:
                        req.user.id,
                },
                req.body,
                {
                    returnDocument:
                        'after',
                },
            )

        res.json(updated)
    } catch {
        res.status(500).json({
            message:
                'Update failed',
        })
    }
}

const deleteRecord = async (
    req,
    res,
) => {
    try {
        await BorrowLend.findOneAndDelete(
            {
                _id: req.params.id,
                userId:
                    req.user.id,
            },
        )

        res.json({
            message:
                'Deleted',
        })
    } catch {
        res.status(500).json({
            message:
                'Delete failed',
        })
    }
}

module.exports = {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord,
}