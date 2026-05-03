import axios from 'axios'
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseIntrceptorErrorCallback'
import AxiosRequestIntrceptorConfigCallback from './AxiosRequestIntrceptorConfigCallback'
import appConfig from '@/configs/app.config'
import type { AxiosError } from 'axios'

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
})

AxiosBase.interceptors.request.use(
    (config) => {
        return AxiosRequestIntrceptorConfigCallback(config)
    },
    (error) => {
        return Promise.reject(error)
    },
)

AxiosBase.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        AxiosResponseIntrceptorErrorCallback(error)
        return Promise.reject(error)
    },
)

export default AxiosBase


// import type { AxiosError } from 'axios'
// import { toast } from 'react-toastify'

// let isSessionExpired = false

// const AxiosResponseIntrceptorErrorCallback = (
//     error: AxiosError,
// ) => {
//     const status =
//         error.response?.status

//     if (
//         status === 401 &&
//         !isSessionExpired
//     ) {
//         isSessionExpired = true

//         localStorage.removeItem(
//             'sessionUser',
//         )

//         localStorage.removeItem(
//             'accessToken',
//         )

//         toast.warning(
//             'Session Expired. Please login again.',
//         )

//         setTimeout(() => {
//             window.location.href =
//                 '/sign-in'
//         }, 800)
//     }

//     return Promise.reject(error)
// }

// export const resetSessionExpiredFlag =
//     () => {
//         isSessionExpired = false
//     }

// export default AxiosResponseIntrceptorErrorCallback