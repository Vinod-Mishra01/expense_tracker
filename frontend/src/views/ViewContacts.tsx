// import html2canvas from 'html2canvas'
import html2canvas from 'html2canvas-pro'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
import AxiosBase from '@/services/axios/AxiosBase'
import dayjs from 'dayjs'
import { useToken } from '@/store/authStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import Dialog from '@/components/ui/Dialog'
import toast from '@/components/ui/toast'
import Checkbox from '@/components/ui/Checkbox'
import { TbUpload } from 'react-icons/tb'
import Notification from '@/components/ui/Notification'
import Pagination from '@/components/ui/Pagination'

import {
    TbSearch,
    TbEye,
    TbEdit,
    TbTrash,
    TbPlus,
    TbDownload,
    TbRefresh,
    TbStar,
    TbChecklist,
    TbStarFilled,
} from 'react-icons/tb'

// const API_URL = 'http://localhost:5000/api/contact'
const API_URL = 'https://expense-backend-5myt.onrender.com/api/contact'

type PhoneType = {
    label: string
    number: string
    isPrimary: boolean
}

type EmailType = {
    label: string
    email: string
    isPrimary: boolean
}

type ContactType = {
    _id: string
    firstName: string
    lastName: string
    phoneNumbers: PhoneType[]
    emails: EmailType[]
    birthday: string
    address: string
    notes: string
    photo: string
    favorite: boolean
    createdAt: string
}

const favoriteOptions = [
    {
        value: 'all',
        label: 'All',
    },
    {
        value: 'favorite',
        label: 'Favorites',
    },
    {
        value: 'nonfavorite',
        label: 'Non Favorites',
    },
]

const sortOptions = [
    {
        value: 'newest',
        label: 'Newest First',
    },
    {
        value: 'oldest',
        label: 'Oldest First',
    },
    {
        value: 'az',
        label: 'Name (A-Z)',
    },
    {
        value: 'za',
        label: 'Name (Z-A)',
    },
]

