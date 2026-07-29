import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Button from '@/components/ui/Button'
import NotificationToggle from './NotificationToggle'
import { HiOutlineMailOpen } from 'react-icons/hi'
import useResponsive from '@/utils/hooks/useResponsive'
import { useNavigate } from 'react-router'
import { useToken } from '@/store/authStore'
import { getNotifications } from '@/utils/getNotifications'

type NotifyItem = {
    id: string
    title: string
    date: string
    readed: boolean
    type: string
}

const notificationHeight = 'h-[350px]'

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<NotifyItem[]>([])
    const [unreadNotification, setUnreadNotification] = useState(false)

    const { larger } = useResponsive()
    const navigate = useNavigate()
    const notificationDropdownRef = useRef<any>(null)

    const { token } = useToken()
    const authToken = token || localStorage.getItem('token')

    const loadNotification = async () => {
        try {
            const data = await getNotifications(authToken as string)

            const isRead = localStorage.getItem('notifications_read') === 'true'

            const mapped = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                date: item.time,
                readed: isRead ? true : item.readed,
                type: item.type,
            }))

            setNotificationList(mapped)
            setUnreadNotification(!isRead && mapped.some(x => !x.readed))

        } catch (error) {
            console.log('NOTIFICATION ERROR:', error)
        }
    }

    useEffect(() => {
        loadNotification()
    }, [])

    const onMarkAllAsRead = () => {
        const updated = notificationList.map(item => ({ ...item, readed: true }))
        setNotificationList(updated)
        setUnreadNotification(false)

        // 🔥 sync with activity page
        localStorage.setItem('notifications_read', 'true')
    }

    const onMarkAsRead = (id: string) => {
        const updated = notificationList.map(item =>
            item.id === id ? { ...item, readed: true } : item,
        )

        setNotificationList(updated)
        setUnreadNotification(updated.some(x => !x.readed))
    }

    return (
        <Dropdown
            ref={notificationDropdownRef}
            renderTitle={
                <NotificationToggle dot={unreadNotification} className={className} />
            }
            menuClass="min-w-[320px] md:min-w-[390px]"
            placement={larger.md ? 'bottom-end' : 'bottom'}
        >
            <Dropdown.Item variant="header">
                <div className="px-2 flex items-center justify-between">
                    <h6>Notifications</h6>
                    <Button
                        variant="plain"
                        shape="circle"
                        size="sm"
                        icon={<HiOutlineMailOpen className="text-xl" />}
                        onClick={onMarkAllAsRead}
                    />
                </div>
            </Dropdown.Item>

            <ScrollBar className={classNames('overflow-y-auto', notificationHeight)}>
                {notificationList.map(item => (
                    <div
                        key={item.id}
                        className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => onMarkAsRead(item.id)}
                    >
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.date}</div>
                    </div>
                ))}
            </ScrollBar>

            <Dropdown.Item variant="header">
                <div className="pt-4 w-full">
                    <button
                        className="w-full bg-primary text-white rounded-lg px-4 py-2"
                        onClick={() => navigate('/notifications')}
                    >
                        View All Activity
                    </button>
                </div>
            </Dropdown.Item>
        </Dropdown>
    )
}

export default withHeaderItem(_Notification)