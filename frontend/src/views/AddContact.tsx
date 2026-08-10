import React, { useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { useToken } from '@/store/authStore'
import AxiosBase from '@/services/axios/AxiosBase'

import {
    Button,
    Card,
    Checkbox,
    DatePicker,
    FormItem,
    Input,
    Notification,
    toast,
} from '@/components/ui'

import Container from '@/components/shared/Container'

import { HiOutlineTrash, HiPlus } from 'react-icons/hi'
import { PiImageDuotone } from 'react-icons/pi'

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

const AddContact = () => {
    // const token = localStorage.getItem('accessToken') || ''
    const { token } = useToken()

    const fileRef = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState('')

    const [photo, setPhoto] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthday: null as Date | null,
        address: '',
        notes: '',
        favorite: false,
    })

    const [phoneNumbers, setPhoneNumbers] = useState<PhoneType[]>([
        {
            label: 'Mobile',
            number: '',
            isPrimary: true,
        },
    ])
const { id } = useParams()
const isEdit = !!id


    const [emails, setEmails] = useState<EmailType[]>([
        {
            label: 'Personal',
            email: '',
            isPrimary: true,
        },
    ])

    const handleChange = (
        key: string,
        value: string | boolean | Date | null,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const addPhone = () => {
        setPhoneNumbers((prev) => [
            ...prev,
            {
                label: 'Mobile',
                number: '',
                isPrimary: false,
            },
        ])
    }

    const removePhone = (index: number) => {
        setPhoneNumbers((prev) =>
            prev.filter((_, i) => i !== index),
        )
    }

    const updatePhone = (
        index: number,
        key: keyof PhoneType,
        value: string | boolean,
    ) => {
        const data = [...phoneNumbers]

        if (!data[index]) return

        data[index] = {
            ...data[index],
            [key]: value,
        }

        setPhoneNumbers(data)
    }

    const addEmail = () => {
        setEmails((prev) => [
            ...prev,
            {
                label: 'Personal',
                email: '',
                isPrimary: false,
            },
        ])
    }

    const removeEmail = (index: number) => {
        setEmails((prev) =>
            prev.filter((_, i) => i !== index),
        )
    }

    const updateEmail = (
        index: number,
        key: keyof EmailType,
        value: string | boolean,
    ) => {
        const data = [...emails]

        if (!data[index]) return

        data[index] = {
            ...data[index],
            [key]: value,
        }

        setEmails(data)
    }

    const handleImage = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0]

        if (!file) return

        setPhoto(file)
        setPreview(URL.createObjectURL(file))
    }

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            birthday: null,
            address: '',
            notes: '',
            favorite: false,
        })

        setPhoneNumbers([
            {
                label: 'Mobile',
                number: '',
                isPrimary: true,
            },
        ])

        setEmails([
            {
                label: 'Personal',
                email: '',
                isPrimary: true,
            },
        ])

        setPhoto(null)
        setPreview('')

        if (fileRef.current) {
            fileRef.current.value = ''
        }
    }

    const handleCancel = () => {
        resetForm()
    }

        const saveContact = async () => {
        if (!formData.firstName.trim()) {
        
            return
        }

        if (
            !phoneNumbers.some(
                (item) => item.number.trim() !== '',
            )
        ) {
            toast.push(
                <Notification type="danger">
                    Please enter at least one phone number
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            return
        }

        try {
            setLoading(true)

            const data = new FormData()

            data.append(
                'firstName',
                formData.firstName,
            )

            data.append(
                'lastName',
                formData.lastName,
            )

            data.append(
                'birthday',
                formData.birthday
                    ? formData.birthday.toISOString()
                    : '',
            )

            data.append(
                'address',
                formData.address,
            )

            data.append(
                'notes',
                formData.notes,
            )

            data.append(
                'favorite',
                String(formData.favorite),
            )

            data.append(
                'phoneNumbers',
                JSON.stringify(phoneNumbers),
            )

            data.append(
                'emails',
                JSON.stringify(emails),
            )

            if (photo) {
                data.append('photo', photo)
            }
console.log('TOKEN =>', token)
console.log('ACCESS TOKEN =>', localStorage.getItem('accessToken'))
          if (isEdit) {
    await AxiosBase.put(
        // `http://localhost:5000/api/contact/update/${id}`,
        `https://expense-backend-5myt.onrender.com/api/contact/update/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        },
    )

    toast.push(
        <Notification type="success">
            Contact updated successfully
        </Notification>,
        {
            placement: 'top-center',
        },
    )
} else {
    await AxiosBase.post(
        // 'http://localhost:5000/api/contact/create',
        'https://expense-backend-5myt.onrender.com/api/contact/create',
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        },
    )

    // toast.push(
    //     <Notification type="success">
    //         Contact added successfully
    //     </Notification>,
    //     {
    //         placement: 'top-center',
    //     },
    // )
}

            toast.push(
                <Notification type="success">
                    Contact added successfully
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

           if (!isEdit) {
    resetForm()
}

            setLoading(false)
     } catch (error: any) {

    setLoading(false)

    if (
        error.response?.status === 409 &&
        error.response?.data?.duplicate
    ) {
        toast.push(
            <Notification type="warning">
                Contact already exists with the same phone number or email.
            </Notification>,
            {
                placement: 'top-center',
            },
        )

        return
    }

    toast.push(
        <Notification type="danger">
            Failed to save contact
        </Notification>,
        {
            placement: 'top-center',
        },
    )
}
    }
useEffect(() => {
    if (isEdit) {
        fetchContact()
    }
}, [id])
const fetchContact = async () => {
    try {
        const res = await AxiosBase.get(
            // `http://localhost:5000/api/contact/${id}`,
            `https://expense-backend-5myt.onrender.com/api/contact/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )

        const contact = res.data.data

        setFormData({
            firstName: contact.firstName || '',
            lastName: contact.lastName || '',
            birthday: contact.birthday
                ? new Date(contact.birthday)
                : null,
            address: contact.address || '',
            notes: contact.notes || '',
            favorite: contact.favorite || false,
        })

        setPhoneNumbers(contact.phoneNumbers || [])
        setEmails(contact.emails || [])

        if (contact.photo) {
            setPreview(
                // `http://localhost:5000/uploads/contacts/${contact.photo}`,
                `https://expense-backend-5myt.onrender.com/uploads/contacts/${contact.photo}`,
            )
        }
    } catch (err) {
        console.error(err)
    }
}
    return (
                <Container>
     <div className="flex items-center justify-between mb-6">
                <div>
                  <h3>{isEdit ? 'Edit Contact' : 'Add Contact'}</h3>
                    <p className="text-gray-500">
                        Save personal and business
                        contacts
                    </p>
                </div>

                {/* <Button
                    variant="solid"
                    loading={loading}
                    onClick={saveContact}
                >
                    Save Contact
                </Button> */}
            </div>
            <Card>

                {/* Profile Image */}

                <div className="flex justify-center mb-8">

                    <div
                        className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={() => fileRef.current?.click()}
                    >
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <PiImageDuotone
                                size={40}
                                className="text-gray-400"
                            />
                        )}
                    </div>

                    <input
                        ref={fileRef}
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />

                </div>

                <div className="grid grid-cols-2 gap-5">

                    <FormItem label="First Name">
                        <Input
                            value={formData.firstName}
                            onChange={(e) =>
                                handleChange(
                                    'firstName',
                                    e.target.value,
                                )
                            }
                        />
                    </FormItem>

                    <FormItem label="Last Name">
                        <Input
                            value={formData.lastName}
                            onChange={(e) =>
                                handleChange(
                                    'lastName',
                                    e.target.value,
                                )
                            }
                        />
                    </FormItem>

                </div>

                {/* Phone Numbers */}

                <div className="mt-8">

                    <div className="flex justify-between items-center mb-4">

                        <h5>Phone Numbers</h5>

                        <Button
                            size="sm"
                            icon={<HiPlus />}
                            onClick={addPhone}
                        >
                            Add Number
                        </Button>

                    </div>

                    {phoneNumbers.map((phone, index) => (

                        <div
                            key={index}
                            className="grid grid-cols-12 gap-3 mb-3"
                        >

                            <div className="col-span-3">

                                <Input
                                    value={phone.label}
                                    placeholder="Label"
                                    onChange={(e) =>
                                        updatePhone(
                                            index,
                                            'label',
                                            e.target.value,
                                        )
                                    }
                                />

                            </div>

                            <div className="col-span-7">

                                <Input
                                    value={phone.number}
                                    placeholder="Phone Number"
                                    onChange={(e) =>
                                        updatePhone(
                                            index,
                                            'number',
                                            e.target.value,
                                        )
                                    }
                                />

                            </div>

                            <div className="col-span-2 flex items-center gap-2">

                                <Checkbox
                                    checked={phone.isPrimary}
                                    onChange={(checked) =>
                                        updatePhone(
                                            index,
                                            'isPrimary',
                                            checked,
                                        )
                                    }
                                >
                                    Primary
                                </Checkbox>

                                {phoneNumbers.length > 1 && (
                                    <Button
                                        size="sm"
                                        color="red"
                                        icon={<HiOutlineTrash />}
                                        onClick={() =>
                                            removePhone(index)
                                        }
                                    />
                                )}

                            </div>

                        </div>

                    ))}
                                    </div>
                                    {/* Email Addresses */}

                <div className="mt-8">

                    <div className="flex justify-between items-center mb-4">

                        <h5>Email Addresses</h5>

                        <Button
                            size="sm"
                            icon={<HiPlus />}
                            onClick={addEmail}
                        >
                            Add Email
                        </Button>

                    </div>

                    {emails.map((email, index) => (

                        <div
                            key={index}
                            className="grid grid-cols-12 gap-3 mb-3"
                        >

                            <div className="col-span-3">

                                <Input
                                    value={email.label}
                                    placeholder="Label"
                                    onChange={(e) =>
                                        updateEmail(
                                            index,
                                            'label',
                                            e.target.value,
                                        )
                                    }
                                />

                            </div>

                            <div className="col-span-7">

                                <Input
                                    value={email.email}
                                    placeholder="Email Address"
                                    onChange={(e) =>
                                        updateEmail(
                                            index,
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                />

                            </div>

                            <div className="col-span-2 flex items-center gap-2">

                                <Checkbox
                                    checked={email.isPrimary}
                                    onChange={(checked) =>
                                        updateEmail(
                                            index,
                                            'isPrimary',
                                            checked,
                                        )
                                    }
                                >
                                    Primary
                                </Checkbox>

                                {emails.length > 1 && (
                                    <Button
                                        size="sm"
                                        color="red"
                                        icon={<HiOutlineTrash />}
                                        onClick={() =>
                                            removeEmail(index)
                                        }
                                    />
                                )}

                            </div>

                        </div>

                    ))}

                </div>

                {/* Other Details */}

                <div className="grid grid-cols-2 gap-5 mt-8">

                    <FormItem label="Birthday">

                        <DatePicker
                            value={formData.birthday}
                            onChange={(date) =>
                                handleChange(
                                    'birthday',
                                    date,
                                )
                            }
                        />

                    </FormItem>

                    <FormItem label="Address">

                        <Input
                            value={formData.address}
                            onChange={(e) =>
                                handleChange(
                                    'address',
                                    e.target.value,
                                )
                            }
                        />

                    </FormItem>

                </div>

                <div className="mt-5">

                    <FormItem label="Notes">

                        <Input
                            textArea
                            rows={5}
                            value={formData.notes}
                            onChange={(e) =>
                                handleChange(
                                    'notes',
                                    e.target.value,
                                )
                            }
                        />

                    </FormItem>

                </div>

                <div className="mt-5">

                    <Checkbox
                        checked={formData.favorite}
                        onChange={(checked) =>
                            handleChange(
                                'favorite',
                                checked,
                            )
                        }
                    >
                        Mark as Favorite Contact
                    </Checkbox>

                </div>

                <div className="flex justify-end gap-3 mt-8 border-t pt-6">

                    <Button
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>

                  <Button
    variant="solid"
    loading={loading}
    onClick={saveContact}
>
    {isEdit ? 'Update Contact' : 'Save Contact'}
</Button>

                </div>

            </Card>

        </Container>
    )
}



export default AddContact