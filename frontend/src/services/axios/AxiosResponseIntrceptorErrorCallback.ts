import { useSessionUser, useToken } from '@/store/authStore'
import type { AxiosError } from 'axios'

const unauthorizedCode = [401, 419, 440]

let isRedirecting = false

const AxiosResponseIntrceptorErrorCallback = (
    error: AxiosError,
) => {
    const { response } = error
    const { setToken } = useToken()

    if (
        response &&
        unauthorizedCode.includes(response.status) &&
        !isRedirecting
    ) {
        isRedirecting = true

        // Clear Auth Store
        setToken('')
        useSessionUser.getState().setUser({})
        useSessionUser.getState().setSessionSignedIn(false)

        // Redirect only if not already on login page
        if (window.location.pathname !== '/sign-in') {
            window.location.replace('/sign-in')
        }
    }

    return Promise.reject(error)
}

export default AxiosResponseIntrceptorErrorCallback