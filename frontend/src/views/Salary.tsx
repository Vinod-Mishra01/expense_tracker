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
            new Date()
                .getFullYear()
                .toString(),
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

    const [
        extraIncome,
        setExtraIncome,
    ] = useState('')

    const [
        extraSource,
        setExtraSource,
    ] = useState('')

    const [
        extraNote,
        setExtraNote,
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

            form.append(
                'extraIncome',
                extraIncome,
            )

            form.append(
                'extraSource',
                extraSource,
            )

            form.append(
                'extraNote',
                extraNote,
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
            setExtraIncome('')
            setExtraSource('')
            setExtraNote('')
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

            {/* FORM */}
            <Card>

                <h3 className="text-xl font-bold mb-5">
                    Salary +
                    Extra Income
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                    <div>
                        <label className="mb-2 block text-sm font-medium">
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

                    <div>
                        <label className="mb-2 block text-sm font-medium">
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

                    {/* <div>
                        <label className="mb-2 block text-sm font-medium">
                            Extra Note
                        </label>

                        <Input
                            value={
                                extraNote
                            }
                            onChange={(
                                e,
                            ) =>
                                setExtraNote(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div> */}

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
        onClick={() => {
            setGrossSalary('')
            setDeduction('')
            setNote('')
            setExtraIncome('')
            setExtraSource('')
            setExtraNote('')
            setFile(null)
            setMonth('January')
            setYear(
                new Date()
                    .getFullYear()
                    .toString(),
            )
        }}
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
                    'Please enter salary amount',
                )
                return
            }

            submit()
        }}
    >
        Save Salary
    </Button>

</div>







            </Card>


            {/* TABLE */}
            <Card className="mt-5">

                <div className="flex flex-col md:flex-row gap-3 md:justify-between mb-5">

                    <h3 className="text-xl font-bold">
                        Salary History
                    </h3>

                    <div className="flex gap-3">

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
                            className="h-11 px-3 rounded-xl border bg-transparent"
                        >
                            <option value="All">
                                All
                                Months
                            </option>

                            {months.map(
                                (
                                    item,
                                ) => (
                                    <option
                                        key={
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
                            className="h-11 px-3 rounded-xl border bg-transparent"
                        >
                            <option value="All">
                                All
                                Years
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

                </div>

                <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

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
                Net
            </th>

            <th className="py-3">
                Extra
            </th>

            <th className="py-3">
                Source
            </th>

            <th className="py-3">
                Final
            </th>

            <th className="py-3">
                Slip
            </th>

            <th className="py-3">
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
                            {i + 1}
                        </td>

                        <td className="py-4">
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

                        <td className="py-4 text-green-500">
                            ₹
                            {
                                item.netSalary
                            }
                        </td>

                        <td className="py-4 text-blue-500">
                            ₹
                            {item.extraIncome ||
                                0}
                        </td>

                        <td className="py-4">
                            {item.extraSource ||
                                '-'}
                        </td>

                        <td className="py-4 font-bold">
                            ₹
                            {Number(
                                item.netSalary ||
                                    0,
                            ) +
                                Number(
                                    item.extraIncome ||
                                        0,
                                )}
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

                        <td className="py-4">
                            <div className="flex gap-2">

                                <Button
                                    size="sm"
                                    variant="solid"
                                    onClick={() => {
                                        setMonth(
                                            item.month,
                                        )

                                        setYear(
                                            String(
                                                item.year,
                                            ),
                                        )

                                        setGrossSalary(
                                            String(
                                                item.grossSalary ||
                                                    '',
                                            ),
                                        )

                                        setDeduction(
                                            String(
                                                item.deduction ||
                                                    '',
                                            ),
                                        )

                                        setNote(
                                            item.note ||
                                                '',
                                        )

                                        setExtraIncome(
                                            String(
                                                item.extraIncome ||
                                                    '',
                                            ),
                                        )

                                        setExtraSource(
                                            item.extraSource ||
                                                '',
                                        )

                                        setExtraNote(
                                            item.extraNote ||
                                                '',
                                        )

                                        localStorage.setItem(
                                            'salaryEditId',
                                            item._id,
                                        )

                                        window.scrollTo(
                                            {
                                                top: 0,
                                                behavior:
                                                    'smooth',
                                            },
                                        )
                                    }}
                                >
                                    Edit
                                </Button>

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

                            </div>
                        </td>

                    </tr>
                ),
            )
        ) : (
            <tr>
                <td
                    colSpan={
                        11
                    }
                    className="py-10 text-center text-gray-500"
                >
                    No records
                    found
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