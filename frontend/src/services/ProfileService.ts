import axios from 'axios'
import { TOKEN_NAME_IN_STORAGE } from '@/constants/api.constant'

const getToken = () => {
    return localStorage.getItem(TOKEN_NAME_IN_STORAGE) || ''
}

export const getProfile = () =>
    axios.get(
        'https://expense-backend-5myt.onrender.com/api/auth/profile',
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    )

export const updateProfile = (payload: any) =>
    axios.put(
        'https://expense-backend-5myt.onrender.com/api/auth/profile',
        payload,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    )

export const changePassword = (payload: any) =>
    axios.put(
        'https://expense-backend-5myt.onrender.com/api/auth/change-password',
        payload,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    )