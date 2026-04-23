import { useState } from 'react'
import axios from 'axios'
import { useToken } from '@/store/authStore'

type MsgType = {
    sender: 'user' | 'ai'
    text: string
}

const Chat = () => {
    const [messages, setMessages] = useState<MsgType[]>([
        {
            sender: 'ai',
            text: 'Hello 👋 I am your Finance AI. Ask me about expenses, savings, balance or anything.',
        },
    ])

    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const { token } = useToken()

    const sendMessage = async () => {
        if (!input.trim()) return

        const userText = input

        setMessages((prev) => [
            ...prev,
            {
                sender: 'user',
                text: userText,
            },
        ])

        setInput('')
        setLoading(true)

        try {
            const res = await axios.post(
                'https://expense-backend-5myt.onrender.com/api/ai/chat',
                {
                    message: userText,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            setMessages((prev) => [
                ...prev,
                {
                    sender: 'ai',
                    text:
                        res.data.reply ||
                        'No reply found.',
                },
            ])
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'ai',
                    text:
                        'Sorry, AI reply failed.',
                },
            ])
        }

        setLoading(false)
    }


    return (
        <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900 rounded-xl p-4">

            <h2 className="text-2xl font-bold mb-4 text-center">
                Finance AI Chat
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">

                {messages.map(
                    (msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[75%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap ${
                                msg.sender ===
                                'user'
                                    ? 'ml-auto bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
                            }`}
                        >
                            {msg.text}
                        </div>
                    ),
                )}

                {loading && (
                    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl w-fit text-sm">
                        Typing...
                    </div>
                )}
            </div>

            <div className="flex gap-2">

                <input
                    type="text"
                    placeholder="Ask anything..."
                    className="flex-1 border rounded-xl px-4 py-3 outline-none dark:bg-gray-800 dark:text-white"
                    value={input}
                    onChange={(e) =>
                        setInput(
                            e.target.value,
                        )
                    }
                    onKeyDown={(e) => {
                        if (
                            e.key ===
                            'Enter'
                        ) {
                            sendMessage()
                        }
                    }}
                />

                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-blue-600 text-white px-5 rounded-xl"
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chat