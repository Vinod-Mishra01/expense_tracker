// src/views/ViewBorrowLend.tsx
// FULL FINAL FIXED FILE

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
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
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

    const [editData, setEditData] =
        useState<any>({
            _id: '',
            type: 'Borrow',
            personName: '',
            amount: '',
            paidAmount: '',
            date: '',
            returnDate: '',
            note: '',
        })

    const fetchData = async () => {
        try {
            setLoading(true)

            const res = await axios.get(
                'http://localhost:5000/api/borrow-lend/list',
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
            `http://localhost:5000/api/borrow-lend/delete/${id}`,
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
            `http://localhost:5000/api/borrow-lend/update/${editData._id}`,
            {
                ...editData,
                amount: Number(
                    editData.amount,
                ),
                paidAmount:
                    Number(
                        editData.paidAmount,
                    ) || 0,
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
            header: 'Type',
            accessorKey: 'type',
            enableSorting: false,
        },
        {
            header: 'Person',
            accessorKey:
                'personName',
            enableSorting: false,
        },
        {
            header: 'Amount',
            accessorKey:
                'amount',
            enableSorting: false,
        },
        {
            header: 'Paid',
            accessorKey:
                'paidAmount',
            enableSorting: false,
        },
        {
            header: 'Remaining',
            accessorKey:
                'pendingAmount',
            enableSorting: false,
        },
        {
            header: 'Status',
            accessorKey:
                'status',
        },
        {
            header: 'Date',
            accessorKey:
                'date',
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
            header: 'Action',
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

                {/* Cards */}
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

                {/* Table Container */}
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">

                        <div>
                            <h3>
                                Borrow & Lend Records
                            </h3>
                            <p className="text-gray-500 mt-1">
                                Manage your records
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

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

                        <DataTable
                            columns={columns}
                            data={filteredData}
                            loading={loading}
                        />
                    </div>
                </AdaptiveCard>
            </div>

            {/* Filter Drawer */}
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
                    <Select
                        options={typeOptions}
                        value={typeOptions.find(
                            (x) =>
                                x.value === type,
                        )}
                        onChange={(val: any) =>
                            setType(
                                val?.value || '',
                            )
                        }
                    />

                    <Select
                        options={statusOptions}
                        value={statusOptions.find(
                            (x) =>
                                x.value === status,
                        )}
                        onChange={(val: any) =>
                            setStatus(
                                val?.value || '',
                            )
                        }
                    />

                    <Button
                        variant="solid"
                        onClick={() =>
                            setFilterOpen(false)
                        }
                    >
                        Apply
                    </Button>
                </div>
            </Drawer>

            {/* Edit Drawer */}
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
                                    type:
                                        val?.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Person Name
                        </label>
                        <Input
                            value={
                                editData.personName
                            }
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
                            value={
                                editData.amount
                            }
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
                            value={
                                editData.paidAmount
                            }
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
                            value={
                                editData.returnDate
                            }
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