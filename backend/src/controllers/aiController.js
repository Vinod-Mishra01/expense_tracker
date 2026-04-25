const Groq = require('groq-sdk')

const Expense = require('../models/Expense')
const Saving = require('../models/Saving')
const Salary = require('../models/Salary')
const BorrowLend = require('../models/BorrowLend')

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

const monthMap = {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
}

const getMonthYear = (msg) => {
    const text = msg.toLowerCase()

    let month = ''
    let year = ''

    Object.keys(monthMap).forEach((m) => {
        if (text.includes(m)) {
            month = monthMap[m]
        }
    })

    const yearMatch =
        text.match(/\b20\d{2}\b/)

    if (yearMatch) {
        year = yearMatch[0]
    }

    return {
        month,
        year,
    }
}

const sumAmount = (
    arr,
    field,
) => {
    return arr.reduce(
        (a, b) =>
            a +
            Number(
                b[field] || 0,
            ),
        0,
    )
}

const askAi = async (
    req,
    res,
) => {
    try {
        const { message } =
            req.body

        const userId =
            req.user.id

        const msg =
            message.toLowerCase()

        const {
            month,
            year,
        } = getMonthYear(
            message,
        )

        const commonFilter = {
            userId,
        }

        if (month) {
            commonFilter.month =
                month
        }

        if (year) {
            commonFilter.year =
                year
        }

        const expenses =
            await Expense.find(
                commonFilter,
            )

        const savings =
            await Saving.find(
                commonFilter,
            )

        const salaries =
            await Salary.find(
                commonFilter,
            )

        const borrows =
            await BorrowLend.find(
                commonFilter,
            )

        const totalExpense =
            sumAmount(
                expenses,
                'amount',
            )

        const totalSaving =
            sumAmount(
                savings,
                'amount',
            )

        const totalSalary =
            sumAmount(
                salaries,
                'netSalary',
            )

        const totalPending =
            borrows.reduce(
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
            totalPending

        /* BALANCE */
        if (
            msg.includes(
                'balance',
            )
        ) {
            return res.json({
                reply: `Your Balance: ₹${balance}`,
            })
        }

        /* EXPENSE */
        if (
            msg.includes(
                'expense',
            )
        ) {
            return res.json({
                reply: `Your Total Expense: ₹${totalExpense}`,
            })
        }

        /* SAVING */
        if (
            msg.includes(
                'saving',
            )
        ) {
            return res.json({
                reply: `Your Total Saving: ₹${totalSaving}`,
            })
        }

        /* SALARY */
        if (
            msg.includes(
                'salary',
            )
        ) {
            return res.json({
                reply: `Your Total Salary: ₹${totalSalary}`,
            })
        }

        /* BORROW */
        if (
            msg.includes(
                'borrow',
            ) ||
            msg.includes(
                'lend',
            )
        ) {
            return res.json({
                reply: `Pending Borrow/Lend: ₹${totalPending}`,
            })
        }

        /* NAME SEARCH */
        const person =
            await BorrowLend.findOne(
                {
                    userId,
                    name: {
                        $regex:
                            message,
                        $options:
                            'i',
                    },
                },
            )

        if (person) {
            return res.json({
                reply: `${person.name} related record found. Amount ₹${person.amount}`,
            })
        }

        /* FALLBACK AI */
        const prompt = `
You are finance assistant.

User Data:
Salary ₹${totalSalary}
Expense ₹${totalExpense}
Saving ₹${totalSaving}
Pending ₹${totalPending}
Balance ₹${balance}

Question:
${message}

Reply short and useful.
`

        const chat =
            await groq.chat.completions.create(
                {
                    model:
                        'llama-3.1-8b-instant',
                    messages: [
                        {
                            role: 'user',
                            content:
                                prompt,
                        },
                    ],
                },
            )

        const reply =
            chat?.choices?.[0]
                ?.message
                ?.content ||
            'No reply'

        res.json({
            reply,
        })
    } catch (error) {
        console.log(
            error,
        )

        res.status(500).json({
            reply:
                'AI reply failed',
        })
    }
}

module.exports = {
    askAi,
}