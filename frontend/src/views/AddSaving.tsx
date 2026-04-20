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
    { label: 'Bank', value: 'Bank' },
    { label: 'Cash', value: 'Cash' },
     { label: 'Investment', value: 'Investment' },
    { label: 'FD', value: 'FD' },
    { label: 'Other', value: 'Other' },
]

const AddSaving = () => {
    const today = new Date().toISOString().split('T')[0]

    const { token } = useToken()

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'Bank',
        note: '',
        date: today,
    })

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (
            !formData.title ||
            !formData.amount ||
            !formData.type ||
            !formData.date
        ) {
            toast.push(
                <Notification type="danger">
                    Please fill all required fields
                </Notification>,
                { placement: 'top-center' },
            )
            return
        }

        try {
            if (!token) {
                toast.push(
                    <Notification type="danger">
                        Please login again
                    </Notification>,
                    { placement: 'top-center' },
                )
                return
            }

            setLoading(true)

            await axios.post(
                'http://localhost:5000/api/saving/create',
                {
                    ...formData,
                    amount: Number(formData.amount),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            toast.push(
                <Notification type="success">
                    Saving added successfully!
                </Notification>,
                { placement: 'top-center' },
            )

            setFormData({
                title: '',
                amount: '',
                type: 'Bank',
                note: '',
                date: today,
            })
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to add saving
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container>
            <div className="w-full mx-auto">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold">
                        Add Saving
                    </h3>
                    <p className="text-gray-500">
                        Add your savings here
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                    <Form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem label="Saving Title">
                                <Input
                                    value={formData.title}
                                    onChange={(e) =>
                                        handleChange(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Salary / FD / Cash"
                                />
                            </FormItem>

                            <FormItem label="Amount">
                                <Input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) =>
                                        handleChange(
                                            'amount',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="10000"
                                />
                            </FormItem>

                            <FormItem label="Saving Type">
                                <Select
                                    options={typeOptions}
                                    value={typeOptions.find(
                                        (item) =>
                                            item.value ===
                                            formData.type,
                                    )}
                                    onChange={(val: any) =>
                                        handleChange(
                                            'type',
                                            val?.value || '',
                                        )
                                    }
                                />
                            </FormItem>

                            <FormItem label="Date">
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        handleChange(
                                            'date',
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormItem>
                        </div>

                        <div className="mt-4">
                            <FormItem label="Note">
                                <Input
                                    value={formData.note}
                                    onChange={(e) =>
                                        handleChange(
                                            'note',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Optional note"
                                />
                            </FormItem>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        title: '',
                                        amount: '',
                                        type: 'Bank',
                                        note: '',
                                        date: today,
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
                                Save Saving
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Container>
    )
}

export default AddSaving