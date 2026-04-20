const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    expenseId: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    detail: {
        type: String,
        default: ''
    },

    date: {
        type: Date,
        required: true
    },

    paymentMethod: {
        type: String,
        default: 'Online'
    },

    remark: {
        type: String,
        default: ''
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('Expense', expenseSchema)