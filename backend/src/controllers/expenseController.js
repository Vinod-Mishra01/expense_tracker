const Expense = require('../models/Expense')

// CREATE
exports.createExpense = async (req, res) => {
    try {
        const count = await Expense.countDocuments({
            userId: req.user.id,
        })

        const expenseId = `EXP${String(count + 1).padStart(3, '0')}`

        const expense = new Expense({
            userId: req.user.id,
            expenseId,
            title: req.body.title,
            amount: req.body.amount,
            category: req.body.category,
            detail: req.body.detail,
            date: req.body.date,
            paymentMethod: req.body.paymentMethod,
            remark: req.body.remark,
        })

        await expense.save()

        res.status(201).json({
            message: 'Expense created',
            expense,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

// LIST
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({
            userId: req.user.id,
        }).sort({ date: -1 })

        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

exports.updateExpense = async (req, res) => {
    try {
        const updated = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// DELETE
exports.deleteExpense = async (req, res) => {
    try {
        const deletedExpense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        })

        if (!deletedExpense) {
            return res.status(404).json({
                message: 'Expense not found',
            })
        }

        res.status(200).json({
            message: 'Expense deleted successfully',
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}