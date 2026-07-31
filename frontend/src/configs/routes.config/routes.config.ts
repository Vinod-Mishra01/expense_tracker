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


    // Notes
{
    key: 'note.add',
    path: '/add-note',
    component: lazy(() => import('@/views/AddNote')),
    authority: [],
},
{
    key: 'note.view',
    path: '/view-notes',
    component: lazy(() => import('@/views/ViewNotes')),
    authority: [],
},
{
    key: 'editContact',
    path: '/edit-contact/:id',
    component: lazy(() => import('@/views/AddContact')),
    authority: [],
},


{
    key: 'addContact',
    path: '/add-contact',
    component: lazy(() => import('@/views/AddContact')),
},
{
    key: 'viewContacts',
    path: '/view-contacts',
    component: lazy(() => import('@/views/ViewContacts')),
},


{
    key: 'notifications',
    path: '/notifications',
    component: lazy(() => import('@/views/Notifications')),
    authority: [],
},
{
    key: 'chat',
    path: '/chat',
    component: lazy(() => import('@/views/Chat')),
    authority: [],
},

{
    key: 'profile',
    path: '/profile',
    component: lazy(() => import('@/views/SettingsProfile')),
    authority: [],
},

{
    key: 'security',
    path: '/security',
    component: lazy(() => import('@/views/SettingsSecurity')),
    authority: [],
},
    ...othersRoute,
]