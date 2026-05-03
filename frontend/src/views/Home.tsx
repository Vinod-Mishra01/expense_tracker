// src/views/Home.tsx
// FULL FINAL UPDATED FILE
// ✅ Monthly + Year selector
// ✅ Existing UI kept
// ✅ Cards monthly based
// ✅ Borrow global
// ✅ Charts kept

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Container from '@/components/shared/Container'
import Loading from '@/components/shared/Loading'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { useNavigate } from 'react-router'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Chart from '@/components/shared/Chart'
import { useToken, useSessionUser } from '@/store/authStore'
import {
    TbWallet,
    TbReceipt2,
    TbPigMoney,
    TbArrowBackUp,
    TbTrendingUp,
    TbCategory,
} from 'react-icons/tb'

const Home = () => {
    const navigate =
        useNavigate()

    const { token } =
        useToken()

    const hydrated =
        useSessionUser(
            (state) =>
                state.hydrated,
        )

    const signedIn =
        useSessionUser(
            (state) =>
                state.session
                    .signedIn,
        )

    const [loading, setLoading] =
        useState(false)

    const [expenses, setExpenses] =
        useState<any[]>([])

    const [savings, setSavings] =
        useState<any[]>([])

    const [borrow, setBorrow] =
        useState<any[]>([])

    const [salaryData, setSalaryData] =
        useState<any[]>([])

    const [activeTab, setActiveTab] =
        useState('balance')

    // -------------------------
    // DATE FILTER
    // -------------------------

    const now = new Date()

    const [selectedMonth, setSelectedMonth] =
        useState<any>(
            now.getMonth(),
        )

    const [selectedYear, setSelectedYear] =
        useState<any>(
            now.getFullYear(),
        )

    const monthOptions = [
        { label: 'All', value: 'all' },
        ...[
            'January','February','March','April','May','June',
            'July','August','September','October','November','December',
        ].map((item, index) => ({
            label: item,
            value: index,
        })),
    ]

    const yearOptions = [
        { label: 'All', value: 'all' },
        ...[2024, 2025, 2026, 2027, 2028, 2029].map((y) => ({
            label: String(y),
            value: y,
        })),
    ]

    // -------------------------
    // FETCH DATA
    // -------------------------

 const fetchData = async () => {
    try {
        setLoading(true)

        const authToken =
            token ||
            localStorage.getItem(
                'token',
            )

        if (!authToken) {
            navigate(
                '/sign-in',
            )
            return
        }

        const headers = {
            Authorization: `Bearer ${authToken}`,
        }

        const results =
            await Promise.allSettled(
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

                    axios.get(
                        'https://expense-backend-5myt.onrender.com/api/salary/list',
                        { headers },
                    ),
                ],
            )

        setExpenses(
            results[0].status ===
                'fulfilled'
                ? results[0].value
                      .data || []
                : [],
        )

        setSavings(
            results[1].status ===
                'fulfilled'
                ? results[1].value
                      .data || []
                : [],
        )

        setBorrow(
            results[2].status ===
                'fulfilled'
                ? results[2].value
                      .data || []
                : [],
        )

        setSalaryData(
            results[3].status ===
                'fulfilled'
                ? results[3].value
                      .data || []
                : [],
        )
    } catch (error: any) {
        if (
            error?.response
                ?.status ===
            401
        ) {
            toast.push(
                <Notification
                    title="Session Expired"
                    type="warning"
                >
                    Please login again.
                </Notification>,
            )

            navigate(
                '/sign-in',
            )
        } else {
            console.log(
                'Dashboard fetch error',
                error,
            )
        }
    } finally {
        setLoading(false)
    }
}

    // -------------------------
    // 🔥 FIXED EFFECT
    // -------------------------

useEffect(() => {
    if (!hydrated) return

    const authToken =
        token ||
        localStorage.getItem(
            'token',
        )

    if (
        !signedIn ||
        !authToken
    ) {
        localStorage.removeItem(
            'token',
        )

        localStorage.removeItem(
            'sessionUser',
        )

        toast.push(
            <Notification
                title="Session Expired"
                type="warning"
            >
                Please login again.
            </Notification>,
        )

        navigate(
            '/sign-in',
        )

        return
    }

    fetchData()
}, [
    hydrated,
    signedIn,
    token,
])






