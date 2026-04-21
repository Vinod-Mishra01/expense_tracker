// src/views/ViewBorrowLend.tsx
// FULL UPDATED FINAL FILE

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
    TbEdit,
    TbFilter,
    // Aur import me add karo

TbSearchOff,
    TbCloudDownload,
} from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { CSVLink } from 'react-csv'

const typeOptions = [
    { label: 'All', value: '' },
    { label: 'Borrow', value: 'Borrow' },
    { label: 'Lend', value: 'Lend' },
]

const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Overdue', value: 'Overdue' },
]

const ViewBorrowLend = () => {
    const { token } = useToken()
    const navigate = useNavigate()

    const authToken =
        token || localStorage.getItem('token')

    const [loading, setLoading] =
        useState(false)

    const [data, setData] =
        useState<any[]>([])

    const [search, setSearch] =
        useState('')

    const [filterOpen, setFilterOpen] =
        useState(false)

    const [editOpen, setEditOpen] =
        useState(false)

    const [type, setType] =
        useState('')

    const [status, setStatus] =
        useState('')

        // Add these states if not present

const [minAmount, setMinAmount] =
    useState('')

const [maxAmount, setMaxAmount] =
    useState('')

const [fromDate, setFromDate] =
    useState('')

const [toDate, setToDate] =
    useState('')

    const [editData, setEditData] =
        useState<any>({
            _id: '',
            type: 'Borrow',
            personName: '',
            amount: '',
            paidAmount: '',
            pendingAmount: '',
            status: 'Active',
            date: '',
            returnDate: '',
            note: '',
        })

    const fetchData = async () => {
        try {
            setLoading(true)

            const res = await axios.get(
                'https://expense-backend-5myt.onrender.com/api/borrow-lend/list',
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                },
            )

            setData(res.data)
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to load records
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (authToken) fetchData()
    }, [authToken])

    const handleDelete = async (
        id: string,
    ) => {
        await axios.delete(
            `https://expense-backend-5myt.onrender.com/api/borrow-lend/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            },
        )

        fetchData()
    }

    const handleEditOpen = (
        row: any,
    ) => {
        setEditData({
            ...row,
            date: row.date?.slice(
                0,
                10,
            ),
            returnDate:
                row.returnDate?.slice(
                    0,
                    10,
                ) || '',
        })

        setEditOpen(true)
    }

    const handleUpdate = async () => {
        await axios.put(
            `https://expense-backend-5myt.onrender.com/api/borrow-lend/update/${editData._id}`,
            {
                ...editData,
                amount: Number(
                    editData.amount,
                ),
                paidAmount:
                    Number(
                        editData.paidAmount,
                    ) || 0,
                status:
                    editData.status,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            },
        )

        toast.push(
            <Notification type="success">
                Record updated
            </Notification>,
            { placement: 'top-center' },
        )

        setEditOpen(false)
        fetchData()
    }

    const filteredData =
        useMemo(() => {
            return data.filter(
                (item) => {
                    const q =
                        search.toLowerCase()

                    const searchMatch =
                        item.personName
                            .toLowerCase()
                            .includes(
                                q,
                            ) ||
                        item.type
                            .toLowerCase()
                            .includes(
                                q,
                            )

                    const typeMatch =
                        type
                            ? item.type ===
                              type
                            : true

                    const statusMatch =
                        status
                            ? item.status ===
                              status
                            : true

                    return (
                        searchMatch &&
                        typeMatch &&
                        statusMatch
                    )
                },
            )
        }, [
            data,
            search,
            type,
            status,
        ])

    const totalBorrow =
        filteredData
            .filter(
                (x) =>
                    x.type ===
                    'Borrow',
            )
            .reduce(
                (
                    a,
                    b,
                ) =>
                    a +
                    b.amount,
                0,
            )

    const totalLend =
        filteredData
            .filter(
                (x) =>
                    x.type ===
                    'Lend',
            )
            .reduce(
                (
                    a,
                    b,
                ) =>
                    a +
                    b.amount,
                0,
            )
