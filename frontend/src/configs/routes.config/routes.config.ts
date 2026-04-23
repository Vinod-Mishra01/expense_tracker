// routes.config.ts

import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
{
    key: 'salary',
    path: '/salary',
    component: lazy(() => import('@/views/Salary')),
    authority: [],
},
    // Expenses
    {
        key: 'expense.add',
        path: '/add-expense',
        component: lazy(() => import('@/views/AddExpense')),
        authority: [],
    },
    {
        key: 'expense.view',
        path: '/view-expenses',
        component: lazy(() => import('@/views/ViewExpenses')),
        authority: [],
    },

    // Savings
    {
        key: 'saving.add',
        path: '/add-saving',
        component: lazy(() => import('@/views/AddSaving')),
        authority: [],
    },
    {
        key: 'saving.view',
        path: '/view-savings',
        component: lazy(() => import('@/views/ViewSavings')),
        authority: [],
    },

    // Borrow & Lend
    {
        key: 'borrow.add',
        path: '/borrow-lend',
        component: lazy(() => import('@/views/BorrowLend')),
        authority: [],
    },
    {
        key: 'borrow.view',
        path: '/view-borrow-lend',
        component: lazy(() => import('@/views/ViewBorrowLend')),
        authority: [],
    },
{
    key: 'notifications',
    path: '/notifications',
    component: lazy(() => import('@/views/Notifications')),
    authority: [],
},
    ...othersRoute,
]