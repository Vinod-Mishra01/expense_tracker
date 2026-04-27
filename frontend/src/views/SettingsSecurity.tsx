import { useState } from 'react'
import axios from 'axios'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'

const SettingsSecurity = () => {
    const [form, setForm] =
        useState({
            currentPassword:
                '',
            newPassword:
                '',
            confirmPassword:
                '',
        })

    const [loading, setLoading] =
        useState(false)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        })
    }

    const handleSubmit =
        async (
            e: React.FormEvent,
        ) => {
            e.preventDefault()

            if (
                form.newPassword !==
                form.confirmPassword
            ) {
                alert(
                    'Password not match',
                )
                return
            }

            try {
                setLoading(
                    true,
                )

                const sessionData =
                    localStorage.getItem(
                        'sessionUser',
                    )

                let token = ''

                if (
                    sessionData
                ) {
                    const parsed =
                        JSON.parse(
                            sessionData,
                        )

                    token =
                        parsed
                            ?.state
                            ?.user
                            ?.token ||
                        ''
                }

                const res =
                    await axios.put(
                        'https://expense-backend-5myt.onrender.com/api/auth/change-password',
                        {
                            currentPassword:
                                form.currentPassword,
                            newPassword:
                                form.newPassword,
                        },
                        {
                            headers:
                                {
                                    Authorization: `Bearer ${token}`,
                                },
                        },
                    )

                alert(
                    res.data
                        .message ||
                        'Password updated successfully',
                )

                setForm({
                    currentPassword:
                        '',
                    newPassword:
                        '',
                    confirmPassword:
                        '',
                })
            } catch (
                error: any
            ) {
                alert(
                    error
                        ?.response
                        ?.data
                        ?.message ||
                        'Password change failed',
                )
            } finally {
                setLoading(
                    false,
                )
            }
        }

    return (
        <div>
            <h4 className="mb-6">
                Security
            </h4>

            <Form
                onSubmit={
                    handleSubmit
                }
            >
                <FormItem label="Current Password">
                    <Input
                        type="password"
                        name="currentPassword"
                        value={
                            form.currentPassword
                        }
                        onChange={
                            handleChange
                        }
                    />
                </FormItem>

                <FormItem label="New Password">
                    <Input
                        type="password"
                        name="newPassword"
                        value={
                            form.newPassword
                        }
                        onChange={
                            handleChange
                        }
                    />
                </FormItem>

                <FormItem label="Confirm Password">
                    <Input
                        type="password"
                        name="confirmPassword"
                        value={
                            form.confirmPassword
                        }
                        onChange={
                            handleChange
                        }
                    />
                </FormItem>

                <div className="flex justify-end">
                    <Button
                        variant="solid"
                        type="submit"
                        loading={
                            loading
                        }
                    >
                        Update
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default SettingsSecurity