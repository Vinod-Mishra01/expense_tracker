// navigation.config.ts

import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    // DASHBOARD LABEL
    {
        key: 'dashboard',
        path: '',
        title: 'Dashboard',
        translateKey: 'nav.dashboard',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'home',
                path: '/home',
                title: 'Dashboard',
                translateKey: 'nav.home',
                icon: 'home',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },

             {
                key: 'manageSalary',
                path: '/salary',
                title: 'Manage Salary',
                translateKey:'nav.manageSalary',
                icon: 'home',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },

    // FINANCE LABEL
    {
        key: 'finance',
        path: '',
        title: 'Finance',
        translateKey: 'nav.finance',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            // Expense
            {
                key: 'expense',
                path: '',
                title: 'Manage Expense',
                translateKey: 'nav.expense',
                icon: 'collapseMenu',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'expense.add',
                        path: '/add-expense',
                        title: 'Add Expense',
                        translateKey: 'nav.expense.add',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'expense.view',
                        path: '/view-expenses',
                        title: 'View Expenses',
                        translateKey: 'nav.expense.view',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },

            // Saving
            {
                key: 'saving',
                path: '',
                title: 'Manage Saving',
                translateKey: 'nav.saving',
                icon: 'groupCollapseMenu',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'saving.add',
                        path: '/add-saving',
                        title: 'Add Saving',
                        translateKey: 'nav.saving.add',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'saving.view',
                        path: '/view-savings',
                        title: 'View Savings',
                        translateKey: 'nav.saving.view',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },

            // Borrow & Lend
            {
                key: 'borrow',
                path: '',
                title: 'Borrow & Lend',
                translateKey: 'nav.borrow',
                icon: 'groupMenu',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'borrow.add',
                        path: '/borrow-lend',
                        title: 'Add Record',
                        translateKey: 'nav.borrow.add',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'borrow.view',
                        path: '/view-borrow-lend',
                        title: 'View Records',
                        translateKey: 'nav.borrow.view',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },

// AI LABEL
{
    key: 'aiLabel',
    path: '',
    title: 'AI Assistant',
    translateKey: 'nav.aiLabel',
    icon: '',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    subMenu: [
        {
            key: 'chat',
            path: '/chat',
            title: 'Ask AI',
            translateKey: 'nav.chat',
            icon: 'aiChat',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
        },
    ],
},
        ],
    },
]

export default navigationConfig