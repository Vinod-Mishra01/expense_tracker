import { useState } from 'react'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import { apiResetPassword } from '@/services/AuthService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams } from 'react-router'
import type { CommonProps } from '@/@types/common'

interface ResetPasswordFormProps extends CommonProps {
    resetComplete: boolean
    setResetComplete?: (
        complete: boolean,
    ) => void
    setMessage?: (
        message: string,
    ) => void
}

type ResetPasswordFormSchema = {
    newPassword: string
    confirmPassword: string
}

const validationSchema = z
    .object({
        newPassword:
            z.string().min(
                6,
                'Minimum 6 characters',
            ),

        confirmPassword:
            z.string().min(
                1,
                'Confirm Password Required',
            ),
    })
    .refine(
        (data) =>
            data.newPassword ===
            data.confirmPassword,
        {
            message:
                'Passwords do not match',
            path: [
                'confirmPassword',
            ],
        },
    )

const ResetPasswordForm = (
    props: ResetPasswordFormProps,
) => {
    const [isSubmitting, setSubmitting] =
        useState(false)

    const {
        className,
        setMessage,
        setResetComplete,
        resetComplete,
        children,
    } = props

    const { token } =
        useParams()

    const {
        handleSubmit,
        formState: {
            errors,
        },
        control,
    } = useForm<ResetPasswordFormSchema>(
        {
            resolver:
                zodResolver(
                    validationSchema,
                ),
        },
    )

    const onResetPassword =
        async (
            values:
                ResetPasswordFormSchema,
        ) => {
            setSubmitting(
                true,
            )

            try {
                await apiResetPassword(
                    token || '',
                    {
                        password:
                            values.newPassword,
                    },
                )

                setResetComplete?.(
                    true,
                )
            } catch (error) {
                setMessage?.(
                    'Failed to reset password',
                )
            } finally {
                setSubmitting(
                    false,
                )
            }
        }

    return (
        <div className={className}>
            {!resetComplete ? (
                <Form
                    onSubmit={handleSubmit(
                        onResetPassword,
                    )}
                >
                    <FormItem
                        label="Password"
                        invalid={Boolean(
                            errors.newPassword,
                        )}
                        errorMessage={
                            errors
                                .newPassword
                                ?.message
                        }
                    >
                        <Controller
                            name="newPassword"
                            control={control}
                            render={({
                                field,
                            }) => (
                                <PasswordInput
                                    placeholder="••••••••"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Confirm Password"
                        invalid={Boolean(
                            errors.confirmPassword,
                        )}
                        errorMessage={
                            errors
                                .confirmPassword
                                ?.message
                        }
                    >
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({
                                field,
                            }) => (
                                <PasswordInput
                                    placeholder="Confirm Password"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <Button
                        block
                        loading={
                            isSubmitting
                        }
                        variant="solid"
                        type="submit"
                    >
                        {isSubmitting
                            ? 'Submitting...'
                            : 'Submit'}
                    </Button>
                </Form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default ResetPasswordForm