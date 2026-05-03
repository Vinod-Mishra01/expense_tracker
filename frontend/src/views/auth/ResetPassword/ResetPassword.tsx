import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ActionLink from '@/components/shared/ActionLink'
import ResetPasswordForm from './components/ResetPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router'

type ResetPasswordProps = {
    signInUrl?: string
}

export const ResetPasswordBase = ({
    signInUrl = '/sign-in',
}: ResetPasswordProps) => {
    const [resetComplete, setResetComplete] =
        useState(false)

    const [message, setMessage] =
        useTimeOutMessage()

    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <Card className="p-6">
                    <div className="mb-6">
                        {resetComplete ? (
                            <>
                                <h3 className="mb-2">
                                    Reset Done
                                </h3>

                                <p className="font-semibold heading-text">
                                    Your password has been successfully reset
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 className="mb-2">
                                    Set New Password
                                </h3>

                                <p className="font-semibold heading-text">
                                    Please enter your new password
                                </p>
                            </>
                        )}
                    </div>

                    {message && (
                        <Alert
                            showIcon
                            className="mb-4"
                            type="danger"
                        >
                            {message}
                        </Alert>
                    )}

                    <ResetPasswordForm
                        resetComplete={resetComplete}
                        setMessage={setMessage}
                        setResetComplete={setResetComplete}
                    >
                        <Button
                            block
                            variant="solid"
                            onClick={() =>
                                navigate(
                                    signInUrl,
                                )
                            }
                        >
                            Continue
                        </Button>
                    </ResetPasswordForm>

                    <div className="mt-4 text-center">
                        <span>
                            Back to{' '}
                        </span>

                        <ActionLink
                            to={signInUrl}
                            className="font-bold"
                            themeColor={false}
                        >
                            Sign in
                        </ActionLink>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default function ResetPassword() {
    return <ResetPasswordBase />
}