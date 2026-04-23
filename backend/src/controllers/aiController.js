const Groq = require('groq-sdk')

const Expense = require('../models/Expense')
const Saving = require('../models/Saving')
const Salary = require('../models/Salary')
const BorrowLend = require('../models/BorrowLend')

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

const askAi = async (req, res) => {
    try {
        console.log(
            process.env.GROQ_API_KEY
                ? 'GROQ KEY OK'
                : 'NO GROQ KEY',
        )

        const { message } = req.body
        const userId = req.user.id

        const expenses = await Expense.find({ userId })
        const savings = await Saving.find({ userId })
        const salaries = await Salary.find({ userId })
        const borrow = await BorrowLend.find({ userId })

        const totalExpense = expenses.reduce(
            (a, b) => a + Number(b.amount || 0),
            0,
        )

        const totalSaving = savings.reduce(
            (a, b) => a + Number(b.amount || 0),
            0,
        )

        const totalSalary = salaries.reduce(
            (a, b) => a + Number(b.netSalary || 0),
            0,
        )

        const pendingBorrow = borrow.reduce(
            (a, b) =>
                a +
                Number(
                    b.pendingAmount ||
                        b.amount ||
                        0,
                ),
            0,
        )

        const balance =
            totalSalary +
            totalSaving -
            totalExpense -
            pendingBorrow

        const prompt = `
You are a smart finance assistant.

Salary: ₹${totalSalary}
Expense: ₹${totalExpense}
Savings: ₹${totalSaving}
Borrow Pending: ₹${pendingBorrow}
Balance: ₹${balance}

Question:
${message}

Reply short and clear.
`

        const chat =
            await groq.chat.completions.create({
                model: 'llama3-8b-8192',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
            })

        const reply =
            chat?.choices?.[0]
                ?.message?.content ||
            'No reply found'

        res.json({ reply })
    } catch (error) {
        console.log('AI ERROR:', error)

        res.status(500).json({
            reply:
                error.message ||
                'AI reply failed',
        })
    }
}

module.exports = { askAi }