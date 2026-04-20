// src/controllers/savingController.js

const Saving = require('../models/Saving')

const createSaving = async (req, res) => {
    try {
        const { title, amount, type, note, date } = req.body

        if (!title || !amount || !type || !date) {
            return res.status(400).json({
                message: 'All required fields missing',
            })
        }

        const savingId =
            'SAV' + Date.now()

        const saving = await Saving.create({
            userId: req.user.id,
            savingId,
            title,
            amount,
            type,
            note,
            date,
        })

        res.status(201).json(saving)
    } catch (error) {
        res.status(500).json({
            message: 'Create saving failed',
        })
    }
}

const getSavings = async (req, res) => {
    try {
        const data = await Saving.find({
            userId: req.user.id,
        }).sort({ createdAt: -1 })

        res.json(data)
    } catch (error) {
        res.status(500).json({
            message: 'Fetch failed',
        })
    }
}

const updateSaving = async (req, res) => {
    try {
        const updated =
            await Saving.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.user.id,
                },
                req.body,
           { returnDocument :'after' }
            )

        res.json(updated)
    } catch (error) {
        res.status(500).json({
            message: 'Update failed',
        })
    }
}

const deleteSaving = async (req, res) => {
    try {
        await Saving.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        })

        res.json({
            message: 'Deleted',
        })
    } catch (error) {
        res.status(500).json({
            message: 'Delete failed',
        })
    }
}

module.exports = {
    createSaving,
    getSavings,
    updateSaving,
    deleteSaving,
}