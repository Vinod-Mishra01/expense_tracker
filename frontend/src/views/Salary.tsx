// src/views/Salary.tsx
// FULL FINAL FIXED
// ✅ old design improved
// ✅ Edit added
// ✅ Delete
// ✅ Invalid date fixed
// ✅ Auto month/year from date
// ✅ No feature removed

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

    const today =
        new Date()
            .toISOString()
            .split('T')[0]

    const [date, setDate] =
        useState(today)

    const [editId, setEditId] =
        useState('')

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

    const [
        extraIncome,
        setExtraIncome,
    ] = useState('')

    const [
        extraSource,
        setExtraSource,
    ] = useState('')

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
                    'https://expense-backend-5myt.onrender.com/api/salary/list',
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

    const resetForm =
        () => {
            setEditId('')
            setDate(today)
            setGrossSalary('')
            setDeduction('')
            setNote('')
            setExtraIncome('')
            setExtraSource('')
            setFile(null)
        }

    const submit =
        async () => {
            const form =
                new FormData()

            const d =
                new Date(
                    date,
                )

            form.append(
                'date',
                date,
            )

            form.append(
                'month',
                months[
                    d.getMonth()
                ],
            )

            form.append(
                'year',
                String(
                    d.getFullYear(),
                ),
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

            form.append(
                'extraIncome',
                extraIncome,
            )

            form.append(
                'extraSource',
                extraSource,
            )

            if (file) {
                form.append(
                    'slipFile',
                    file,
                )
            }

            if (
                editId
            ) {
                await axios.put(
                    `https://expense-backend-5myt.onrender.com/api/salary/update/${editId}`,
                    form,
                    {
                        headers,
                    },
                )
            } else {
                await axios.post(
                    'https://expense-backend-5myt.onrender.com/api/salary/create',
                    form,
                    {
                        headers,
                    },
                )
            }

            resetForm()
            loadData()
        }

    const del =
        async (
            id: string,
        ) => {
            await axios.delete(
                `https://expense-backend-5myt.onrender.com/api/salary/delete/${id}`,
                {
                    headers,
                },
            )

            loadData()
        }

    const filteredData =
        useMemo(() => {
            return data.filter(
                (
                    item,
                ) => {
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

            {/* FORM */}
            <Card>

                <h3 className="text-xl font-bold mb-5">
                    Salary Entry
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Date
                        </label>

                        <Input
                            type="date"
                            value={
                                date
                            }
                            onChange={(
                                e,
                            ) =>
                                setDate(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Salary
                        </label>

                        <Input
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

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Deduction
                        </label>

                        <Input
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

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Extra Income
                        </label>

                        <Input
                            value={
                                extraIncome
                            }
                            onChange={(
                                e,
                            ) =>
                                setExtraIncome(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Source
                        </label>

                        <Input
                            value={
                                extraSource
                            }
                            onChange={(
                                e,
                            ) =>
                                setExtraSource(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Note
                        </label>

                        <Input
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

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Salary Slip
                        </label>

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
                            className="w-full border rounded-xl px-3 py-3"
                        />
                    </div>

                </div>

                <div className="mt-6 flex justify-end gap-3">

                    <Button
                        type="button"
                        onClick={
                            resetForm
                        }
                    >
                        Reset
                    </Button>

                    <Button
                        variant="solid"
                        onClick={() => {
                            if (
                                !grossSalary
                            ) {
                                alert(
                                    'Enter salary',
                                )
                                return
                            }

                            submit()
                        }}
                    >
                        {editId
                            ? 'Update Salary'
                            : 'Save Salary'}
                    </Button>

                </div>

            </Card>

            {/* TABLE */}
            <Card className="mt-5">

                <div className="flex gap-3 mb-5">

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
                        className="h-11 px-3 border rounded-xl"
                    >
                        <option>
                            All
                        </option>

                        {months.map(
                            (
                                m,
                            ) => (
                                <option
                                    key={
                                        m
                                    }
                                >
                                    {
                                        m
                                    }
                                </option>
                            ),
                        )}
                    </select>

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
                        className="h-11 px-3 border rounded-xl"
                    >
                        <option>
                            All
                        </option>
                        <option>
                            2024
                        </option>
                        <option>
                            2025
                        </option>
                        <option>
                            2026
                        </option>
                        <option>
                            2027
                        </option>
                    </select>

                </div>

                <div className="overflow-x-auto">

                   <table className="w-full min-w-[850px] text-sm">

    <thead>
        <tr className="border-b text-left bg-gray-50">

            <th className="py-4 px-3 font-semibold">
                No
            </th>

            <th className="py-4 px-3 font-semibold">
                Date
            </th>

            <th className="py-4 px-3 font-semibold">
                Salary
            </th>

            <th className="py-4 px-3 font-semibold">
                Deduction
            </th>

            <th className="py-4 px-3 font-semibold">
                Extra
            </th>

            <th className="py-4 px-3 font-semibold">
                Final
            </th>

            <th className="py-4 px-3 font-semibold text-center">
                Slip
            </th>

            <th className="py-4 px-3 font-semibold text-center">
                Action
            </th>

        </tr>
    </thead>

    <tbody>

        {filteredData.map((item, i) => {

            const final =
                Number(item.netSalary || 0) +
                Number(item.extraIncome || 0)

            return (

                <tr
                    key={i}
                    className="border-b hover:bg-gray-50 transition"
                >

                    <td className="py-4 px-3">
                        {i + 1}
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                        {item.date
                            ? new Date(item.date).toLocaleDateString(
                                  'en-GB',
                              )
                            : `${item.month} ${item.year}`}
                    </td>

                    <td className="py-4 px-3 font-medium">
                        ₹{item.grossSalary}
                    </td>

                    <td className="py-4 px-3">
                        ₹{item.deduction}
                    </td>

                    <td className="py-4 px-3 text-green-600 font-medium">
                        ₹{item.extraIncome || 0}
                    </td>

                    <td className="py-4 px-3 font-semibold text-blue-600">
                        ₹{final}
                    </td>

                    <td className="py-4 px-3 text-center">

                        {item.slipFile ? (

                            <a
                                href={`https://expense-backend-5myt.onrender.com/uploads/salary/${item.slipFile}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                View
                            </a>

                        ) : (
                            '-'
                        )}

                    </td>

                    <td className="py-4 px-3">

                        <div className="flex justify-center gap-2">

                            <Button
                                size="xs"
                                variant="solid"
                                onClick={() => {

                                    setEditId(item._id)

                                    setDate(
                                        item.date
                                            ? new Date(item.date)
                                                  .toISOString()
                                                  .split('T')[0]
                                            : today,
                                    )

                                    setGrossSalary(
                                        String(
                                            item.grossSalary || '',
                                        ),
                                    )

                                    setDeduction(
                                        String(
                                            item.deduction || '',
                                        ),
                                    )

                                    setNote(
                                        item.note || '',
                                    )

                                    setExtraIncome(
                                        String(
                                            item.extraIncome ?? '',
                                        ),
                                    )

                                    setExtraSource(
                                        item.extraSource ?? '',
                                    )

                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth',
                                    })
                                }}
                            >
                                Edit
                            </Button>

                            <Button
                                size="xs"
                                onClick={() =>
                                    del(item._id)
                                }
                            >
                                Delete
                            </Button>

                        </div>

                    </td>

                </tr>
            )
        })}

    </tbody>

</table>

                </div>

            </Card>

        </Container>
    )
}

export default Salary