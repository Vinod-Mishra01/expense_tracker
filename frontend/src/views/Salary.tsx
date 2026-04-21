import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Container from '@/components/shared/Container'
import { useToken } from '@/store/authStore'

const Salary = () => {
    const { token } = useToken()

    const authToken =
        token ||
        localStorage.getItem(
            'token',
        )

    const [month, setMonth] =
        useState('January')

    const [year, setYear] =
        useState(
            new Date().getFullYear().toString(),
        )

    const [
        grossSalary,
        setGrossSalary,
    ] = useState('')

    const [
        deduction,
        setDeduction,
    ] = useState('')

    const [note, setNote] =
        useState('')

    const [file, setFile] =
        useState<any>(null)

    const [data, setData] =
        useState<any[]>([])

    const [
        filterMonth,
        setFilterMonth,
    ] = useState('All')

    const [
        filterYear,
        setFilterYear,
    ] = useState('All')

    const headers = {
        Authorization: `Bearer ${authToken}`,
    }

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    const loadData =
        async () => {
            const res =
                await axios.get(
                    'http://localhost:5000/api/salary/list',
                    {
                        headers,
                    },
                )

            setData(
                res.data,
            )
        }

    useEffect(() => {
        loadData()
    }, [])

    const submit =
        async () => {
            const form =
                new FormData()

            form.append(
                'month',
                month,
            )
            form.append(
                'year',
                year,
            )
            form.append(
                'grossSalary',
                grossSalary,
            )
            form.append(
                'deduction',
                deduction,
            )
            form.append(
                'note',
                note,
            )

            if (file) {
                form.append(
                    'slipFile',
                    file,
                )
            }

            await axios.post(
                'http://localhost:5000/api/salary/create',
                form,
                {
                    headers,
                },
            )

            setGrossSalary('')
            setDeduction('')
            setNote('')
            setFile(null)

            loadData()
        }

    const del =
        async (
            id: string,
        ) => {
            await axios.delete(
                `http://localhost:5000/api/salary/delete/${id}`,
                {
                    headers,
                },
            )

            loadData()
        }

    const filteredData =
        useMemo(() => {
            return data.filter(
                (item) => {
                    const monthMatch =
                        filterMonth ===
                            'All' ||
                        item.month ===
                            filterMonth

                    const yearMatch =
                        filterYear ===
                            'All' ||
                        String(
                            item.year,
                        ) ===
                            filterYear

                    return (
                        monthMatch &&
                        yearMatch
                    )
                },
            )
        }, [
            data,
            filterMonth,
            filterYear,
        ])

    return (
        <Container>

            {/* ENTRY FORM */}
            <Card>

                <h3 className="text-xl font-bold mb-5">
                    Salary Entry
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                    {/* Month */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Month
                        </label>

                        <select
                            value={
                                month
                            }
                            onChange={(
                                e,
                            ) =>
                                setMonth(
                                    e
                                        .target
                                        .value,
                                )
                            }
                            className="w-full h-12 px-3 rounded-xl border bg-transparent"
                        >
                            {months.map(
                                (
                                    item,
                                ) => (
                                    <option
                                        key={
                                            item
                                        }
                                        value={
                                            item
                                        }
                                    >
                                        {
                                            item
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </div>

                    {/* Year */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Year
                        </label>

                        <Input
                            value={
                                year
                            }
                            onChange={(
                                e,
                            ) =>
                                setYear(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Salary Amount
                        </label>

                        <Input
                            placeholder="Enter salary"
                            value={
                                grossSalary
                            }
                            onChange={(
                                e,
                            ) =>
                                setGrossSalary(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    {/* Deduction */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Deduction
                        </label>

                        <Input
                            placeholder="Enter deduction"
                            value={
                                deduction
                            }
                            onChange={(
                                e,
                            ) =>
                                setDeduction(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Note
                        </label>

                        <Input
                            placeholder="Optional note"
                            value={
                                note
                            }
                            onChange={(
                                e,
                            ) =>
                                setNote(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    {/* File */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Salary Slip
                        </label>

                        <div className="border rounded-xl px-4 py-3">

                            <input
                                type="file"
                                onChange={(
                                    e: any,
                                ) =>
                                    setFile(
                                        e
                                            .target
                                            .files[0],
                                    )
                                }
                                className="w-full"
                            />

                            {file && (
                                <p className="text-xs text-gray-500 mt-2">
                                    {
                                        file.name
                                    }
                                </p>
                            )}

                        </div>
                    </div>

                </div>

                <Button
                    className="mt-5"
                    onClick={
                        submit
                    }
                >
                    Save Salary
                </Button>

            </Card>

            {/* HISTORY */}
            <Card className="mt-5">

                {/* FILTERS */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">

                    <h3 className="text-xl font-bold">
                        Salary History
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

                        {/* Month */}
                        <div className="w-full sm:w-[220px]">
                            <select
                                value={
                                    filterMonth
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setFilterMonth(
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                className="w-full h-12 px-3 rounded-xl border bg-transparent"
                            >
                                <option value="All">
                                    All Months
                                </option>

                                {months.map(
                                    (
                                        item,
                                    ) => (
                                        <option
                                            key={
                                                item
                                            }
                                            value={
                                                item
                                            }
                                        >
                                            {
                                                item
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        {/* Year */}
                        <div className="w-full sm:w-[160px]">
                            <select
                                value={
                                    filterYear
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setFilterYear(
                                        e
                                            .target
                                            .value,
                                    )
                                }
                                className="w-full h-12 px-3 rounded-xl border bg-transparent"
                            >
                                <option value="All">
                                    All Years
                                </option>

                                <option value="2024">
                                    2024
                                </option>

                                <option value="2025">
                                    2025
                                </option>

                                <option value="2026">
                                    2026
                                </option>

                                <option value="2027">
                                    2027
                                </option>

                                <option value="2028">
                                    2028
                                </option>

                            </select>
                        </div>

                    </div>

                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                        <thead>
                            <tr className="border-b text-left">

                                <th className="py-3">
                                    No.
                                </th>

                                <th className="py-3">
                                    Month
                                </th>

                                <th className="py-3">
                                    Year
                                </th>

                                <th className="py-3">
                                    Salary
                                </th>

                                <th className="py-3">
                                    Deduction
                                </th>

                                <th className="py-3">
                                    Net Salary
                                </th>

                                <th className="py-3">
                                    Slip
                                </th>

                                <th className="py-3 text-center">
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {filteredData.length >
                            0 ? (
                                filteredData.map(
                                    (
                                        item,
                                        i,
                                    ) => (
                                        <tr
                                            key={
                                                i
                                            }
                                            className="border-b"
                                        >

                                            <td className="py-4">
                                                {i +
                                                    1}
                                            </td>

                                            <td className="py-4 font-semibold">
                                                {
                                                    item.month
                                                }
                                            </td>

                                            <td className="py-4">
                                                {
                                                    item.year
                                                }
                                            </td>

                                            <td className="py-4">
                                                ₹
                                                {
                                                    item.grossSalary
                                                }
                                            </td>

                                            <td className="py-4 text-red-500">
                                                ₹
                                                {
                                                    item.deduction
                                                }
                                            </td>

                                            <td className="py-4 text-green-500 font-semibold">
                                                ₹
                                                {
                                                    item.netSalary
                                                }
                                            </td>

                                            <td className="py-4">
                                                {item.slipFile ? (
                                                    <a
                                                        href={`http://localhost:5000/uploads/salary/${item.slipFile}`}
                                                        target="_blank"
                                                        className="text-blue-500"
                                                    >
                                                        View
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>

                                            <td className="py-4 text-center">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        del(
                                                            item._id,
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </td>

                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={
                                            8
                                        }
                                        className="py-10 text-center text-gray-500"
                                    >
                                        No salary records found
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </Card>

        </Container>
    )
}

export default Salary