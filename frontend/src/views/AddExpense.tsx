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

const categoryOptions = [
    { label: 'Food', value: 'Food' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Rent', value: 'Rent' },
    { label: 'Bills', value: 'Bills' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Medical', value: 'Medical' },
    { label: 'Other', value: 'Other' },
]

const paymentOptions = [
    { label: 'Cash', value: 'Cash' },
    { label: 'UPI', value: 'UPI' },
    { label: 'Card', value: 'Card' },
]

const AddExpense = () => {
    const today = new Date().toISOString().split('T')[0]

    const { token } = useToken()

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        detail: '',
        date: today,
        paymentMethod: 'Cash',
        remark: '',
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
    !formData.category ||
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
                'https://expense-backend-5myt.onrender.com/api/expense/create',
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
                    Expense added successfully!
                </Notification>,
                { placement: 'top-center' },
            )

            setFormData({
                title: '',
                amount: '',
                category: '',
                detail: '',
                date: today,
                paymentMethod: 'Cash',
                remark: '',
            })
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Failed to add expense
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
                    <h3 className="text-2xl font-bold">Add Expense</h3>
                    <p className="text-gray-500">
                        Add your daily expenses here
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                    <Form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem label="Expense Title">
                                <Input
                                    value={formData.title}
                                    onChange={(e) =>
                                        handleChange(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Pizza / Rent / Petrol"
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
                                    placeholder="500"
                                />
                            </FormItem>

                            <FormItem label="Category">
                                <Select
                                    options={categoryOptions}
                                    value={categoryOptions.find(
                                        (item) =>
                                            item.value ===
                                            formData.category,
                                    )}
                                    onChange={(val: any) =>
                                        handleChange(
                                            'category',
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

                            <FormItem label="Payment Method">
                                <Select
                                    options={paymentOptions}
                                    value={paymentOptions.find(
                                        (item) =>
                                            item.value ===
                                            formData.paymentMethod,
                                    )}
                                    onChange={(val: any) =>
                                        handleChange(
                                            'paymentMethod',
                                            val?.value || '',
                                        )
                                    }
                                />
                            </FormItem>

                            <FormItem label="Detail">
                                <Input
                                    value={formData.detail}
                                    onChange={(e) =>
                                        handleChange(
                                            'detail',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Short detail"
                                />
                            </FormItem>
                        </div>

                        <div className="mt-4">
                            <FormItem label="Remark">
                                <Input
                                    value={formData.remark}
                                    onChange={(e) =>
                                        handleChange(
                                            'remark',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Optional remark"
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
                                        category: '',
                                        detail: '',
                                        date: today,
                                        paymentMethod: 'Cash',
                                        remark: '',
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
                                Save Expense
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Container>
    )
}

export default AddExpense