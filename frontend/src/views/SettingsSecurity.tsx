import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Form, FormItem } from '@/components/ui/Form'
import { changePassword } from '@/services/ProfileService'

const SettingsSecurity =
    () => {
        const [
            form,
            setForm,
        ] =
            useState({
                currentPassword:
                    '',
                newPassword:
                    '',
                confirmPassword:
                    '',
            })

        const [
            loading,
            setLoading,
        ] =
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
                    !form.currentPassword ||
                    !form.newPassword ||
                    !form.confirmPassword
                ) {
                    alert(
                        'All fields are required',
                    )
                    return
                }

                if (
                    form.newPassword !==
                    form.confirmPassword
                ) {
                    alert(
                        'Passwords do not match',
                    )
                    return
                }

                try {
                    setLoading(
                        true,
                    )

                    const res =
                        await changePassword(
                            {
                                currentPassword:
                                    form.currentPassword,
                                newPassword:
                                    form.newPassword,
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
            <Card className="p-6">
                <div className="mb-8">
                    <h4 className="mb-1">
                        Security
                    </h4>

                    <p className="text-gray-500">
                        Change your password securely
                    </p>
                </div>

                <Form
                    onSubmit={handleSubmit}
                >
                    <div className="grid gap-5">
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
                                size="lg"
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
                                size="lg"
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
                                size="lg"
                            />
                        </FormItem>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            variant="solid"
                            type="submit"
                            loading={
                                loading
                            }
                        >
                            Update Password
                        </Button>
                    </div>
                </Form>
            </Card>
        )
    }

export default SettingsSecurity