// src/views/Notifications.tsx
// FULL REPLACE FILE - Sync with Bell Notification Logic

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { useToken } from '@/store/authStore'
import {
    TbBell,
    TbSearch,
    TbCheck,
} from 'react-icons/tb'

type NotifyItem = {
    id: string
    title: string
    time: string
    type: 'danger' | 'warning' | 'success' | 'info'
    readed: boolean
}

const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Danger', value: 'danger' },
    { label: 'Warning', value: 'warning' },
    { label: 'Success', value: 'success' },
    { label: 'Info', value: 'info' },
]

const Notifications = () => {
    const [data, setData] =
        useState<NotifyItem[]>([])

    const [search, setSearch] =
        useState('')

    const [filter, setFilter] =
        useState('all')

   const { token } = useToken()

const authToken =
    token ||
    localStorage.getItem('token')


    const getNow = () =>
        new Date().toLocaleString()

    const loadNotifications =
        async () => {
            try {
            const headers = {
   Authorization: `Bearer ${token}`,
}

                const [
                    expRes,
                    savRes,
                    borRes,
                ] =
                    await Promise.all(
                        [
                            axios.get(
                                'https://expense-backend-5myt.onrender.com/api/expense/list',
                                { headers },
                            ),
                            axios.get(
                                'https://expense-backend-5myt.onrender.com/api/saving/list',
                                { headers },
                            ),
                            axios.get(
                                'https://expense-backend-5myt.onrender.com/api/borrow-lend/list',
                                { headers },
                            ),
                        ],
                    )

                const expenses =
                    expRes.data ||
                    []

                const savings =
                    savRes.data ||
                    []

                const borrow =
                    borRes.data ||
                    []

                const salary =
                    Number(
                        localStorage.getItem(
                            'salary',
                        ) || 0,
                    )

                const totalExpense =
                    expenses.reduce(
                        (
                            a: number,
                            b: { amount: any },
                        ) =>
                            a +
                            Number(
                                b.amount ||
                                    0,
                            ),
                        0,
                    )

                const totalSaving =
                    savings.reduce(
                        (
                            a: number,
                            b: { amount: any },
                        ) =>
                            a +
                            Number(
                                b.amount ||
                                    0,
                            ),
                        0,
                    )

                const list: NotifyItem[] =
                    []

                if (!salary) {
                    list.push({
                        id: '1',
                        title:
                            '💼 Add this month salary to track finances',
                        time: getNow(),
                        type: 'info',
                        readed: false,
                    })
                }

                if (
                    salary &&
                    totalExpense >
                        salary *
                            0.5
                ) {
                    list.push({
                        id: '2',
                        title:
                            '⚠ Expenses crossed 50% salary',
                        time: getNow(),
                        type: 'warning',
                        readed: false,
                    })
                }

                if (
                    salary &&
                    totalExpense >
                        salary *
                            0.75
                ) {
                    list.push({
                        id: '3',
                        title:
                            '🚨 Expenses crossed 75% salary',
                        time: getNow(),
                        type: 'danger',
                        readed: false,
                    })
                }

                if (
                    salary &&
                    totalExpense >
                        salary
                ) {
                    list.push({
                        id: '4',
                        title:
                            '💸 Expenses exceeded salary',
                        time: getNow(),
                        type: 'danger',
                        readed: false,
                    })
                }

                if (
                    salary &&
                    totalSaving >
                        salary *
                            0.2
                ) {
                    list.push({
                        id: '5',
                        title:
                            '💰 Savings reached 20%',
                        time: getNow(),
                        type: 'success',
                        readed: false,
                    })
                }

                if (
                    savings.length ===
                    0
                ) {
                    list.push({
                        id: '6',
                        title:
                            '😕 No savings added this month',
                        time: getNow(),
                        type: 'info',
                        readed: false,
                    })
                }

                borrow.forEach(
                    (
                        item: { returnDate: string | number | Date; personName: any; pendingAmount: any },
                        i: string,
                    ) => {
                        if (
                            item.returnDate
                        ) {
                            const today =
                                new Date()

                            const due =
                                new Date(
                                    item.returnDate,
                                )

                            const diff =
                                Math.ceil(
                                    (
                                        due.getTime() -
                                        today.getTime()
                                    ) /
                                        (
                                            1000 *
                                            60 *
                                            60 *
                                            24
                                        ),
                                )

                            if (
                                diff ===
                                1
                            ) {
                                list.push({
                                    id:
                                        '7' +
                                        i,
                                    title: `📅 ${item.personName} payment due tomorrow`,
                                    time: getNow(),
                                    type: 'warning',
                                    readed: false,
                                })
                            }

                            if (
                                diff <
                                0
                            ) {
                                list.push({
                                    id:
                                        '8' +
                                        i,
                                    title: `⏰ ${item.personName} overdue by ${Math.abs(
                                        diff,
                                    )} days`,
                                    time: getNow(),
                                    type: 'danger',
                                    readed: false,
                                })
                            }
                        }

                        if (
                            Number(
                                item.pendingAmount,
                            ) ===
                            0
                        ) {
                            list.push({
                                id:
                                    '9' +
                                    i,
                                title:
                                    '✅ Borrow/Lend settled',
                                time: getNow(),
                                type: 'success',
                                readed: false,
                            })
                        }
                    },
                )

                if (
                    list.length ===
                    0
                ) {
                    list.push({
                        id: '10',
                        title:
                            '📊 No major alerts right now',
                        time: getNow(),
                        type: 'info',
                        readed: false,
                    })
                }

                setData(list)
            } catch {
                setData([
                    {
                        id: '11',
                        title:
                            '📢 Notifications unavailable',
                        time: getNow(),
                        type: 'info',
                        readed: false,
                    },
                ])
            }
        }

    useEffect(() => {
        loadNotifications()
    }, [])

    const filteredData =
        useMemo(() => {
            return data.filter(
                (
                    item,
                ) => {
                    const a =
                        item.title
                            .toLowerCase()
                            .includes(
                                search.toLowerCase(),
                            )

                    const b =
                        filter ===
                        'all'
                            ? true
                            : item.type ===
                              filter

                    return a && b
                },
            )
        }, [
            data,
            search,
            filter,
        ])

    const markAllRead =
        () => {
            setData(
                data.map(
                    (
                        item,
                    ) => ({
                        ...item,
                        readed: true,
                    }),
                ),
            )
        }

    const getColor = (
        type: string,
    ) => {
        if (
            type ===
            'danger'
        )
            return 'border-red-500'

        if (
            type ===
            'warning'
        )
            return 'border-yellow-500'

        if (
            type ===
            'success'
        )
            return 'border-green-500'

        return 'border-blue-500'
    }

    return (
        <Container>
            <AdaptiveCard>

                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">

                    <div>
                        <h3 className="mb-1">
                            Activity Center
                        </h3>

                        <p className="text-gray-500">
                            Real finance notifications
                        </p>
                    </div>

                    <Button
                        icon={
                            <TbCheck />
                        }
                        variant="solid"
                        onClick={
                            markAllRead
                        }
                    >
                        Mark All Read
                    </Button>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

                    <Input
                        prefix={
                            <TbSearch />
                        }
                        placeholder="Search..."
                        value={
                            search
                        }
                        onChange={(
                            e,
                        ) =>
                            setSearch(
                                e.target
                                    .value,
                            )
                        }
                    />

                    <Select
                        options={
                            filterOptions
                        }
                        value={filterOptions.find(
                            (
                                x,
                            ) =>
                                x.value ===
                                filter,
                        )}
                        onChange={(
                            val: any,
                        ) =>
                            setFilter(
                                val?.value,
                            )
                        }
                    />

                </div>

                <div className="space-y-3">

                    {filteredData.map(
                        (
                            item,
                        ) => (
                            <div
                                key={
                                    item.id
                                }
                                className={`border-l-4 ${getColor(
                                    item.type,
                                )} rounded-xl border bg-gray-50 dark:bg-gray-800 px-4 py-4 flex justify-between gap-4`}
                            >
                                <div>
                                    <div className="font-medium mb-1">
                                        {
                                            item.title
                                        }
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        {
                                            item.time
                                        }
                                    </div>
                                </div>

                                {!item.readed && (
                                    <span className="w-3 h-3 rounded-full bg-primary mt-2"></span>
                                )}
                            </div>
                        ),
                    )}

                    {filteredData.length ===
                        0 && (
                        <div className="text-center py-14 text-gray-500">

                            <TbBell className="mx-auto text-5xl mb-3" />

                            No Notifications

                        </div>
                    )}

                </div>

            </AdaptiveCard>
        </Container>
    )
}

export default Notifications