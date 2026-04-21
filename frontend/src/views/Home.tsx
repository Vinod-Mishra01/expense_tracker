// src/views/Home.tsx
// FULL FINAL CODE
// ✅ cards tabs working
// ✅ area chart
// ✅ no feature removed

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Container from '@/components/shared/Container'
import Loading from '@/components/shared/Loading'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import Chart from '@/components/shared/Chart'
import { useToken } from '@/store/authStore'
import {
    TbWallet,
    TbReceipt2,
    TbPigMoney,
    TbArrowBackUp,
    TbTrendingUp,
    TbCategory,
} from 'react-icons/tb'

const periodOptions = [
    { label: 'Monthly', value: 'month' },
    { label: 'Weekly', value: 'week' },
    { label: 'Yearly', value: 'year' },
]

const Home = () => {
    const { token } = useToken()

    const authToken =
        token ||
        localStorage.getItem('token')

    const [loading, setLoading] =
        useState(false)

    const [period, setPeriod] =
        useState('month')

    const [activeTab, setActiveTab] =
        useState('expense')

    const [expenses, setExpenses] =
        useState<any[]>([])

    const [savings, setSavings] =
        useState<any[]>([])

    const [borrow, setBorrow] =
        useState<any[]>([])

    const fetchData = async () => {
        try {
            setLoading(true)

            const headers = {
                Authorization: `Bearer ${authToken}`,
            }

            const [
                expRes,
                savRes,
                borRes,
            ] = await Promise.all([
                axios.get(
                    'http://localhost:5000/api/expense/list',
                    { headers },
                ),
                axios.get(
                    'http://localhost:5000/api/saving/list',
                    { headers },
                ),
                axios.get(
                    'http://localhost:5000/api/borrow-lend/list',
                    { headers },
                ),
            ])

            setExpenses(
                expRes.data || [],
            )
            setSavings(
                savRes.data || [],
            )
            setBorrow(
                borRes.data || [],
            )
        } catch {
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (authToken) {
            fetchData()
        }
    }, [authToken])

    const makeChart = (
        arr: any[],
        field: string,
    ) => {
        const map: any = {}

        arr.forEach(
            (item) => {
                const d =
                    new Date(
                        item.date,
                    )

                const key =
                    d.toLocaleString(
                        'default',
                        {
                            month: 'short',
                        },
                    )

                map[key] =
                    (map[key] ||
                        0) +
                    Number(
                        item[
                            field
                        ] || 0,
                    )
            },
        )

        return {
            categories:
                Object.keys(
                    map,
                ),
            values:
                Object.values(
                    map,
                ),
        }
    }

    const expenseChart =
        makeChart(
            expenses,
            'amount',
        )

    const savingChart =
        makeChart(
            savings,
            'amount',
        )

    const borrowChart =
        makeChart(
            borrow,
            'pendingAmount',
        )

    const totalExpense =
        expenses.reduce(
            (a, b) =>
                a +
                Number(
                    b.amount || 0,
                ),
            0,
        )

    const totalSaving =
        savings.reduce(
            (a, b) =>
                a +
                Number(
                    b.amount || 0,
                ),
            0,
        )

    const pendingBorrow =
        borrow.reduce(
            (a, b) =>
                a +
                Number(
                    b.pendingAmount ||
                        0,
                ),
            0,
        )

    const availableBalance =
        totalSaving -
        totalExpense

    let graphTitle =
        'Expense'

    let graphData =
        expenseChart

    if (
        activeTab ===
        'saving'
    ) {
        graphTitle =
            'Saving'
        graphData =
            savingChart
    }

    if (
        activeTab ===
        'borrow'
    ) {
        graphTitle =
            'Borrow'
        graphData =
            borrowChart
    }

    if (
        activeTab ===
        'balance'
    ) {
        graphTitle =
            'Balance'
        graphData = {
            categories: [
                'Balance',
            ],
            values: [
                availableBalance,
            ],
        }
    }

    const categoryData =
        useMemo(() => {
            const map: any =
                {}

            expenses.forEach(
                (
                    item,
                ) => {
                    map[
                        item.category ||
                            'Other'
                    ] =
                        (map[
                            item.category ||
                                'Other'
                        ] ||
                            0) +
                        Number(
                            item.amount,
                        )
                },
            )

            return {
                labels:
                    Object.keys(
                        map,
                    ),
                values:
                    Object.values(
                        map,
                    ),
            }
        }, [expenses])

    const recentExpenses =
        [...expenses]
            .sort(
                (
                    a,
                    b,
                ) =>
                    new Date(
                        b.date,
                    ).getTime() -
                    new Date(
                        a.date,
                    ).getTime(),
            )
            .slice(0, 5)

    const activeClass = (
        key: string,
    ) =>
        activeTab === key
            ? 'ring-2 ring-primary bg-primary text-white'
            : 'bg-white dark:bg-gray-900'

    return (
        <Loading loading={loading}>
            <Container>
                <div className="flex flex-col gap-4">

                    <div className="flex flex-col xl:flex-row gap-4">

                        {/* LEFT */}
                        <div className="flex-1 flex flex-col gap-4">

                            <Card>
                                <div className="flex justify-between items-center">
                                    <h4>
                                        Overview
                                    </h4>

                                    <Select
                                        className="w-[130px]"
                                        value={periodOptions.find(
                                            (
                                                x,
                                            ) =>
                                                x.value ===
                                                period,
                                        )}
                                        options={periodOptions}
                                        onChange={(
                                            val: any,
                                        ) =>
                                            setPeriod(
                                                val?.value,
                                            )
                                        }
                                    />
                                </div>

                                {/* TABS */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl">

                                    <button
                                        onClick={() =>
                                            setActiveTab(
                                                'expense',
                                            )
                                        }
                                        className={`${activeClass(
                                            'expense',
                                        )} rounded-2xl p-4 text-left shadow-sm`}
                                    >
                                        <div className="flex justify-between">
                                            <span>
                                                Total Expense
                                            </span>
                                            <TbReceipt2 />
                                        </div>
                                        <h3 className="mt-3">
                                            ₹
                                            {totalExpense}
                                        </h3>
                                    </button>

                                    <button
                                        onClick={() =>
                                            setActiveTab(
                                                'saving',
                                            )
                                        }
                                        className={`${activeClass(
                                            'saving',
                                        )} rounded-2xl p-4 text-left shadow-sm`}
                                    >
                                        <div className="flex justify-between">
                                            <span>
                                                Total Saving
                                            </span>
                                            <TbPigMoney />
                                        </div>
                                        <h3 className="mt-3">
                                            ₹
                                            {totalSaving}
                                        </h3>
                                    </button>

                                    <button
                                        onClick={() =>
                                            setActiveTab(
                                                'balance',
                                            )
                                        }
                                        className={`${activeClass(
                                            'balance',
                                        )} rounded-2xl p-4 text-left shadow-sm`}
                                    >
                                        <div className="flex justify-between">
                                            <span>
                                                Balance
                                            </span>
                                            <TbWallet />
                                        </div>
                                        <h3 className="mt-3">
                                            ₹
                                            {availableBalance}
                                        </h3>
                                    </button>

                                    <button
                                        onClick={() =>
                                            setActiveTab(
                                                'borrow',
                                            )
                                        }
                                        className={`${activeClass(
                                            'borrow',
                                        )} rounded-2xl p-4 text-left shadow-sm`}
                                    >
                                        <div className="flex justify-between">
                                            <span>
                                                Borrow Pending
                                            </span>
                                            <TbArrowBackUp />
                                        </div>
                                        <h3 className="mt-3">
                                            ₹
                                            {pendingBorrow}
                                        </h3>
                                    </button>

                                </div>

                                {/* GRAPH */}
                                <div className="mt-5">
                                    <Chart
                                        type="area"
                                        height="420px"
                                        series={[
                                            {
                                                name: graphTitle,
                                                data: graphData.values,
                                            },
                                        ]}
                                        xAxis={
                                            graphData.categories
                                        }
                                        customOptions={{
                                            dataLabels: {
                                                enabled: false,
                                            },
                                            stroke: {
                                                curve: 'smooth',
                                                width: 3,
                                            },
                                            fill: {
                                                type: 'gradient',
                                                gradient: {
                                                    shadeIntensity: 1,
                                                    opacityFrom: 0.4,
                                                    opacityTo: 0.05,
                                                    stops: [
                                                        0,
                                                        90,
                                                        100,
                                                    ],
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* RIGHT */}
                        <div className="w-full xl:w-[360px] flex flex-col gap-4">

                            <Card>
                                <div className="flex justify-between items-center mb-3">
                                    <h4>
                                        Savings Ratio
                                    </h4>

                                    <TbTrendingUp />
                                </div>

                                <h2>
                                    {totalSaving >
                                    0
                                        ? Math.round(
                                              (availableBalance /
                                                  totalSaving) *
                                                  100,
                                          )
                                        : 0}
                                    %
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    Current financial health
                                </p>
                            </Card>
<Card>
    <div className="flex justify-between items-center mb-3">
        <h4>
            Expense Ratio
        </h4>

        <TbReceipt2 />
    </div>

    <h2>
        {totalSaving > 0
            ? Math.round(
                  (totalExpense /
                      totalSaving) *
                      100,
              )
            : 0}
        %
    </h2>

    <p className="text-gray-500 mt-1">
        Expense vs savings usage
    </p>

    <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
            className="bg-red-500 h-2 rounded-full"
            style={{
                width: `${
                    totalSaving > 0
                        ? Math.min(
                              Math.round(
                                  (totalExpense /
                                      totalSaving) *
                                      100,
                              ),
                              100,
                          )
                        : 0
                }%`,
            }}
        ></div>
    </div>
</Card>
                            <Card>
                                <div className="flex justify-between items-center mb-3">
                                    <h4>
                                        Categories
                                    </h4>

                                    <TbCategory />
                                </div>

                                <Chart
                                    type="donut"
                                    height="255px"
                                    series={categoryData.values}
                                    customOptions={{
                                        labels:
                                            categoryData.labels,
                                    }}
                                />
                            </Card>

                        </div>
                    </div>




                    

 

{/* BOTTOM */}
<Card>
    <div className="flex justify-between items-center mb-4">
        <div>
            <h4>
                Recent Expenses
            </h4>

            <p className="text-sm text-gray-500 mt-1">
                Latest transactions summary
            </p>
        </div>
    </div>

    <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">

            <thead>
                <tr className="border-b text-left text-sm text-gray-500">

                    <th className="py-3 px-2">
                        No.
                    </th>

                    <th className="py-3 px-2">
                        Title
                    </th>

                    <th className="py-3 px-2">
                        Category
                    </th>

                    <th className="py-3 px-2">
                        Amount
                    </th>

                    <th className="py-3 px-2">
                        Date
                    </th>

                    <th className="py-3 px-2">
                        Status
                    </th>

                </tr>
            </thead>

            <tbody>

                {recentExpenses.length >
                0 ? (
                    recentExpenses.map(
                        (
                            item,
                            i,
                        ) => (
                            <tr
                                key={
                                    i
                                }
                                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >

                                <td className="py-3 px-2 font-medium">
                                    {i + 1}
                                </td>

                                <td className="py-3 px-2 font-semibold">
                                    {
                                        item.title
                                    }
                                </td>

                                <td className="py-3 px-2">
                                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700">
                                        {
                                            item.category
                                        }
                                    </span>
                                </td>

                                <td className="py-3 px-2 font-semibold text-red-500">
                                    ₹
                                    {
                                        item.amount
                                    }
                                </td>

                                <td className="py-3 px-2 text-sm text-gray-500">
                                    {new Date(
                                        item.date,
                                    ).toLocaleDateString()}
                                </td>

                                <td className="py-3 px-2">
                                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                        Added
                                    </span>
                                </td>

                            </tr>
                        ),
                    )
                ) : (
                    <tr>
                        <td
                            colSpan={
                                6
                            }
                            className="text-center py-10 text-gray-500"
                        >
                            No recent expenses found
                        </td>
                    </tr>
                )}

            </tbody>

        </table>
    </div>
</Card>

                </div>
            </Container>
        </Loading>
    )
}

export default Home