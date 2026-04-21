// src/views/ViewSavings.tsx

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
    { label: 'Bank', value: 'Bank' },
    { label: 'Cash', value: 'Cash' },
        { label: 'Investment', value: 'Investment' },
    { label: 'FD', value: 'FD' },
    { label: 'Other', value: 'Other' },
]

const ViewSavings = () => {
    const { token } = useToken()
    const navigate = useNavigate()

    const authToken =
        token || localStorage.getItem('token')

    const [loading, setLoading] =
        useState(false)

    const [data, setData] = useState<any[]>([])
    const [search, setSearch] =
        useState('')

    const [filterOpen, setFilterOpen] =
        useState(false)

    const [editOpen, setEditOpen] =
        useState(false)

    const [type, setType] =
        useState('')

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
            title: '',
            amount: '',
            type: '',
            date: '',
            note: '',
        })

    const fetchData = async () => {
        try {
            setLoading(true)

            const res = await axios.get(
                'http://localhost:5000/api/saving/list',
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
                    Failed to load savings
                </Notification>,
                {
                    placement:
                        'top-center',
                },
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (authToken) {
            fetchData()
        }
    }, [authToken])

    const handleDelete = async (
        id: string,
    ) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/saving/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                },
            )

            toast.push(
                <Notification type="success">
                    Saving deleted
                </Notification>,
                {
                    placement:
                        'top-center',
                },
            )

            fetchData()
        } catch {
            toast.push(
                <Notification type="danger">
                    Delete failed
                </Notification>,
                {
                    placement:
                        'top-center',
                },
            )
        }
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
        })

        setEditOpen(true)
    }

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/saving/update/${editData._id}`,
                {
                    title:
                        editData.title,
                    amount: Number(
                        editData.amount,
                    ),
                    type:
                        editData.type,
                    date:
                        editData.date,
                    note:
                        editData.note,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                },
            )

            toast.push(
                <Notification type="success">
                    Saving updated
                </Notification>,
                {
                    placement:
                        'top-center',
                },
            )

            setEditOpen(false)
            fetchData()
        } catch {
            toast.push(
                <Notification type="danger">
                    Update failed
                </Notification>,
                {
                    placement:
                        'top-center',
                },
            )
        }
    }

    const filteredData =
        useMemo(() => {
            return data.filter(
                (item) => {
                    const q =
                        search.toLowerCase()

                    const searchMatch =
                        item.title
                            .toLowerCase()
                            .includes(
                                q,
                            ) ||
                        item.type
                            .toLowerCase()
                            .includes(
                                q,
                            ) ||
                        String(
                            item.amount,
                        ).includes(
                            q,
                        )

                    const typeMatch =
                        type
                            ? item.type ===
                              type
                            : true

                    const minMatch =
                        minAmount
                            ? item.amount >=
                              Number(
                                  minAmount,
                              )
                            : true

                    const maxMatch =
                        maxAmount
                            ? item.amount <=
                              Number(
                                  maxAmount,
                              )
                            : true

                    const fromMatch =
                        fromDate
                            ? new Date(
                                  item.date,
                              ) >=
                              new Date(
                                  fromDate,
                              )
                            : true

                    const toMatch =
                        toDate
                            ? new Date(
                                  item.date,
                              ) <=
                              new Date(
                                  toDate,
                              )
                            : true

                    return (
                        searchMatch &&
                        typeMatch &&
                        minMatch &&
                        maxMatch &&
                        fromMatch &&
                        toMatch
                    )
                },
            )
        }, [
            data,
            search,
            type,
            minAmount,
            maxAmount,
            fromDate,
            toDate,
        ])

    const totalSavings =
        filteredData.reduce(
            (
                sum,
                item,
            ) =>
                sum +
                item.amount,
            0,
        )

    const columns = [
        {
            header: 'Title',
            accessorKey:
                'title',
        },
        {
            header: 'Amount',
            accessorKey:
                'amount',
            cell: ({
                row,
            }: any) => (
                <b>
                    ₹{' '}
                    {
                        row
                            .original
                            .amount
                    }
                </b>
            ),
        },
        {
            header: 'Type',
            accessorKey:
                'type',
        },
        {
            header: 'Date',
            accessorKey:
                'date',
            cell: ({
                row,
            }: any) =>
                new Date(
                    row
                        .original
                        .date,
                ).toLocaleDateString(),
        },
        {
            header: 'Action',
            cell: ({
                row,
            }: any) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        icon={
                            <TbEdit />
                        }
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
                        icon={
                            <TbTrash />
                        }
                        onClick={() =>
                            handleDelete(
                                row
                                    .original
                                    ._id,
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
                <div className="flex flex-col gap-4">
                 <div className="mb-3 px-1 py-2">

    <h3 className="mb-2">
        Total Savings   ₹
        {totalSavings}
    </h3>

    <p className="text-gray-500">
        Manage and track all your savings
    </p>

</div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-10 mt-4">
                        <div className="w-full md:w-[320px]">
                            <Input
                                prefix={
                                    <TbSearch />
                                }
                                placeholder="Search savings..."
                                value={
                                    search
                                }
                                onChange={(
                                    e,
                                ) =>
                                    setSearch(
                                        e
                                            .target
                                            .value,
                                    )
                                }
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <CSVLink
                                filename="saving-list.csv"
                                data={
                                    filteredData
                                }
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
                                        '/add-saving',
                                    )
                                }
                            >
                                Add Saving
                            </Button>
                        </div>
                    </div>

                    <DataTable
                        columns={
                            columns
                        }
                        data={
                            filteredData
                        }
                        loading={
                            loading
                        }
                    />
                </div>
            </AdaptiveCard>

            <Drawer
                title="Filter Savings"
                isOpen={
                    filterOpen
                }
                onClose={() =>
                    setFilterOpen(
                        false,
                    )
                }
                onRequestClose={() =>
                    setFilterOpen(
                        false,
                    )
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Saving
                            Type
                        </label>

                        <Select
                            options={
                                typeOptions
                            }
                            value={typeOptions.find(
                                (
                                    x,
                                ) =>
                                    x.value ===
                                    type,
                            )}
                            onChange={(
                                val: any,
                            ) =>
                                setType(
                                    val?.value ||
                                        '',
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Min
                            Amount
                        </label>

                        <Input
                            value={
                                minAmount
                            }
                            onChange={(
                                e,
                            ) =>
                                setMinAmount(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            Max
                            Amount
                        </label>

                        <Input
                            value={
                                maxAmount
                            }
                            onChange={(
                                e,
                            ) =>
                                setMaxAmount(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            From
                            Date
                        </label>

                        <Input
                            type="date"
                            value={
                                fromDate
                            }
                            onChange={(
                                e,
                            ) =>
                                setFromDate(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-1 block">
                            To
                            Date
                        </label>

                        <Input
                            type="date"
                            value={
                                toDate
                            }
                            onChange={(
                                e,
                            ) =>
                                setToDate(
                                    e
                                        .target
                                        .value,
                                )
                            }
                        />
                    </div>

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
            </Drawer>

     <Drawer
    title="Edit Saving"
    isOpen={
        editOpen
    }
    onClose={() =>
        setEditOpen(
            false,
        )
    }
    onRequestClose={() =>
        setEditOpen(
            false,
        )
    }
>
    <div className="flex flex-col gap-4">

        {/* Title */}
        <div>
            <label className="text-sm font-medium mb-2 block">
                Saving Title
            </label>

            <Input
                placeholder="Title"
                value={
                    editData.title
                }
                onChange={(
                    e,
                ) =>
                    setEditData(
                        {
                            ...editData,
                            title:
                                e
                                    .target
                                    .value,
                        },
                    )
                }
            />
        </div>

        {/* Amount */}
        <div>
            <label className="text-sm font-medium mb-2 block">
                Amount
            </label>

            <Input
                type="number"
                placeholder="Amount"
                value={
                    editData.amount
                }
                onChange={(
                    e,
                ) =>
                    setEditData(
                        {
                            ...editData,
                            amount:
                                e
                                    .target
                                    .value,
                        },
                    )
                }
            />
        </div>

        {/* Type */}
        <div>
            <label className="text-sm font-medium mb-2 block">
                Saving Type
            </label>

            <Select
                options={typeOptions.filter(
                    (
                        x,
                    ) =>
                        x.value !==
                        '',
                )}
                value={typeOptions.find(
                    (
                        x,
                    ) =>
                        x.value ===
                        editData.type,
                )}
                onChange={(
                    val: any,
                ) =>
                    setEditData(
                        {
                            ...editData,
                            type:
                                val?.value,
                        },
                    )
                }
            />
        </div>

        {/* Date */}
        <div>
            <label className="text-sm font-medium mb-2 block">
                Date
            </label>

            <Input
                type="date"
                value={
                    editData.date
                }
                onChange={(
                    e,
                ) =>
                    setEditData(
                        {
                            ...editData,
                            date:
                                e
                                    .target
                                    .value,
                        },
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
                placeholder="Note"
                value={
                    editData.note
                }
                onChange={(
                    e,
                ) =>
                    setEditData(
                        {
                            ...editData,
                            note:
                                e
                                    .target
                                    .value,
                        },
                    )
                }
            />
        </div>

        {/* Button */}
        <Button
            variant="solid"
            onClick={
                handleUpdate
            }
        >
            Update Saving
        </Button>

    </div>
</Drawer>
        </Container>
    )
}

export default ViewSavings