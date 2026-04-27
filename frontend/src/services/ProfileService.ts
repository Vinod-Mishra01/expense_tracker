import axios from 'axios'

const getToken = () => {
    const data = JSON.parse(
        localStorage.getItem('sessionUser') || '{}'
    )

    return data?.state?.user?.token
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