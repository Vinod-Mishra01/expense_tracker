const Groq = require('groq-sdk')

const Expense = require('../models/Expense')
const Saving = require('../models/Saving')
const Salary = require('../models/Salary')
const BorrowLend = require('../models/BorrowLend')

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

const months = {
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

const getMonthYear = (
    text,
) => {
    const msg =
        text.toLowerCase()

    let month = ''
    let year = ''

    Object.keys(
        months,
    ).forEach((m) => {
        if (
            msg.includes(
                m,
            )
        ) {
            month =
                months[m]
        }
    })

    const yearMatch =
        msg.match(
            /\b20\d{2}\b/,
        )

    if (
        yearMatch
    ) {
        year =
            yearMatch[0]
    }

    return {
        month,
        year,
    }
}

const sum = (
    arr,
    field,
) =>
    arr.reduce(
        (
            a,
            b,
        ) =>
            a +
            Number(
                b[
                    field
                ] ||
                    0,
            ),
        0,
    )

const askAi = async (
    req,
    res,
) => {
    try {
        const {
            message,
        } =
            req.body

        const userId =
            req.user.id

        const msg =
            message.toLowerCase()

        const {
            month,
            year,
        } =
            getMonthYear(
                message,
            )

        const filter =
            {
                userId,
            }

        if (
            month
        ) {
            filter.month =
                month
        }

        if (
            year
        ) {
            filter.year =
                year
        }

        const expenses =
            await Expense.find(
                filter,
            )

        const savings =
            await Saving.find(
                filter,
            )

        const salaries =
            await Salary.find(
                filter,
            )

        const borrowData =
            await BorrowLend.find(
                filter,
            )

        const totalExpense =
            sum(
                expenses,
                'amount',
            )

        const totalSaving =
            sum(
                savings,
                'amount',
            )

        const totalSalary =
            sum(
                salaries,
                'netSalary',
            )

        const totalBorrow =
            borrowData
                .filter(
                    (
                        x,
                    ) =>
                        String(
                            x.type ||
                                '',
                        )
                            .toLowerCase()
                            .includes(
                                'borrow',
                            ),
                )
                .reduce(
                    (
                        a,
                        b,
                    ) =>
                        a +
                        Number(
                            b.pendingAmount ||
                                b.amount ||
                                0,
                        ),
                    0,
                )

        const totalLend =
            borrowData
                .filter(
                    (
                        x,
                    ) =>
                        String(
                            x.type ||
                                '',
                        )
                            .toLowerCase()
                            .includes(
                                'lend',
                            ),
                )
                .reduce(
                    (
                        a,
                        b,
                    ) =>
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
            totalBorrow +
            totalLend

     /* PERSON SEARCH FIRST */
const cleanName = message
    .toLowerCase()
    .replace(
        /any|lend|borrow|from|to|pending|show|record|of|for|amount|\?/gi,
        '',
    )
    .trim()

const person =
    await BorrowLend.find({
        userId,
        name: {
            $regex:
                cleanName,
            $options:
                'i',
        },
    })

if (
    person.length >
        0 &&
    (msg.includes(
        'borrow',
    ) ||
        msg.includes(
            'lend',
        ))
) {
    const personBorrow =
        person
            .filter(
                (
                    x,
                ) =>
                    String(
                        x.type ||
                            '',
                    )
                        .toLowerCase()
                        .includes(
                            'borrow',
                        ),
            )
            .reduce(
                (
                    a,
                    b,
                ) =>
                    a +
                    Number(
                        b.pendingAmount ||
                            b.amount ||
                            0,
                    ),
                0,
            )

    const personLend =
        person
            .filter(
                (
                    x,
                ) =>
                    String(
                        x.type ||
                            '',
                    )
                        .toLowerCase()
                        .includes(
                            'lend',
                        ),
            )
            .reduce(
                (
                    a,
                    b,
                ) =>
                    a +
                    Number(
                        b.pendingAmount ||
                            b.amount ||
                            0,
                    ),
                0,
            )

    if (
        msg.includes(
            'borrow',
        )
    ) {
        return res.json({
            reply: `Borrow from ${person[0].name}: ₹${personBorrow}`,
        })
    }

    if (
        msg.includes(
            'lend',
        )
    ) {
        return res.json({
            reply: `Lend to ${person[0].name}: ₹${personLend}`,
        })
    }
}

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
        reply: `Your Expense: ₹${totalExpense}`,
    })
}

/* SAVING */
if (
    msg.includes(
        'saving',
    )
) {
    return res.json({
        reply: `Your Saving: ₹${totalSaving}`,
    })
}

/* SALARY */
if (
    msg.includes(
        'salary',
    )
) {
    return res.json({
        reply: `Your Salary: ₹${totalSalary}`,
    })
}

/* ONLY BORROW */
if (
    msg.includes(
        'borrow',
    )
) {
    return res.json({
        reply: `Total Borrow Pending: ₹${totalBorrow}`,
    })
}

/* ONLY LEND */
if (
    msg.includes(
        'lend',
    )
) {
    return res.json({
        reply: `Total Lend Pending: ₹${totalLend}`,
    })
}
        

        /* GENERAL AI */
        const prompt = `
You are finance assistant.

Balance ₹${balance}
Expense ₹${totalExpense}
Saving ₹${totalSaving}
Salary ₹${totalSalary}
Borrow ₹${totalBorrow}
Lend ₹${totalLend}

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
            chat
                ?.choices?.[0]
                ?.message
                ?.content ||
            'No reply'

        res.json({
            reply,
        })
    } catch (
        error
    ) {
        console.log(
            error,
        )

        res.status(
            500,
        ).json({
            reply:
                'AI reply failed',
        })
    }
}

module.exports = {
    askAi,
}