const filterByMonth =
    (
        arr: any[],
    ) =>
        arr.filter(
            (
                item,
            ) => {
                const d =
                    new Date(
                        item.date,
                    )

                const monthMatch =
                    selectedMonth ===
                        'all' ||
                    d.getMonth() ===
                        selectedMonth

                const yearMatch =
                    selectedYear ===
                        'all' ||
                    d.getFullYear() ===
                        selectedYear

                return (
                    monthMatch &&
                    yearMatch
                )
            },
        )

const monthlyExpenses =
    filterByMonth(
        expenses,
    )

const monthlySavings =
    filterByMonth(
        savings,
    )

const totalExpense =
    monthlyExpenses.reduce(
        (
            a,
            b,
        ) =>
            a +
            Number(
                b.amount ||
                    0,
            ),
        0,
    )

const totalSaving =
    monthlySavings.reduce(
        (
            a,
            b,
        ) =>
            a +
            Number(
                b.amount ||
                    0,
            ),
        0,
    )

const monthlySalary =
    salaryData.filter(
        (
            item,
        ) => {
            if (
                item.date &&
                !isNaN(
                    new Date(
                        item.date,
                    ).getTime(),
                )
            ) {
                const d =
                    new Date(
                        item.date,
                    )

                const monthMatch =
                    selectedMonth ===
                        'all' ||
                    d.getMonth() ===
                        selectedMonth

                const yearMatch =
                    selectedYear ===
                        'all' ||
                    d.getFullYear() ===
                        selectedYear

                return (
                    monthMatch &&
                    yearMatch
                )
            }

            const oldMonthMatch =
                selectedMonth ===
                    'all' ||
                item.month ===
                    monthOptions.find(
                        (
                            x,
                        ) =>
                            x.value ===
                            selectedMonth,
                    )?.label

            const oldYearMatch =
                selectedYear ===
                    'all' ||
                String(
                    item.year,
                ) ===
                    String(
                        selectedYear,
                    )

            return (
                oldMonthMatch &&
                oldYearMatch
            )
        },
    )

const totalSalary =
    monthlySalary.reduce(
        (
            a,
            b,
        ) => {
            const net =
                b.netSalary !==
                    undefined &&
                b.netSalary !==
                    null
                    ? Number(
                          b.netSalary,
                      )
                    : Number(
                          b.grossSalary ||
                              0,
                      ) -
                      Number(
                          b.deduction ||
                              0,
                      )

            return (
                a +
                net +
                Number(
                    b.extraIncome ||
                        0,
                )
            )
        },
        0,
    )

const availableBalance =
    totalSalary -
    totalExpense -
    totalSaving

const pendingBorrow =
    borrow
        .filter(
            (
                item,
            ) =>
                item.type ===
                'Borrow',
        )
        .reduce(
            (
                a,
                b,
            ) =>
                a +
                Number(
                    b.pendingAmount ||
                        0,
                ),
            0,
        )

const pendingLend =
    borrow
        .filter(
            (
                item,
            ) =>
                item.type ===
                'Lend',
        )
        .reduce(
            (
                a,
                b,
            ) =>
                a +
                Number(
                    b.pendingAmount ||
                        0,
                ),
            0,
        )


const expenseRatio =
    totalSalary >
    0
        ? Math.round(
              (totalExpense /
                  totalSalary) *
                  100,
          )
        : 0

const savingRatio =
    totalSalary >
    0
        ? Math.round(
              (totalSaving /
                  totalSalary) *
                  100,
          )
        : 0

const categoryData =
    useMemo(() => {
        const map: any =
            {}

        monthlyExpenses.forEach(
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
    }, [
        monthlyExpenses,
    ])






const recentExpenses =
    [
        ...monthlyExpenses,
    ]
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





const chartDays =
    monthlyExpenses.map(
        (
            item,
        ) =>
            new Date(
                item.date,
            ).getDate(),
    )

const chartAmounts =
    monthlyExpenses.map(
        (
            item,
        ) =>
            Number(
                item.amount,
            ),
    )

 const chartLabels = [
    ...new Set([
        ...monthlyExpenses.map(
            (x) =>
                new Date(
                    x.date,
                ).getDate(),
        ),
        ...monthlySavings.map(
            (x) =>
                new Date(
                    x.date,
                ).getDate(),
        ),
    ]),
].sort(
    (
        a,
        b,
    ) => a - b,
)

const chartExpenseData =
    chartLabels.map(
        (day) =>
            monthlyExpenses
                .filter(
                    (x) =>
                        new Date(
                            x.date,
                        ).getDate() ===
                        day,
                )
                .reduce(
                    (
                        a,
                        b,
                    ) =>
                        a +
                        Number(
                            b.amount ||
                                0,
                        ),
                    0,
                ),
    )

const chartSavingData =
    chartLabels.map(
        (day) =>
            monthlySavings
                .filter(
                    (x) =>
                        new Date(
                            x.date,
                        ).getDate() ===
                        day,
                )
                .reduce(
                    (
                        a,
                        b,
                    ) =>
                        a +
                        Number(
                            b.amount ||
                                0,
                        ),
                    0,
                ),
    )

const chartBorrowData =
    chartLabels.map(
        () =>
            pendingBorrow,
    )

const chartLendData =
    chartLabels.map(
        () =>
            pendingLend,
    )

const activeClass =
    (
        key: string,
    ) =>
        activeTab ===
        key
            ? 'ring-2 ring-primary bg-primary text-white'
            : 'bg-white dark:bg-gray-900'

return (
        <Loading
            loading={
                loading
            }
        >
            <Container>
                <div className="flex flex-col gap-4">

                    <div className="flex gap-3 ">

                   

                        <Select
                            className="w-[150px] border-1 rounded-lg"
                            value={yearOptions.find(
                                (
                                    x,
                                ) =>
                                    x.value ===
                                    selectedYear,
                            )}
                            options={
                                yearOptions
                            }
                            onChange={(
                                val: any,
                            ) =>
                                setSelectedYear(
                                    val.value,
                                )
                            }
                        />

                             <Select
                            className="w-[150px]  border-1 rounded-lg"
                            value={monthOptions.find(
                                (
                                    x,
                                ) =>
                                    x.value ===
                                    selectedMonth,
                            )}
                            options={
                                monthOptions
                            }
                            onChange={(
                                val: any,
                            ) =>
                                setSelectedMonth(
                                    val.value,
                                )
                            }
                        />

                    </div>

                    <div className="flex flex-col xl:flex-row gap-4">

                        <div className="flex-1">

                            <Card>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">


                                               <button
                                        onClick={() =>
                                            setActiveTab(
                                                'balance',
                                            )
                                        }
                                        className={`${activeClass(
                                            'balance',
                                        )} rounded-2xl p-4 border-1  text-left`}
                                    >
                                        <div className="flex justify-between">
                                            <span>
                                                Balance
                                            </span>
                                            <TbWallet />
                                        </div>

                                        <h3 className="mt-3 text-[22px] " >
                                            ₹
                                            {availableBalance}
                                        </h3>
                                    </button>




                                    <button
                                        onClick={() =>
                                            setActiveTab(
                                                'expense',
                                            )
                                        }
                                        className={`${activeClass(
                                            'expense',
                                        )} rounded-2xl p-4  border-1 text-left`}
                                    >
                                        <div className="flex justify-between">
                                            <span>
                                                Expense
                                            </span>
                                            <TbReceipt2 />
                                        </div>

                                        <h3 className="mt-3 text-[22px]">
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
                                        )} rounded-2xl p-4 border-1  text-left`}
                                    >
                                        <div className="flex justify-between">
                                            <span>
                                                Saving
                                            </span>
                                            <TbPigMoney />
                                        </div>

                                        <h3 className="mt-3 text-[22px]">
                                            ₹
                                            {totalSaving}
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
    )} rounded-2xl p-4 border-1 text-left`}
