// src/models/Saving.js

const mongoose = require('mongoose')

const savingSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    savingId: {
        type: String,
        required: true,
        unique: true,
    },

    title: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    type: {
        type: String,
        enum: ['Bank', 'Cash', 'FD', 'Other'],
        required: true,
    },

    note: {
        type: String,
        default: '',
    },

    date: {
        type: Date,
        required: true,
    },
},
{ timestamps: true }
)

module.exports = mongoose.model('Saving', savingSchema)
