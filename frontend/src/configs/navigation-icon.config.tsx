import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
    PiWalletDuotone,
    PiReceiptDuotone,
    PiNoteDuotone,
    PiAddressBookDuotone,
} from 'react-icons/pi'

import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon = {
    home: <PiHouseLineDuotone />,
    singleMenu: <PiAcornDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,
    manageSalary: <PiWalletDuotone />,
    manageExpense: <PiReceiptDuotone />,
    notes: <PiNoteDuotone />,
    contacts: <PiAddressBookDuotone />,
}

export default navigationIcon