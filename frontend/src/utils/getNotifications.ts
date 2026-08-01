// import axios from 'axios'

import AxiosBase from '@/services/axios/AxiosBase'

export const getNotifications = async (authToken: string) => {
    const headers = {
        Authorization: `Bearer ${authToken}`,
    }

    const [expRes, savRes, borRes, salRes] =
        await Promise.all([
      AxiosBase.get('https://expense-backend-5myt.onrender.com/api/expense/list', { headers }),
        AxiosBase.get('https://expense-backend-5myt.onrender.com/api/saving/list', { headers }),
AxiosBase.get('https://expense-backend-5myt.onrender.com/api/borrow-lend/list', { headers }),
AxiosBase.get('https://expense-backend-5myt.onrender.com/api/salary/list', { headers })
        ])

    const expenses = expRes.data || []
    const savings = savRes.data || []
    const borrow = borRes.data || []
    const salaryData = salRes.data || []

    const salary = salaryData.reduce(
        (a: number, b: any) => a + Number(b.amount || 0),
        0,
    )

    const totalExpense = expenses.reduce(
        (a: number, b: any) => a + Number(b.amount || 0),
        0,
    )

    const totalSaving = savings.reduce(
        (a: number, b: any) => a + Number(b.amount || 0),
        0,
    )

    const list: any[] = []

    const now = () => new Date().toLocaleString()

    // entries
    expenses.slice(-5).forEach((e: any, i: number) => {
        list.push({
            id: 'exp' + i,
            title: `💸 Expense ₹${e.amount}`,
            time: new Date(e.createdAt).toLocaleString(),
            type: 'info',
            readed: false,
        })
    })

    savings.slice(-3).forEach((s: any, i: number) => {
        list.push({
            id: 'sav' + i,
            title: `💰 Saved ₹${s.amount}`,
            time: new Date(s.createdAt).toLocaleString(),
            type: 'success',
            readed: false,
        })
    })

    // salary
    if (salary > 0) {
        list.push({
            id: 'salary',
            title: `💼 Salary ₹${salary}`,
            time: now(),
            type: 'success',
            readed: false,
        })
    } else {
        list.push({
            id: 'nosalary',
            title: '💼 Add salary',
            time: now(),
            type: 'info',
            readed: false,
        })
    }

    // alerts
    if (salary && totalExpense > salary * 0.5)
        list.push({
            id: '50',
            title: '⚠ 50% spent',
            time: now(),
            type: 'warning',
            readed: false,
        })

    if (salary && totalExpense > salary * 0.75)
        list.push({
            id: '75',
            title: '🚨 75% spent',
            time: now(),
            type: 'danger',
            readed: false,
        })

    if (salary && totalExpense > salary)
        list.push({
            id: '100',
            title: '💸 Salary exceeded',
            time: now(),
            type: 'danger',
            readed: false,
        })

    // borrow
    borrow.forEach((b: any, i: number) => {
        list.push({
            id: 'bor' + i,
            title: `🤝 ${b.personName} ₹${b.amount}`,
            time: new Date(b.createdAt).toLocaleString(),
            type: 'info',
            readed: false,
        })
    })

    return list.reverse()
}