const columns = [
    {
        header: 'No.',
        size: 40,
        enableSorting: false,
        cell: ({ row }: any) =>
            row.index + 1,
    },

    {
        header: 'Type',
        accessorKey: 'type',
        size: 80,
        enableSorting: false,
    },

    {
        header: 'Person',
        accessorKey:
            'personName',
        size: 120,
        enableSorting: false,
        cell: ({ row }: any) => (
            <span className="font-medium uppercase">
                {
                    row.original
                        .personName
                }
            </span>
        ),
    },

    {
        header: 'Amount',
        accessorKey:
            'amount',
        size: 120,
        enableSorting: false,
        cell: ({ row }: any) => (
            <span className="font-semibold">
                ₹
                {
                    row.original
                        .amount
                }
            </span>
        ),
    },

    {
        header: 'Paid',
        accessorKey:
            'paidAmount',
        size: 100,
        enableSorting: false,
        cell: ({ row }: any) => (
            <span className="font-semibold text-green-600">
                ₹
                {
                    row.original
                        .paidAmount
                }
            </span>
        ),
    },

    {
        header: 'Remaining',
        accessorKey:
            'pendingAmount',
        size: 100,
        enableSorting: false,
        cell: ({ row }: any) => (
            <span className="font-semibold text-red-500">
                ₹
                {
                    row.original
                        .pendingAmount
                }
            </span>
        ),
    },

    {
        header: 'Status',
        accessorKey:
            'status',
        size: 110,
        cell: ({
            row,
        }: any) => {
            const status =
                row.original
                    .status

            let cls =
                'bg-orange-100 text-orange-700'

            if (
                status ===
                'Paid'
            ) {
                cls =
                    'bg-green-100 text-green-700'
            }

            if (
                status ===
                'Overdue'
            ) {
                cls =
                    'bg-red-100 text-red-700'
            }

            return (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}
                >
                    {status}
                </span>
            )
        },
    },

    {
        header: 'Date',
        accessorKey:
            'date',
        size: 120,
        cell: ({
            row,
        }: any) =>
            new Date(
                row.original.date,
            ).toLocaleDateString(),
    },

    {
        header:
            'Return Date',
        accessorKey:
            'returnDate',
        size: 130,
        cell: ({
            row,
        }: any) =>
            row.original
                .returnDate
                ? new Date(
                      row.original.returnDate,
                  ).toLocaleDateString()
                : '-',
    },

    {
        header: 'Days',
        size: 100,
        enableSorting: false,
        cell: ({
            row,
        }: any) => {
            const start =
                new Date(
                    row.original.date,
                )

            const now =
                new Date()

            const diff =
                Math.floor(
                    (
                        now.getTime() -
                        start.getTime()
                    ) /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        ),
                )

            return (
                <span className="font-medium">
                    {diff} days
                </span>
            )
        },
    },

    {
        header: 'Action',
        size: 220,
        enableSorting: false,
        cell: ({
            row,
        }: any) => (
            <div className="flex gap-2">
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
            <div className="flex flex-col gap-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdaptiveCard>
                        <p className="text-sm text-gray-500">
                            Total Borrow
                        </p>
                        <h3 className="mt-2">
                            ₹ {totalBorrow}
                        </h3>
                    </AdaptiveCard>

                    <AdaptiveCard>
                        <p className="text-sm text-gray-500">
                            Total Lend
                        </p>
                        <h3 className="mt-2">
                            ₹ {totalLend}
                        </h3>
                    </AdaptiveCard>
                </div>

                <AdaptiveCard>
                    <div className="flex flex-col gap-4">

                   <div className="mb-2">
    <h3 className="mb-2">
        Borrow & Lend Records
    </h3>

    <p className="text-gray-500">
        Manage your records
    </p>
</div>


                     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-5 mb-10">
                            <div className="w-full lg:w-[320px]">
                                <Input
                                    prefix={<TbSearch />}
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <CSVLink
                                    filename="borrow-lend.csv"
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
                                    icon={<TbFilter />}
                                    onClick={() =>
                                        setFilterOpen(true)
                                    }
                                >
                                    Filter
                                </Button>

                                <Button
                                    variant="solid"
                                    icon={<TbPlus />}
                                    onClick={() =>
                                        navigate(
                                            '/borrow-lend',
                                        )
                                    }
                                >
                                    Add Record
                                </Button>
                            </div>
                        </div>




{
filteredData.length === 0 ? (

    <div className="border rounded-2xl py-16 px-6 text-center bg-gray-50 dark:bg-gray-800">

        <div className="flex justify-center mb-4 text-gray-400 text-5xl">
            <TbSearchOff />
        </div>

        <h4 className="text-lg font-semibold mb-2">
            No Data Found
        </h4>

        <p className="text-gray-500 text-sm">
            No records match your search or filter.
        </p>

        <div className="mt-5">
            <Button
                size="sm"
                onClick={() => {
                    setSearch('')
                    setType('')
                    setStatus('')
                    setMinAmount('')
                    setMaxAmount('')
                    setFromDate('')
                    setToDate('')
                }}
            >
                Clear Filters
            </Button>
        </div>

    </div>

) : (

  // Replace your FULL block with this

// Bro paginationClassName not enough.
// Add !important tailwind override

<>
    <div className="overflow-x-auto rounded-xl borrow-scroll">
        <div className="min-w-[1600px]">

            <DataTable
                columns={columns}
                data={filteredData}
                loading={loading}
                pagingType="default"
                paginationClassName="!flex !justify-center !items-center !w-full !py-5 !border-0"
            />

        </div>
    </div>
</>
)
}
                    </div>
                </AdaptiveCard>
            </div>

     

<Drawer
    title="Filter Records"
    isOpen={filterOpen}
    onClose={() =>
        setFilterOpen(false)
    }
    onRequestClose={() =>
        setFilterOpen(false)
    }
>
    <div className="flex flex-col gap-4">

        {/* Type */}
        <div>
            <label className="text-sm font-semibold mb-1 block">
                Record Type
            </label>

            <Select
                options={typeOptions}
                value={typeOptions.find(
                    (x) =>
                        x.value ===
                        type,
                )}
                onChange={(val: any) =>
                    setType(
                        val?.value ||
                            '',
                    )
                }
            />
        </div>

        {/* Status */}
        <div>
            <label className="text-sm font-semibold mb-1 block">
                Status
            </label>

            <Select
                options={statusOptions}
                value={statusOptions.find(
                    (x) =>
                        x.value ===
                        status,
                )}
                onChange={(val: any) =>
                    setStatus(
                        val?.value ||
                            '',
                    )
                }
            />
        </div>

        {/* Min Amount */}
        <div>
            <label className="text-sm font-semibold mb-1 block">
                Min Amount
            </label>

            <Input
                type="number"
                placeholder="0"
                value={minAmount}
                onChange={(e) =>
                    setMinAmount(
                        e.target.value,
                    )
                }
            />
        </div>

        {/* Max Amount */}
        <div>
            <label className="text-sm font-semibold mb-1 block">
                Max Amount
            </label>

            <Input
                type="number"
                placeholder="10000"
                value={maxAmount}
                onChange={(e) =>
                    setMaxAmount(
                        e.target.value,
                    )
                }
            />
        </div>

        {/* From Date */}
        <div>
            <label className="text-sm font-semibold mb-1 block">
                From Date
            </label>

            <Input
                type="date"
                value={fromDate}
                onChange={(e) =>
                    setFromDate(
                        e.target.value,
                    )
                }
            />
        </div>

        {/* To Date */}
        <div>
            <label className="text-sm font-semibold mb-1 block">
                To Date
            </label>

            <Input
                type="date"
                value={toDate}
                onChange={(e) =>
                    setToDate(
                        e.target.value,
                    )
                }
            />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">

            <Button
                onClick={() => {
                    setType('')
                    setStatus('')
                    setMinAmount('')
                    setMaxAmount('')
                    setFromDate('')
                    setToDate('')
                }}
            >
                Reset
            </Button>

            <Button
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
    title="Edit Record"
    isOpen={editOpen}
    onClose={() =>
        setEditOpen(false)
    }
    onRequestClose={() =>
        setEditOpen(false)
    }
>
    <div className="flex flex-col gap-4">

        <div>
            <label className="text-sm font-semibold mb-1 block">
                Type
            </label>
            <Select
                options={typeOptions.filter(
                    (x) =>
                        x.value !== '',
                )}
                value={typeOptions.find(
                    (x) =>
                        x.value ===
                        editData.type,
                )}
                onChange={(val: any) =>
                    setEditData({
                        ...editData,
                        type: val?.value,
                    })
                }
            />
        </div>

        <div>
            <label className="text-sm font-semibold mb-1 block">
                Person Name
            </label>
            <Input
                value={editData.personName}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        personName:
                            e.target.value,
                    })
                }
            />
        </div>

        <div>
            <label className="text-sm font-semibold mb-1 block">
                Amount
            </label>
            <Input
                type="number"
                value={editData.amount}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        amount:
                            e.target.value,
                    })
                }
            />
        </div>

        <div>
            <label className="text-sm font-semibold mb-1 block">
                Paid Amount
            </label>
            <Input
                type="number"
                value={editData.paidAmount}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        paidAmount:
                            e.target.value,
                    })
                }
            />
        </div>

        <div>
            <label className="text-sm font-semibold mb-1 block">
                Date
            </label>
            <Input
                type="date"
                value={editData.date}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        date:
                            e.target.value,
                    })
                }
            />
        </div>

        <div>
            <label className="text-sm font-semibold mb-1 block">
                Return Date
            </label>
            <Input
                type="date"
                value={editData.returnDate}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        returnDate:
                            e.target.value,
                    })
                }
            />
        </div>

        <div>
            <label className="text-sm font-semibold mb-1 block">
                Note
            </label>
            <Input
                value={editData.note}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        note:
                            e.target.value,
                    })
                }
            />
        </div>

        <div>
            <label className="text-sm font-semibold mb-1 block">
                Status
            </label>
            <Select
                options={statusOptions.filter(
                    (x) =>
                        x.value !== '',
                )}
                value={statusOptions.find(
                    (x) =>
                        x.value ===
                        editData.status,
                )}
                onChange={(val: any) =>
                    setEditData({
                        ...editData,
                        status:
                            val?.value,
                    })
                }
            />
        </div>

        <Button
            variant="solid"
            onClick={handleUpdate}
        >
            Update Record
        </Button>

    </div>
</Drawer>
        </Container>
    )
}

export default ViewBorrowLend