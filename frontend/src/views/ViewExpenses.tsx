import { useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Drawer from '@/components/ui/Drawer'
import Select from '@/components/ui/Select'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import DataTable from '@/components/shared/DataTable'
import { useToken } from '@/store/authStore'
import axios from 'axios'
import {
    TbPlus,
    TbSearch,
    TbTrash,
    TbFilter,
    TbCloudDownload,
    TbEdit,
    TbArrowUp,
    TbArrowDown,
} from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { CSVLink } from 'react-csv'

type Expense = {
    _id: string
    expenseId: string
    title: string
    amount: number
    category: string
    date: string
    paymentMethod: string
}

const categoryOptions = [
    { label: 'All', value: '' },
    { label: 'Food', value: 'Food' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Rent', value: 'Rent' },
    { label: 'Bills', value: 'Bills' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Medical', value: 'Medical' },
    { label: 'Other', value: 'Other' },
]

const paymentOptions = [
    { label: 'All', value: '' },
    { label: 'Cash', value: 'Cash' },
    { label: 'UPI', value: 'UPI' },
    { label: 'Card', value: 'Card' },
]

const ViewExpenses = () => {
    const navigate = useNavigate()
    const { token } = useToken()

    const [loading, setLoading] = useState(false)
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [search, setSearch] = useState('')

    const [filterOpen, setFilterOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

    const [category, setCategory] = useState('')
    const [payment, setPayment] = useState('')
    const [minAmount, setMinAmount] = useState('')
    const [maxAmount, setMaxAmount] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    const [sortKey, setSortKey] = useState('date')
    const [sortOrder, setSortOrder] =
        useState<'asc' | 'desc'>('desc')

    const [editData, setEditData] = useState<any>({
        _id: '',
        title: '',
        amount: '',
        category: '',
        date: '',
        paymentMethod: '',
    })

    const fetchExpenses = async () => {
        try {
            setLoading(true)

            const res = await axios.get(
                'http://localhost:5000/api/expense/list',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            setExpenses(res.data)
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to load expenses
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchExpenses()
    }, [token])

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/expense/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            toast.push(
                <Notification type="success">
                    Expense deleted
                </Notification>,
                { placement: 'top-center' },
            )

            fetchExpenses()
        } catch {
            toast.push(
                <Notification type="danger">
                    Delete failed
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const handleEditOpen = (row: Expense) => {
        setEditData({
            ...row,
            date: row.date?.slice(0, 10),
        })
        setEditOpen(true)
    }

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/expense/update/${editData._id}`,
                editData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            toast.push(
                <Notification type="success">
                    Expense updated
                </Notification>,
                { placement: 'top-center' },
            )

            setEditOpen(false)
            fetchExpenses()
        } catch {
            toast.push(
                <Notification type="danger">
                    Update failed
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(
                sortOrder === 'asc' ? 'desc' : 'asc',
            )
        } else {
            setSortKey(key)
            setSortOrder('asc')
        }
    }

    const sortIcon = (key: string) => {
        if (sortKey !== key) return null
        return sortOrder === 'asc' ? (
            <TbArrowUp className="inline ml-1" />
        ) : (
            <TbArrowDown className="inline ml-1" />
        )
    }

    const filteredData = useMemo(() => {
        let data = expenses.filter((item) => {
            const q = search.toLowerCase()

            const searchMatch =
                item.title.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q) ||
                item.paymentMethod
                    .toLowerCase()
                    .includes(q) ||
                item.expenseId
                    .toLowerCase()
                    .includes(q) ||
                String(item.amount).includes(q) ||
                new Date(item.date)
                    .toLocaleDateString()
                    .toLowerCase()
                    .includes(q)

            const categoryMatch = category
                ? item.category === category
                : true

            const paymentMatch = payment
                ? item.paymentMethod === payment
                : true

            const minMatch = minAmount
                ? item.amount >= Number(minAmount)
                : true

            const maxMatch = maxAmount
                ? item.amount <= Number(maxAmount)
                : true

            const fromMatch = fromDate
                ? new Date(item.date) >=
                  new Date(fromDate)
                : true

            const toMatch = toDate
                ? new Date(item.date) <=
                  new Date(toDate)
                : true

            return (
                searchMatch &&
                categoryMatch &&
                paymentMatch &&
                minMatch &&
                maxMatch &&
                fromMatch &&
                toMatch
            )
        })

        data.sort((a: any, b: any) => {
            let first = a[sortKey]
            let second = b[sortKey]

            if (sortKey === 'date') {
                first = new Date(a.date).getTime()
                second = new Date(b.date).getTime()
            }

            if (sortKey === 'amount') {
                first = Number(a.amount)
                second = Number(b.amount)
            }

            if (first < second)
                return sortOrder === 'asc'
                    ? -1
                    : 1
            if (first > second)
                return sortOrder === 'asc'
                    ? 1
                    : -1
            return 0
        })

        return data
    }, [
        expenses,
        search,
        category,
        payment,
        minAmount,
        maxAmount,
        fromDate,
        toDate,
        sortKey,
        sortOrder,
    ])

    const resetFilter = () => {
        setCategory('')
        setPayment('')
        setMinAmount('')
        setMaxAmount('')
        setFromDate('')
        setToDate('')
    }

    // FULL UPDATED COLUMNS
// ✅ No. column added
// ✅ Title only in one line
// ✅ Expense ID small below
// ✅ Better spacing

const columns = [

{
    header: 'No.',
    enableSorting: false,
    cell: ({ row }: any) => (
        <span className="font-semibold">
            {row.index + 1}
        </span>
    ),
},

{
    header: 'Title',
    accessorKey: 'title',
    enableSorting: false,

    cell: ({ row }: any) => (
        <div className="min-w-[150px]">

            <div className="font-semibold text-sm leading-tight">
                {row.original.title}
            </div>

            <div className="text-xs text-gray-500 mt-1">
                {row.original.expenseId}
            </div>

        </div>
    ),
},

{
    header: (
        <span
            className="cursor-pointer inline-flex items-center whitespace-nowrap"
            onClick={() =>
                handleSort('amount')
            }
        >
            Amount
        </span>
    ),

    accessorKey: 'amount',

    cell: ({ row }: any) => (
        <span className="font-semibold text-red-500 whitespace-nowrap">
            ₹ {row.original.amount}
        </span>
    ),
},

{
    header: 'Category',
    accessorKey: 'category',
    enableSorting: false,

    cell: ({ row }: any) => (
        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 whitespace-nowrap">
            {row.original.category}
        </span>
    ),
},

{
    header: (
        <span
            className="cursor-pointer inline-flex items-center whitespace-nowrap"
            onClick={() =>
                handleSort('date')
            }
        >
            Date
        </span>
    ),

    accessorKey: 'date',

    cell: ({ row }: any) => (
        <span className="whitespace-nowrap">
            {new Date(
                row.original.date,
            ).toLocaleDateString()}
        </span>
    ),
},

{
    header: (
        <span
            className="cursor-pointer inline-flex items-center whitespace-nowrap"
            onClick={() =>
                handleSort('paymentMethod')
            }
        >
            Payment
        </span>
    ),

    accessorKey: 'paymentMethod',

    cell: ({ row }: any) => (
        <span className="whitespace-nowrap">
            {row.original.paymentMethod}
        </span>
    ),
},

{
    header: 'Action',
    id: 'action',

    cell: ({ row }: any) => (
        <div className="flex gap-2 whitespace-nowrap">

            <Button
                size="sm"
                icon={<TbEdit />}
                onClick={() =>
                    handleEditOpen(
                        row.original,
                    )
                }
            >
                Edit
            </Button>

            <Button
                size="sm"
                icon={<TbTrash />}
                onClick={() =>
                    handleDelete(
                        row.original._id,
                    )
                }
            >
                Delete
            </Button>

        </div>
    ),
},

]
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                        <h3>Expenses</h3>

                        <div className="flex flex-col md:flex-row gap-2">
                            <CSVLink
                                filename="expense-list.csv"
                                data={filteredData}
                            >
                                <Button
                                    icon={
                                        <TbCloudDownload />
                                    }
                                >
                                    Export
                                </Button>
                            </CSVLink>

                            <Button
                                icon={
                                    <TbFilter />
                                }
                                onClick={() =>
                                    setFilterOpen(
                                        true,
                                    )
                                }
                            >
                                Filter
                            </Button>

                            <Button
                                variant="solid"
                                icon={
                                    <TbPlus />
                                }
                                onClick={() =>
                                    navigate(
                                        '/add-expense',
                                    )
                                }
                            >
                                Add Expense
                            </Button>
                        </div>
                    </div>

                    <div className="max-w-md mb-5">
                        <Input
                            prefix={
                                <TbSearch />
                            }
                            placeholder="Search all data..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredData}
                        loading={loading}
                        noData={
                            !loading &&
                            filteredData.length ===
                                0
                        }
                    />
                </div>
            </AdaptiveCard>

            <Drawer
                title="Filter Expenses"
                isOpen={filterOpen}
                onClose={() =>
                    setFilterOpen(false)
                }
                onRequestClose={() =>
                    setFilterOpen(false)
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Category
                        </label>
                        <Select
                            options={
                                categoryOptions
                            }
                            value={categoryOptions.find(
                                (x) =>
                                    x.value ===
                                    category,
                            )}
                            onChange={(
                                val: any,
                            ) =>
                                setCategory(
                                    val?.value ||
                                        '',
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Payment Method
                        </label>
                        <Select
                            options={
                                paymentOptions
                            }
                            value={paymentOptions.find(
                                (x) =>
                                    x.value ===
                                    payment,
                            )}
                            onChange={(
                                val: any,
                            ) =>
                                setPayment(
                                    val?.value ||
                                        '',
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Min Amount
                        </label>
                        <Input
                            type="number"
                            value={minAmount}
                            onChange={(e) =>
                                setMinAmount(
                                    e.target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Max Amount
                        </label>
                        <Input
                            type="number"
                            value={maxAmount}
                            onChange={(e) =>
                                setMaxAmount(
                                    e.target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            From Date
                        </label>
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={(e) =>
                                setFromDate(
                                    e.target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            To Date
                        </label>
                        <Input
                            type="date"
                            value={toDate}
                            onChange={(e) =>
                                setToDate(
                                    e.target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            block
                            onClick={
                                resetFilter
                            }
                        >
                            Reset
                        </Button>

                        <Button
                            block
                            variant="solid"
                            onClick={() =>
                                setFilterOpen(
                                    false,
                                )
                            }
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </Drawer>

           <Drawer
    title="Edit Expense"
    isOpen={editOpen}
    onClose={() => setEditOpen(false)}
    onRequestClose={() => setEditOpen(false)}
>
    <div className="flex flex-col gap-4">

        <div>
            <label className="block mb-1 font-medium">
                Title
            </label>
            <Input
                placeholder="Enter title"
                value={editData.title}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        title: e.target.value,
                    })
                }
            />
        </div>

        <div>
            <label className="block mb-1 font-medium">
                Amount
            </label>
            <Input
                type="number"
                placeholder="Enter amount"
                value={editData.amount}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        amount: e.target.value,
                    })
                }
            />
        </div>

        <div>
            <label className="block mb-1 font-medium">
                Date
            </label>
            <Input
                type="date"
                value={editData.date}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        date: e.target.value,
                    })
                }
            />
        </div>

        <Button
            block
            variant="solid"
            onClick={handleUpdate}
        >
            Update Expense
        </Button>

    </div>
</Drawer>
        </Container>
    )
}

export default ViewExpenses