>
    <div className="flex justify-between">
        <span>
            Borrow / Lend
        </span>

        <TbArrowBackUp />
    </div>

    <h3 className="mt-3">
        ₹{pendingBorrow} / ₹{pendingLend}
    </h3>
</button>

                                </div>








                                <div className="mt-5">

                                 <Chart
    type="line"
    height={420}
    series={
        activeTab ===
        'balance'
            ? [
                  {
                      name: 'Expense',
                      data: chartExpenseData,
                  },
                  {
                      name: 'Saving',
                      data: chartSavingData,
                  },
                           {
                      name: 'Borrow',
                      data: chartBorrowData,
                  },
                  {
                      name: 'Lend',
                      data: chartLendData,
                  },
              ]
            : activeTab ===
              'expense'
            ? [
                  {
                      name: 'Expense',
                      data: chartExpenseData,
                  },
              ]
            : activeTab ===
              'saving'
            ? [
                  {
                      name: 'Saving',
                      data: chartSavingData,
                  },
              ]
            : [
               
                  {
                      name: 'Lend',
                      data: chartLendData,
                  },
              ]
    }
    options={{
        chart: {
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },

        stroke: {
            curve: 'smooth',
            width:
                activeTab ===
                'balance'
                    ? [4, 4, 4]
                    : activeTab ===
                      'borrow'
                    ? [4, 4]
                    : [4],
            dashArray:
                activeTab ===
                'balance'
                    ? [0, 6, 8]
                    : [0],
        },

        dataLabels: {
            enabled: false,
        },

        legend: {
            show: true,
            position: 'top',
        },

        xaxis: {
            categories:
                chartLabels.map(
                    (
                        x,
                    ) =>
                        String(
                            x,
                        ),
                ),
        },

        yaxis: {
            labels: {
                formatter:
                    (
                        val,
                    ) =>
                        `₹${Math.round(
                            val,
                        )}`,
            },
        },

        tooltip: {
            y: {
                formatter:
                    (
                        val,
                    ) =>
                        `₹${val}`,
            },
        },

        grid: {
            borderColor:
                '#e5e7eb',
        },
    }}
/>
</div>
                            </Card>




                        </div>

                        <div className="w-full xl:w-[260px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">

                            <Card>
                                <div className="flex justify-between mb-3">
                                    <h4>
                                        Saving Ratio
                                    </h4>
                                    <TbTrendingUp />
                                </div>

                                <h2>
                                    {
                                        savingRatio
                                    }
                                    %
                                </h2>
                            </Card>

                            <Card>
                                <div className="flex justify-between mb-3">
                                    <h4>
                                        Expense Ratio
                                    </h4>
                                    <TbReceipt2 />
                                </div>

                                <h2>
                                    {
                                        expenseRatio
                                    }
                                    %
                                </h2>
                            </Card>

                            <Card>
                                <div className="flex justify-between mb-3">
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

                    <Card>

                        <h4 className="mb-4">
                            Recent Expenses
                        </h4>

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[700px]">

                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="py-3">
                                            No.
                                        </th>
                                        <th className="py-3">
                                            Title
                                        </th>
                                        <th className="py-3">
                                            Category
                                        </th>
                                        <th className="py-3">
                                            Amount
                                        </th>
                                        <th className="py-3">
                                            Date
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {recentExpenses.map(
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
                                                <td className="py-3">
                                                    {i +
                                                        1}
                                                </td>
                                                <td className="py-3">
                                                    {
                                                        item.title
                                                    }
                                                </td>
                                                <td className="py-3">
                                                    {
                                                        item.category
                                                    }
                                                </td>
                                                <td className="py-3">
                                                    ₹
                                                    {
                                                        item.amount
                                                    }
                                                </td>
                                                <td className="py-3">
                                                    {new Date(
                                                        item.date,
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ),
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