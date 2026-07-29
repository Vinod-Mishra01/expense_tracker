import { useEffect, useMemo, useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { useToken } from '@/store/authStore'
import { TbBell, TbSearch, TbCheck } from 'react-icons/tb'
import { getNotifications } from '@/utils/getNotifications'

type NotifyItem = {
    id: string
    title: string
    time: string
    type: 'danger' | 'warning' | 'success' | 'info'
    readed: boolean
}

const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Danger', value: 'danger' },
    { label: 'Warning', value: 'warning' },
    { label: 'Success', value: 'success' },
    { label: 'Info', value: 'info' },
]

const Notifications = () => {
    const [data, setData] = useState<NotifyItem[]>([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')

    const { token } = useToken()
    const authToken = token || localStorage.getItem('token')

    const loadNotifications = async () => {
        try {
            const apiData = await getNotifications(authToken as string)

            // 🔥 CHECK IF USER ALREADY MARKED READ
            const isRead = localStorage.getItem('notifications_read') === 'true'

            if (isRead) {
                setData(apiData.map(item => ({ ...item, readed: true })))
            } else {
                setData(apiData)
            }
        } catch (error) {
            console.log('PAGE NOTIFICATION ERROR:', error)
        }
    }

    useEffect(() => {
        loadNotifications()
    }, [])

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const a = item.title.toLowerCase().includes(search.toLowerCase())
            const b = filter === 'all' ? true : item.type === filter
            return a && b
        })
    }, [data, search, filter])

    const markAllRead = () => {
        const updated = data.map(item => ({ ...item, readed: true }))
        setData(updated)

        // 🔥 SYNC WITH BELL
        localStorage.setItem('notifications_read', 'true')
    }

    const getColor = (type: string) => {
        if (type === 'danger') return 'border-red-500'
        if (type === 'warning') return 'border-yellow-500'
        if (type === 'success') return 'border-green-500'
        return 'border-blue-500'
    }

    return (
        <Container>
            <AdaptiveCard>

                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-5">
                    <div>
                        <h3 className="mb-1">Activity Center</h3>
                        <p className="text-gray-500">Real finance notifications</p>
                    </div>

                    <Button icon={<TbCheck />} variant="solid" onClick={markAllRead}>
                        Mark All Read
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                    <Input
                        prefix={<TbSearch />}
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Select
                        options={filterOptions}
                        value={filterOptions.find(x => x.value === filter)}
                        onChange={(val: any) => setFilter(val?.value)}
                    />
                </div>

                <div className="space-y-3">
                    {filteredData.map(item => (
                        <div
                            key={item.id}
                            className={`border-l-4 ${getColor(item.type)} rounded-xl border bg-gray-50 dark:bg-gray-800 px-4 py-4 flex justify-between`}
                        >
                            <div>
                                <div className="font-medium mb-1">{item.title}</div>
                                <div className="text-xs text-gray-500">{item.time}</div>
                            </div>

                            {!item.readed && (
                                <span className="w-3 h-3 rounded-full bg-primary mt-2"></span>
                            )}
                        </div>
                    ))}

                    {filteredData.length === 0 && (
                        <div className="text-center py-14 text-gray-500">
                            <TbBell className="mx-auto text-5xl mb-3" />
                            No Notifications
                        </div>
                    )}
                </div>

            </AdaptiveCard>
        </Container>
    )
}

export default Notifications