const ViewContacts = () => {
    const navigate = useNavigate()

    const { token } = useToken()

    const [contacts, setContacts] = useState<ContactType[]>([])
    const [loading, setLoading] = useState(false)
    // const [selectionMode, setSelectionMode] = useState(false)
const [selectedContacts, setSelectedContacts] = useState<string[]>([])

    const [search, setSearch] = useState('')
    const [favoriteFilter, setFavoriteFilter] = useState('all')
    const [sortBy, setSortBy] = useState('newest')

    const [selectedContact, setSelectedContact] =
        useState<ContactType | null>(null)

    const [viewOpen, setViewOpen] = useState(false)

    const [deleteOpen, setDeleteOpen] = useState(false)

    const [deleteId, setDeleteId] = useState('')
    

    const [currentPage, setCurrentPage] = useState(1)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const pageSize = 10

    useEffect(() => {
        fetchContacts()
    }, [])




        const fetchContacts = async () => {
        try {
            setLoading(true)

            const res = await AxiosBase.get(`${API_URL}/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

     setContacts(res.data.data || [])
        } catch (err) {
            console.error(err)

            toast.push(
                <Notification
                    type="danger"
                    title="Error"
                >
                    Failed to load contacts.
                </Notification>,
            )
        } finally {
            setLoading(false)
        }
    }

    const confirmDelete = (id: string) => {
        setDeleteId(id)
        setDeleteOpen(true)
    }

    const deleteContact = async () => {
        try {
            await AxiosBase.delete(`${API_URL}/delete/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            toast.push(
                <Notification
                    type="success"
                    title="Success"
                >
                    Contact deleted successfully.
                </Notification>,
            )

            setDeleteOpen(false)

            fetchContacts()
        } catch (err) {
            console.error(err)

            toast.push(
                <Notification
                    type="danger"
                    title="Error"
                >
                    Unable to delete contact.
                </Notification>,
            )
        }
    }

    const toggleFavorite = async (id: string) => {
        try {
            await AxiosBase.patch(
                `${API_URL}/favorite/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            fetchContacts()
        } catch (err) {
            console.error(err)
        }
    }

    const resetFilters = () => {
        setSearch('')
        setFavoriteFilter('all')
        setSortBy('newest')
        setCurrentPage(1)
    }

    const downloadVCF = (contact: ContactType) => {
        const phone =
            contact.phoneNumbers?.find((x) => x.isPrimary)?.number ||
            contact.phoneNumbers?.[0]?.number ||
            ''

        const email =
            contact.emails?.find((x) => x.isPrimary)?.email ||
            contact.emails?.[0]?.email ||
            ''

        const vcf = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName}
TEL:${phone}
EMAIL:${email}
ADR:${contact.address || ''}
NOTE:${contact.notes || ''}
END:VCARD`

        const blob = new Blob([vcf], {
            type: 'text/vcard;charset=utf-8',
        })

        const url = window.URL.createObjectURL(blob)

        const a = document.createElement('a')

        a.href = url

        a.download = `${contact.firstName || 'Contact'}.vcf`

        a.click()

        window.URL.revokeObjectURL(url)
    }

const exportContactAsImage = async () => {
    try {
        const element = document.getElementById('contact-card')

        if (!element) {
            throw new Error('Contact card element not found')
        }

        // Hide elements before export
        document.querySelectorAll('.export-hide').forEach((el) => {
            ;(el as HTMLElement).style.display = 'none'
        })

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#fff',
            logging: false,
        })

        // Show elements again
        document.querySelectorAll('.export-hide').forEach((el) => {
            ;(el as HTMLElement).style.display = ''
        })

        const image = canvas.toDataURL('image/png')

        const link = document.createElement('a')
        link.href = image
        link.download = `${selectedContact?.firstName || 'Contact'}.png`

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.push(
            <Notification type="success" title="Success">
                Contact exported successfully.
            </Notification>,
        )
    } catch (err: any) {
        // Show again if export fails
        document.querySelectorAll('.export-hide').forEach((el) => {
            ;(el as HTMLElement).style.display = ''
        })

        console.error('Export Image Error:', err)

        toast.push(
            <Notification type="danger" title="Export Failed">
                {err?.message || 'Unable to export image.'}
            </Notification>,
        )
    }
}
    const exportAllContacts = () => {
        if (!contacts.length) {
            toast.push(
                <Notification
                    type="warning"
                    title="No Contacts"
                >
                    No contacts available to export.
                </Notification>,
            )

            return
        }

        let vcf = ''

        contacts.forEach((contact) => {
            const phone =
                contact.phoneNumbers?.find((x) => x.isPrimary)?.number ||
                contact.phoneNumbers?.[0]?.number ||
                ''

            const email =
                contact.emails?.find((x) => x.isPrimary)?.email ||
                contact.emails?.[0]?.email ||
                ''

            vcf += `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName}
TEL:${phone}
EMAIL:${email}
ADR:${contact.address || ''}
NOTE:${contact.notes || ''}
END:VCARD
`
        })

        const blob = new Blob([vcf], {
            type: 'text/vcard;charset=utf-8',
        })

        const url = window.URL.createObjectURL(blob)

        const a = document.createElement('a')

        a.href = url

        a.download = 'All_Contacts.vcf'

        a.click()

        window.URL.revokeObjectURL(url)
    }


const deleteSelectedContacts = async () => {
    try {
        await AxiosBase.delete(
            `${API_URL}/delete-multiple`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    ids: selectedContacts,
                },
            },
        )

        toast.push(
            <Notification
                type="success"
                title="Success"
            >
                Contacts deleted successfully.
            </Notification>,
        )

        setSelectedContacts([])

        fetchContacts()
    } catch (err) {
        console.error(err)

        toast.push(
            <Notification
                type="danger"
                title="Error"
            >
                Failed to delete contacts.
            </Notification>,
        )
    }
}




const favoriteSelectedContacts = async () => {
    console.log(selectedContacts)
}

const exportSelectedContacts = () => {
    console.log(selectedContacts)
}

const handleImportVCF = () => {
    fileInputRef.current?.click()
}

const handleVCFFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
) => {
    const file = e.target.files?.[0]

    if (!file) return

    try {
        const formData = new FormData()
        formData.append('file', file)
console.log('API URL =>', AxiosBase.defaults.baseURL)

 await AxiosBase.post(
    `${API_URL}/import-vcf`,
    formData,
    {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    },
)

        toast.push(
            <Notification
                type="success"
                title="Success"
            >
                Contacts imported successfully.
            </Notification>,
            {
                placement: 'top-center',
            },
        )

        // Refresh table
        fetchContacts()

        // Reset input
        e.target.value = ''
    } catch (err) {
        console.error(err)

        toast.push(
            <Notification
                type="danger"
                title="Error"
            >
                Failed to import contacts.
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }
}






    const filteredContacts = useMemo(() => {
        let data = [...contacts]

        if (search.trim()) {
            const keyword = search.toLowerCase()

            data = data.filter((contact) => {
                const fullName =
                    `${contact.firstName} ${contact.lastName}`.toLowerCase()

           const phones = (
    contact.phoneNumbers?.map((x) => x.number).join(' ') || ''
).toLowerCase()

const emails = (
    contact.emails?.map((x) => x.email).join(' ') || ''
).toLowerCase()

                return (
                    fullName.includes(keyword) ||
                    phones.includes(keyword) ||
                    emails.includes(keyword) ||
                    (contact.address || '')
                        .toLowerCase()
                        .includes(keyword) ||
                    (contact.notes || '')
                        .toLowerCase()
                        .includes(keyword)
                )
            })
        }

        if (favoriteFilter === 'favorite') {
            data = data.filter((x) => x.favorite)
        }

        if (favoriteFilter === 'nonfavorite') {
            data = data.filter((x) => !x.favorite)
        }

        switch (sortBy) {
            case 'az':
                data.sort((a, b) =>
                    `${a.firstName} ${a.lastName}`.localeCompare(
                        `${b.firstName} ${b.lastName}`,
                    ),
                )
                break

            case 'za':
                data.sort((a, b) =>
                    `${b.firstName} ${b.lastName}`.localeCompare(
                        `${a.firstName} ${a.lastName}`,
                    ),
                )
                break

            case 'oldest':
                data.sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                )
                break

            default:
                data.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                )
        }

        return data
    }, [contacts, search, favoriteFilter, sortBy])

    const totalPages = Math.ceil(filteredContacts.length / pageSize)

    const paginatedContacts = filteredContacts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
    )







        return (
        <Card>
            <div className="flex flex-col gap-5">

                {/* Header */}
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    <div>
        <h3 className="font-bold text-xl">
            {selectedContacts.length > 0
                ? `${selectedContacts.length} Selected`
                : 'View Contacts'}
        </h3>

        <p className="text-gray-500 mt-1">
            {selectedContacts.length > 0
                ? 'Choose an action'
                : `Total Contacts : ${filteredContacts.length}`}
        </p>
    </div>

    <div className="flex gap-2 flex-wrap">

        {selectedContacts.length > 0 ? (
            <>
            <Button
    color="red"
    icon={<TbTrash />}
    disabled={selectedContacts.length === 0}
    onClick={deleteSelectedContacts}
>
    Delete ({selectedContacts.length})
</Button>

<Button
    icon={<TbStar />}
    disabled={selectedContacts.length === 0}
    onClick={favoriteSelectedContacts}
>
    Favorite
</Button>

<Button
    icon={<TbDownload />}
    disabled={selectedContacts.length === 0}
    onClick={exportSelectedContacts}
>
    Export ({selectedContacts.length})
</Button>
            </>
        ) : (
            <>
                <Button
                    variant="default"
                    icon={<TbUpload />}
                    onClick={handleImportVCF}
                >
                    Import VCF
                </Button>
            </>
        )}

    </div>

    <input
        ref={fileInputRef}
        type="file"
        accept=".vcf"
        className="hidden"
        onChange={handleVCFFileChange}
    />

</div>

                {/* Filters */}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                    <Input
                        placeholder="Search Contact..."
                        prefix={<TbSearch />}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setCurrentPage(1)
                        }}
                    />

                    <Select
                        options={favoriteOptions}
                        value={favoriteOptions.find(
                            (x) => x.value === favoriteFilter,
                        )}
                        onChange={(val: any) => {
                            setFavoriteFilter(val.value)
                            setCurrentPage(1)
                        }}
                    />

                    <Select
                        options={sortOptions}
                        value={sortOptions.find(
                            (x) => x.value === sortBy,
                        )}
                        onChange={(val: any) => {
                            setSortBy(val.value)
                            setCurrentPage(1)
                        }}
                    />

                    <Button
                        icon={<TbRefresh />}
                        onClick={resetFilters}
                    >
                        Reset
                    </Button>

                    {/* <Button
                        variant="solid"
                        icon={<TbDownload />}
                        onClick={exportAllContacts}
                    >
                        Export 
                    </Button> */}

                </div>

                {/* Table */}

                <div className="overflow-x-auto rounded-lg border border-gray-200">

                    <table className="min-w-full">

                        <thead className="bg-gray-100">

                            <tr>
  
        <th className="px-4 py-3">
            <Checkbox
                checked={
                    paginatedContacts.length > 0 &&
                    selectedContacts.length === paginatedContacts.length
                }
                onChange={(checked) => {
                    if (checked) {
                        setSelectedContacts(
                            paginatedContacts.map((x) => x._id)
                        )
                    } else {
                        setSelectedContacts([])
                    }
                }}
            />
        </th>


                                <th className="px-4 py-3 text-left w-16">
                                    #
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Photo
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Name
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Phone
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Email
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Birthday
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Favorite
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                    colSpan={8}
                                        className="text-center py-12"
                                    >
                                        Loading Contacts...
                                    </td>

                                </tr>

                            ) : paginatedContacts.length === 0 ? (

                                <tr>

                                    <td
                       colSpan={8}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No Contacts Found
                                    </td>

                                </tr>

                            ) : (







                                                                paginatedContacts.map((contact, index) => {

                                    const primaryPhone =
                                        contact.phoneNumbers?.find(
                                            (x) => x.isPrimary,
                                        )?.number ||
                                        contact.phoneNumbers?.[0]?.number ||
                                        'N/A'

                                    const primaryEmail =
                                        contact.emails?.find(
                                            (x) => x.isPrimary,
                                        )?.email ||
                                        contact.emails?.[0]?.email ||
                                        'N/A'

                                    return (
                                        <tr
                                            key={contact._id}
                                            className="border-t hover:bg-gray-50 transition"
                                        >



    <td className="px-4 py-3">
        <Checkbox
            checked={selectedContacts.includes(contact._id)}
            onChange={(checked) => {
                if (checked) {
                    setSelectedContacts((prev) => [
                        ...prev,
                        contact._id,
                    ])
                } else {
                    setSelectedContacts((prev) =>
                        prev.filter((id) => id !== contact._id)
                    )
                }
            }}
        />
    </td>




                                            <td className="px-4 py-3">
                                                {(currentPage - 1) * pageSize +
                                                    index +
                                                    1}
                                            </td>

                                            <td className="px-4 py-3">
                                              <Avatar
    size={40}
    shape="circle"
    src={
        contact.photo
            // ? `http://localhost:5000/uploads/contacts/${contact.photo}`
            ? `https://expense-backend-5myt.onrender.com/uploads/contacts/${contact.photo}`
            : undefined
    }
>
                                                    {`${contact.firstName?.[0] || ''}${contact.lastName?.[0] || ''}`}
                                                </Avatar>
                                            </td>

                                            <td className="px-4 py-3 font-semibold">
                                                {`${contact.firstName || ''} ${contact.lastName || ''}`.trim() ||
                                                    'N/A'}
                                            </td>

                                            <td className="px-4 py-3">
                                                {primaryPhone}
                                            </td>

                                            <td className="px-4 py-3">
                                                {primaryEmail}
                                            </td>

                                            <td className="px-4 py-3">
                                                {contact.birthday
                                                    ? dayjs(
                                                          contact.birthday,
                                                      ).format(
                                                          'DD MMM YYYY',
                                                      )
                                                    : 'N/A'}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <Button
                                                    size="xs"
                                                    variant="plain"
                                                    onClick={() =>
                                                        toggleFavorite(
                                                            contact._id,
                                                        )
                                                    }
                                                >
                                                    {contact.favorite ? (
                                                        <TbStarFilled className="text-yellow-500 text-lg" />
                                                    ) : (
                                                        <TbStar className="text-lg" />
                                                    )}
                                                </Button>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="xs"
                                                        variant="plain"
                                                        icon={<TbEye />}
                                                        onClick={() => {
                                                            setSelectedContact(
                                                                contact,
                                                            )
                                                            setViewOpen(true)
                                                        }}
                                                    />

                                                    <Button
                                                        size="xs"
                                                        variant="plain"
                                                        icon={<TbEdit />}
                                                        onClick={() =>
                                                            navigate(
                                                                `/edit-contact/${contact._id}`,
                                                            )
                                                        }
                                                    />

                                                    <Button
                                                        size="xs"
                                                        variant="plain"
                                                        icon={<TbTrash />}
                                                        onClick={() =>
                                                            confirmDelete(
                                                                contact._id,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}

                        </tbody>

                    </table>

                </div>

                {totalPages > 1 && (
                    <div className="flex justify-end mt-5">
                        <Pagination
                            currentPage={currentPage}
                            total={filteredContacts.length}
                            pageSize={pageSize}
                            onChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                )}
                                {/* View Contact Dialog */}

                <Dialog
                    isOpen={viewOpen}
                    width={700}
                    onClose={() => setViewOpen(false)}
                    onRequestClose={() => setViewOpen(false)}
                >
                    {selectedContact && (
                        <div
                            id="contact-card"
                            className="bg-white rounded-xl p-6 shadow-sm"
                        >
                            <div className="flex flex-col items-center">

                   <div className="flex justify-center">
    {selectedContact.photo ? (
        <img
            // src={`http://localhost:5000/uploads/contacts/${selectedContact.photo}`}

            src={`https://expense-backend-5myt.onrender.com/uploads/contacts/${selectedContact.photo}`}
            alt={selectedContact.firstName}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
        />
    ) : (
        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-white">
            {`${selectedContact.firstName?.[0] ?? ''}${selectedContact.lastName?.[0] ?? ''}`}
        </div>
    )}
</div>

                                <h3 className="mt-4 font-bold text-xl">
                                    {`${selectedContact.firstName || ''} ${selectedContact.lastName || ''}`.trim() ||
                                        'N/A'}
                                </h3>

                                <div className="mt-2">
                                    {selectedContact.favorite ? (
                                        <TbStarFilled className="text-yellow-500 text-2xl" />
                                    ) : (
                                        <TbStar className="text-2xl" />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                                <div>
                                    <h6 className="font-semibold mb-2">
                                        Phone Numbers
                                    </h6>

                                    {selectedContact.phoneNumbers.length ? (
                                        selectedContact.phoneNumbers.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="mb-2"
                                                >
                                                    <span className="font-medium">
                                                        {item.label} :
                                                    </span>{' '}
                                                    {item.number || 'N/A'}
                                                    {item.isPrimary && (
                                                        <span className="text-green-600 ml-2 text-xs">
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <div>N/A</div>
                                    )}
                                </div>

                                <div>
                                    <h6 className="font-semibold mb-2">
                                        Email Addresses
                                    </h6>

                                    {selectedContact.emails.length ? (
                                        selectedContact.emails.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="mb-2"
                                                >
                                                    <span className="font-medium">
                                                        {item.label} :
                                                    </span>{' '}
                                                    {item.email || 'N/A'}
                                                    {item.isPrimary && (
                                                        <span className="text-green-600 ml-2 text-xs">
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <div>N/A</div>
                                    )}
                                </div>

                                <div>
                                    <h6 className="font-semibold mb-2">
                                        Birthday
                                    </h6>

                                    <p>
                                        {selectedContact.birthday
                                            ? dayjs(
                                                  selectedContact.birthday,
                                              ).format('DD MMM YYYY')
                                            : 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <h6 className="font-semibold mb-2">
                                        Address
                                    </h6>

                                    <p>
                                        {selectedContact.address || 'N/A'}
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <h6 className="font-semibold mb-2">
                                        Notes
                                    </h6>

                                    <div className="whitespace-pre-wrap">
                                        {selectedContact.notes || 'N/A'}
                                    </div>
                                </div>

                            </div>

                            <div className="export-hide  flex justify-end gap-3 mt-8">

                                <Button
                                    icon={<TbDownload />}
                                    onClick={() =>
                                        downloadVCF(selectedContact)
                                    }
                                >
                                    Download VCF
                                </Button>

                                <Button
                                    variant="solid"
                                    onClick={exportContactAsImage}
                                >
                                    Export Image
                                </Button>

                                <Button
                                    onClick={() =>
                                        setViewOpen(false)
                                    }
                                >
                                    Close
                                </Button>

                            </div>
                        </div>
                    )}
                </Dialog>
                                {/* Delete Confirmation Dialog */}

                <Dialog
                    isOpen={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    onRequestClose={() => setDeleteOpen(false)}
                >
                    <div className="p-2">

                        <h5 className="mb-2">
                            Delete Contact
                        </h5>

                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete this contact?
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">

                            <Button
                                onClick={() => setDeleteOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="solid"
                                color="red-600"
                                icon={<TbTrash />}
                                onClick={deleteContact}
                            >
                                Delete
                            </Button>

                        </div>

                    </div>
                </Dialog>

            </div>
        </Card>
    )
}

export default ViewContacts