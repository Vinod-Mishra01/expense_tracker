const mongoose = require('mongoose')

const salarySchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    month: String,

    year: Number,

    date: Date,

    grossSalary: Number,

    deduction: Number,

    netSalary: Number,

    extraIncome: {
        type: Number,
        default: 0,
    },

    extraSource: {
        type: String,
        default: '',
    },

    slipFile: String,

    note: String,
},
{
    timestamps: true,
},
)

module.exports = mongoose.model(
    'Salary',
    salarySchema,
)