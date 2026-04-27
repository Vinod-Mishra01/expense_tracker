import axios from 'axios'

const getToken = () => {
    try {
        const raw =
            localStorage.getItem(
                'sessionUser',
            )

        if (!raw) return ''

        const data =
            JSON.parse(raw)

        return (
            data?.token ||
            data?.user
                ?.token ||
            data?.state
                ?.token ||
            data?.state
                ?.user
                ?.token ||
            ''
        )
    } catch (
        error
    ) {
        return ''
    }
}

export const getProfile =
    () =>
        axios.get(
            'https://expense-backend-5myt.onrender.com/api/auth/profile',
            {
                headers:
                    {
                        Authorization: `Bearer ${getToken()}`,
                    },
            },
        )

export const updateProfile = (
    payload: any,
) =>
    axios.put(
        'https://expense-backend-5myt.onrender.com/api/auth/profile',
        payload,
        {
            headers:
                {
                    Authorization: `Bearer ${getToken()}`,
                },
        },
    )

export const changePassword = (
    payload: any,
) =>
    axios.put(
        'https://expense-backend-5myt.onrender.com/api/auth/change-password',
        payload,
        {
            headers:
                {
                    Authorization: `Bearer ${getToken()}`,
                },
        },
    )