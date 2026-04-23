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
        const { message } = req.body
        const userId = req.user.id

        const expenses =
            await Expense.find({ userId })

        const savings =
            await Saving.find({ userId })

        const salaries =
            await Salary.find({ userId })

        const borrow =
            await BorrowLend.find({ userId })

        const totalExpense =
            expenses.reduce(
                (a, b) =>
                    a +
                    Number(
                        b.amount || 0,
                    ),
                0,
            )

        const totalSaving =
            savings.reduce(
                (a, b) =>
                    a +
                    Number(
                        b.amount || 0,
                    ),
                0,
            )

        const totalSalary =
            salaries.reduce(
                (a, b) =>
                    a +
                    Number(
                        b.netSalary ||
                            0,
                    ),
                0,
            )

        const pendingBorrow =
            borrow.reduce(
                (a, b) =>
                    a +
                    Number(
                        b.pendingAmount ||
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

User financial summary:
Total Salary: ₹${totalSalary}
Total Expense: ₹${totalExpense}
Total Savings: ₹${totalSaving}
Pending Borrow/Lend: ₹${pendingBorrow}
Estimated Balance: ₹${balance}

User Question:
${message}

Rules:
1. If finance question, answer from summary.
2. Keep answer short.
3. If general question, answer normally.
`

        const chat =
            await groq.chat.completions.create(
                {
                    messages: [
                        {
                            role: 'user',
                            content:
                                prompt,
                        },
                    ],
                    model:
                        'llama3-70b-8192',
                },
            )

        const reply =
            chat.choices[0]
                .message
                .content

        res.json({
            reply,
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            reply:
                'AI reply failed',
        })
    }
}

module.exports = {
    askAi,
}