const { GoogleGenerativeAI } = require('@google/generative-ai')

const Expense = require('../models/Expense')
const Saving = require('../models/Saving')
const Salary = require('../models/Salary')
const BorrowLend = require('../models/BorrowLend')

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
)

const askAi = async (req, res) => {
    try {
        const { message } = req.body

        const userId = req.user.id

        const expenses = await Expense.find({ userId })
        const savings = await Saving.find({ userId })
        const salaries = await Salary.find({ userId })
        const borrow = await BorrowLend.find({ userId })

        const totalExpense = expenses.reduce(
            (a, b) => a + Number(b.amount || 0),
            0
        )

        const totalSaving = savings.reduce(
            (a, b) => a + Number(b.amount || 0),
            0
        )

        const totalSalary = salaries.reduce(
            (a, b) => a + Number(b.netSalary || 0),
            0
        )

        const pendingBorrow = borrow.reduce(
            (a, b) => a + Number(b.pendingAmount || 0),
            0
        )

        const balance =
            totalSalary +
            totalSaving -
            totalExpense -
            pendingBorrow

        const prompt = `
You are a smart finance assistant.

User financial summary:
Total Salary: ₹${totalSalary}
Total Expense: ₹${totalExpense}
Total Savings: ₹${totalSaving}
Pending Borrow/Lend: ₹${pendingBorrow}
Estimated Balance: ₹${balance}

User Question:
${message}

Rules:
1. If question is about finance data, answer using above summary.
2. If question asks date-wise expense and not enough exact data, politely say detailed search feature can be added next.
3. If general question, answer normally.
4. Keep answer short and clear.
`

        const model =
            genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
            })

        const result =
            await model.generateContent(prompt)

        const reply =
            result.response.text()

        res.json({
            reply,
        })
    } catch (error) {
        res.status(500).json({
            reply: 'AI reply failed',
        })
    }
}

module.exports = { askAi }