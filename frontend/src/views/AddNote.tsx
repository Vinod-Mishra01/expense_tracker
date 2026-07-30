import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import { Form, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useToken } from '@/store/authStore'
import axios from 'axios'

const noteColors = [
    '#FFFFFF',
    '#F28B82',
    '#FBBC04',
    '#FFF475',
    '#CCFF90',
    '#A7FFEB',
    '#CBF0F8',
    '#AECBFA',
    '#D7AEFB',
    '#FDCFE8',
]

const AddNote = () => {
    const { token } = useToken()

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        color: '#FFFFFF',
        isPinned: false,
   
    })

    const handleChange = (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!formData.title) {
            toast.push(
                <Notification type="danger">
                    Please enter note title
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            return
        }

        try {
            if (!token) {
                toast.push(
                    <Notification type="danger">
                        Please login again
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )

                return
            }

            setLoading(true)

            await axios.post(
                // 'https://expense-backend-5myt.onrender.com/api/note/create',
                'http://localhost:5000/api/note/create',
                {
                    title: formData.title,
                    description: formData.description,
                    color: formData.color,
                    isPinned: formData.isPinned,
                    // tags: formData.tags
                    //     .split(',')
                    //     .map((tag) => tag.trim())
                    //     .filter(Boolean),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            toast.push(
                <Notification type="success">
                    Note added successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            setFormData({
                title: '',
                description: '',
                color: '#FFFFFF',
                isPinned: false,
                // tags: '',
            })
                        setLoading(false)
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Failed to add note
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            setLoading(false)
        }
    }

    return (
        <Container>
            <div className="w-full mx-auto">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold">Add Note</h3>
                    <p className="text-gray-500">
                        Save your important notes
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                    <Form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">

                            <FormItem label="Title">
                                <Input
                                    value={formData.title}
                                    onChange={(e) =>
                                        handleChange(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter note title"
                                />
                            </FormItem>

                            <FormItem label="Description">
                                <Input
                                    textArea
                                    rows={6}
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleChange(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Write your note..."
                                />
                            </FormItem>

                            {/* <FormItem label="Tags">
                                <Input
                                    value={formData.tags}
                                    onChange={(e) =>
                                        handleChange(
                                            'tags',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Work, Personal, Meeting"
                                />
                            </FormItem> */}
{/* 
                            <FormItem label="Note Color">
                                <div className="flex flex-wrap gap-3">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() =>
                                                handleChange(
                                                    'color',
                                                    color,
                                                )
                                            }
                                            className={`w-10 h-10 rounded-full border-2 transition ${
                                                formData.color === color
                                                    ? 'border-black dark:border-white scale-110'
                                                    : 'border-gray-300'
                                            }`}
                                            style={{
                                                backgroundColor: color,
                                            }}
                                        />
                                    ))}
                                </div>
                            </FormItem> */}






                            <FormItem label="Note Color">
    <div className="flex items-center gap-4">

        {/* Predefined Colors */}
        <div className="flex flex-wrap gap-2">
            {noteColors.map((color) => (
                <button
                    key={color}
                    type="button"
                    onClick={() => handleChange('color', color)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                        formData.color === color
                            ? 'border-blue-600 scale-110'
                            : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300" />

        {/* Custom Color Picker */}
        <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-500">
                Custom
            </span>

            <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                    handleChange('color', e.target.value)
                }
                className="w-9 h-9  cursor-pointer rounded-full border-1 p-0"
            />
        </label>

    </div>
</FormItem>

                      <FormItem>
    <Checkbox
        checked={formData.isPinned}
        onChange={(checked: boolean) =>
            handleChange('isPinned', checked)
        }
    >
        Pin this note
    </Checkbox>
</FormItem>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">

                            <Button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        title: '',
                                        description: '',
                                        color: '#FFFFFF',
                                        isPinned: false,
                                        // tags: '',
                                    })
                                }
                            >
                                Reset
                            </Button>

                            <Button
                                variant="solid"
                                type="submit"
                                loading={loading}
                            >
                                Save Note
                            </Button>

                        </div>
                    </Form>
                </div>
            </div>
        </Container>
    )
}

export default AddNote