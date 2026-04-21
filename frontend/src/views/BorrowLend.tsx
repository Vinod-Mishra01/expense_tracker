// src/views/BorrowLend.tsx
// FULL FINAL UPDATED FILE

import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useToken } from '@/store/authStore'
import axios from 'axios'

const typeOptions = [
    { label: 'Borrow', value: 'Borrow' },
    { label: 'Lend', value: 'Lend' },
]

const BorrowLend = () => {
    const today = new Date().toISOString().split('T')[0]

    const { token } = useToken()

    const authToken =
        token || localStorage.getItem('token')

    const [loading, setLoading] =
        useState(false)

    const [formData, setFormData] =
        useState({
            type: 'Borrow',
            personName: '',
            amount: '',
            paidAmount: '',
            date: today,
            returnDate: '',
            note: '',
        })

    const handleChange = (
        name: string,
        value: string,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (
        e: any,
    ) => {
        e.preventDefault()

        if (
            !formData.personName ||
            !formData.amount ||
            !formData.date
        ) {
            toast.push(
                <Notification type="danger">
                    Please fill all required fields
                </Notification>,
                {
                    placement:
                        'top-center',
                },
            )
            return
        }

        try {
            setLoading(true)

            await axios.post(
                'https://expense-backend-5myt.onrender.com/api/borrow-lend/create',
                {
                    ...formData,
                    amount: Number(
                        formData.amount,
                    ),
                    paidAmount:
                        Number(
                            formData.paidAmount,
                        ) || 0,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                },
            )

            toast.push(
                <Notification type="success">
                    Record added successfully
                </Notification>,
                {
                    placement:
                        'top-center',
                },
            )

            setFormData({
                type: 'Borrow',
                personName: '',
                amount: '',
                paidAmount: '',
                date: today,
                returnDate: '',
                note: '',
            })
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to add record
                </Notification>,
                {
                    placement:
                        'top-center',
                },
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container>
            <div className="w-full mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold">
                        Add Record
                    </h3>

                    <p className="text-gray-500">
                        Track borrow & lend money
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">

                    <Form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <FormItem label="Type">
                                <Select
                                    options={typeOptions}
                                    value={typeOptions.find(
                                        (
                                            item,
                                        ) =>
                                            item.value ===
                                            formData.type,
                                    )}
                                    onChange={(
                                        val: any,
                                    ) =>
                                        handleChange(
                                            'type',
                                            val?.value ||
                                                '',
                                        )
                                    }
                                />
                            </FormItem>

                            <FormItem label="Person Name">
                                <Input
                                    value={formData.personName}
                                    onChange={(
                                        e,
                                    ) =>
                                        handleChange(
                                            'personName',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Rahul"
                                />
                            </FormItem>

                            <FormItem label="Amount">
                                <Input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(
                                        e,
                                    ) =>
                                        handleChange(
                                            'amount',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="10000"
                                />
                            </FormItem>

                            <FormItem label="Paid / Returned">
                                <Input
                                    type="number"
                                    value={formData.paidAmount}
                                    onChange={(
                                        e,
                                    ) =>
                                        handleChange(
                                            'paidAmount',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="0"
                                />
                            </FormItem>

                            <FormItem label="Given / Taken Date">
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(
                                        e,
                                    ) =>
                                        handleChange(
                                            'date',
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormItem>

                            <FormItem label="Return Date">
                                <Input
                                    type="date"
                                    value={formData.returnDate}
                                    onChange={(
                                        e,
                                    ) =>
                                        handleChange(
                                            'returnDate',
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormItem>

                            <div className="md:col-span-2">
                                <FormItem label="Note">
                                    <Input
                                        value={formData.note}
                                        onChange={(
                                            e,
                                        ) =>
                                            handleChange(
                                                'note',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Optional note"
                                    />
                                </FormItem>
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-3">

                            <Button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        type: 'Borrow',
                                        personName:
                                            '',
                                        amount:
                                            '',
                                        paidAmount:
                                            '',
                                        date: today,
                                        returnDate:
                                            '',
                                        note: '',
                                    })
                                }
                            >
                                Reset
                            </Button>

                            <Button
                                variant="solid"
                                type="submit"
                                loading={loading}
                            >
                                Save Record
                            </Button>

                        </div>

                    </Form>
                </div>
            </div>
        </Container>
    )
}

export default BorrowLend