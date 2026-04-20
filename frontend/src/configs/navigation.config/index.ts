import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
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
        key: 'manageExpense',
        path: '',
        title: 'Manage Expense',
        translateKey: 'nav.manageExpense',
        icon: 'collapseMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'manageExpense.addExpense',
                path: '/add-expense',
                title: 'Add Expense',
                translateKey: 'nav.manageExpense.addExpense',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'manageExpense.viewExpense',
                path: '/view-expenses',
                title: 'View Expenses',
                translateKey: 'nav.manageExpense.viewExpense',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },

    {
        key: 'addSaving',
        path: '/add-saving',
        title: 'Add Saving',
        translateKey: 'nav.addSaving',
        icon: 'groupSingleMenu',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },

    {
        key: 'borrowLend',
        path: '/borrow-lend',
        title: 'Borrow & Lend',
        translateKey: 'nav.borrowLend',
        icon: 'groupCollapseMenu',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig
