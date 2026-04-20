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
        key: 'manageExpense.addExpense',
        path: '/add-expense',
        component: lazy(() => import('@/views/AddExpense')),
        authority: [],
    },
    {
        key: 'manageExpense.viewExpense',
        path: '/view-expenses',
        component: lazy(() => import('@/views/ViewExpenses')),
        authority: [],
    },

    {
        key: 'addSaving',
        path: '/add-saving',
        component: lazy(() => import('@/views/AddSaving')),
        authority: [],
    },

    {
        key: 'borrowLend',
        path: '/borrow-lend',
        component: lazy(() => import('@/views/BorrowLend')),
        authority: [],
    },

    ...othersRoute,
]