// src/models/BorrowLend.js

const mongoose = require('mongoose')

const borrowLendSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    recordId: {
        type: String,
        required: true,
        unique: true,
    },

    type: {
        type: String,
        enum: ['Borrow', 'Lend'],
        required: true,
    },

    personName: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    paidAmount: {
        type: Number,
        default: 0,
    },

    pendingAmount: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },

    note: {
        type: String,
        default: '',
    },

    date: {
        type: Date,
        required: true,
    },

    // ✅ New field
    returnDate: {
        type: Date,
        default: null, // or required: true if you always need it
    },
},
{ timestamps: true }
)

module.exports = mongoose.model('BorrowLend', borrowLendSchema)