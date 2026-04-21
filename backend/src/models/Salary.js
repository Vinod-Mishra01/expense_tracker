const mongoose = require('mongoose')

const salarySchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    month: String,

    year: Number,

    grossSalary: Number,

    deduction: Number,

    netSalary: Number,

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