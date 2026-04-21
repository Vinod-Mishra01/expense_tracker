const Salary = require('../models/Salary')

const createSalary = async (
    req,
    res,
) => {
    try {
        const {
            month,
            year,
            grossSalary,
            deduction,
            note,
        } = req.body

        const netSalary =
            Number(
                grossSalary,
            ) -
            Number(
                deduction || 0,
            )

        const data =
            await Salary.create({
                userId:
                    req.user.id,
                month,
                year,
                grossSalary,
                deduction,
                netSalary,
                note,
                slipFile:
                    req.file
                        ?.filename ||
                    '',
            })

        res.status(201).json(
            data,
        )
    } catch {
        res.status(500).json({
            message:
                'Create failed',
        })
    }
}

const getSalary =
    async (
        req,
        res,
    ) => {
        const data =
            await Salary.find({
                userId:
                    req.user.id,
            }).sort({
                createdAt: -1,
            })

        res.json(data)
    }

const deleteSalary =
    async (
        req,
        res,
    ) => {
        await Salary.findOneAndDelete(
            {
                _id: req.params.id,
                userId:
                    req.user.id,
            },
        )

        res.json({
            message:
                'Deleted',
        })
    }

module.exports = {
    createSalary,
    getSalary,
    deleteSalary,
}