import html2canvas from "html2canvas"
import { useEffect, useState } from 'react'


import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Dialog from '@/components/ui/Dialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { TbDownload } from 'react-icons/tb'
import { useRef } from 'react'
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useToken } from '@/store/authStore'
import axios from 'axios'
import {
    PiNoteDuotone,
    PiPencilSimpleDuotone,
    PiTrashDuotone,
    PiPushPinSimpleDuotone,
    PiMagnifyingGlassDuotone,
    PiImageSquareDuotone,
        PiEyeDuotone,
} from 'react-icons/pi'

import { FormItem } from '@/components/ui'


type NoteType = {
    _id: string
    title: string
    description: string
    color: string
    isPinned: boolean
    // tags: string[]
    createdAt: string
}
const colors = [
    '#ffffff',
    '#fef3c7',
    '#dbeafe',
    '#dcfce7',
    '#fce7f3',
    '#ede9fe',
]
const ViewNotes = () => {
    const { token } = useToken()

    const [loading, setLoading] = useState(true)

    const [notes, setNotes] = useState<NoteType[]>([])

    const [filteredNotes, setFilteredNotes] = useState<NoteType[]>([])

    const [search, setSearch] = useState('')

    const [deleteId, setDeleteId] = useState('')

    const exportRef = useRef<HTMLDivElement>(null)

const [previewNote, setPreviewNote] = useState<NoteType | null>(null)
const [viewNote, setViewNote] = useState<NoteType | null>(null)
const [currentPage, setCurrentPage] = useState(1)
const [pageSize, setPageSize] = useState(11)


const [quickFilter, setQuickFilter] = useState('all')
const [selectedDate, setSelectedDate] = useState('')

    const [deleteDialog, setDeleteDialog] = useState(false)

    const [editDialog, setEditDialog] = useState(false)

    const [editData, setEditData] = useState({
        _id: '',
        title: '',
        description: '',
        color: '#FFFFFF',
        isPinned: false,
        // tags: '',
    })
    
const quickFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last7' },
    { label: 'This Week', value: 'week' },
    { label: 'Last Week', value: 'lastWeek' },
    { label: 'This Month', value: 'month' },
    { label: 'Last Month', value: 'lastMonth' },
]
    const fetchNotes = async () => {
        try {
            setLoading(true)

            const res: any = await axios.get(
                // 'https://expense-backend-5myt.onrender.com/api/note/list',
                'http://localhost:5000/api/note/list',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            setNotes(res.data)
            setFilteredNotes(res.data)
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Failed to load notes
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        } finally {
            setLoading(false)
        }
    }




const downloadImage = async (note: NoteType) => {
    setPreviewNote(note)

    requestAnimationFrame(async () => {
        if (!exportRef.current) return

        const canvas = await html2canvas(exportRef.current, {
            scale: 3,
            useCORS: true,
            backgroundColor: null,
        })

        const link = document.createElement('a')

        link.download = `${note.title}.png`
        link.href = canvas.toDataURL('image/png')

        link.click()

        setPreviewNote(null)
    })
}


    useEffect(() => {
        if (token) {
            fetchNotes()
        }
    }, [token])




useEffect(() => {
    let data = [...notes]

    // Search Filter
    if (search) {
        const keyword = search.toLowerCase()

        data = data.filter(
            (note) =>
                note.title.toLowerCase().includes(keyword) ||
                note.description.toLowerCase().includes(keyword)
                // note.tags.join(', ').toLowerCase().includes(keyword),
        )
    }

    // Date Filter
// Custom Date (Highest Priority)
if (selectedDate) {
    data = data.filter((note) => {
        const noteDate = new Date(note.createdAt)
            .toISOString()
            .split('T')[0]

        return noteDate === selectedDate
    })
} else if (quickFilter !== 'all') {
    const today = new Date()

    data = data.filter((note) => {
        const noteDate = new Date(note.createdAt)

        switch (quickFilter) {
            case 'today':
                return noteDate.toDateString() === today.toDateString()

            case 'yesterday': {
                const yesterday = new Date(today)
                yesterday.setDate(today.getDate() - 1)
                return noteDate.toDateString() === yesterday.toDateString()
            }

            case 'last7': {
                const last7 = new Date(today)
                last7.setDate(today.getDate() - 7)
                return noteDate >= last7
            }

            case 'week': {
                const start = new Date(today)
                start.setDate(today.getDate() - today.getDay())
                start.setHours(0, 0, 0, 0)
                return noteDate >= start
            }

            case 'lastWeek': {
                const start = new Date(today)
                start.setDate(today.getDate() - today.getDay() - 7)
                start.setHours(0, 0, 0, 0)

                const end = new Date(today)
                end.setDate(today.getDate() - today.getDay() - 1)
                end.setHours(23, 59, 59, 999)

                return noteDate >= start && noteDate <= end
            }

            case 'month':
                return (
                    noteDate.getMonth() === today.getMonth() &&
                    noteDate.getFullYear() === today.getFullYear()
                )

            case 'lastMonth': {
                const month =
                    today.getMonth() === 0 ? 11 : today.getMonth() - 1
                const year =
                    today.getMonth() === 0
                        ? today.getFullYear() - 1
                        : today.getFullYear()

                return (
                    noteDate.getMonth() === month &&
                    noteDate.getFullYear() === year
                )
            }

            default:
                return true
        }
    })
}
    setFilteredNotes(data)
}, [search, quickFilter, selectedDate, notes])









    // useEffect(() => {
    //     if (!search) {
    //         setFilteredNotes(notes)
    //         return
    //     }

    //     const keyword = search.toLowerCase()

    //     setFilteredNotes(
    //         notes.filter(
    //             (note) =>
    //                 note.title.toLowerCase().includes(keyword) ||
    //                 note.description.toLowerCase().includes(keyword),
    //         ),
    //     )
    // }, [search, notes])

    const openDelete = (id: string) => {
        setDeleteId(id)
        setDeleteDialog(true)
    }

    const openEdit = (note: NoteType) => {
        setEditData({
            _id: note._id,
            title: note.title,
            description: note.description,
            color: note.color,
            isPinned: note.isPinned,
            // tags: note.tags.join(', '),
        })

        setEditDialog(true)
    }

        const deleteNote = async () => {
        try {
            await axios.delete(
                // `https://expense-backend-5myt.onrender.com/api/note/delete/${deleteId}`,
                `http://localhost:5000/api/note/delete/${deleteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            toast.push(
                <Notification type="success">
                    Note deleted successfully
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            setDeleteDialog(false)
            fetchNotes()
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Failed to delete note
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    const updateNote = async () => {
        try {
            await axios.put(
                // `https://expense-backend-5myt.onrender.com/api/note/update/${editData._id}`,
                   `http://localhost:5000/api/note/update/${editData._id}`,
                {
                    title: editData.title,
                    description: editData.description,
                    color: editData.color,
                    isPinned: editData.isPinned,
                    // tags: editData.tags
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
                    Note updated successfully
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            setEditDialog(false)
            fetchNotes()
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Failed to update note
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }
const totalNotes = filteredNotes.length

const totalPages = Math.ceil(totalNotes / pageSize)

const startIndex = (currentPage - 1) * pageSize

const endIndex = startIndex + pageSize

const currentNotes = filteredNotes.slice(startIndex, endIndex)


const navigate = useNavigate();
return (
    <Container>
        {/* Header */}
        <div className="mb-15 bg-white p-5 border-red-100  rounded-lg">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

             <div>
    <div className="flex items-center gap-4">
        <h3 className="text-2xl font-bold">
            My Notes
        </h3>

        <button
            onClick={() => navigate('/add-note')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-200"
        >
            <FiPlus size={22} />
        </button>
    </div>

    <p className="text-gray-500 mt-2">
        Manage all your notes
    </p>
</div>

                <div className="flex flex-wrap items-center gap-3">

                    {/* Search */}
                    <div className="w-[260px]">
                        <Input
                            prefix={<PiMagnifyingGlassDuotone />}
                            value={search}
                            placeholder="Search notes..."
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    {/* Date */}
                    <div className="w-[170px]">
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value)
                                setQuickFilter('all')
                            }}
                        />
                    </div>

                    {/* Quick Filter */}
                    <div className="w-[180px]">
                        <Select
                            options={quickFilterOptions}
                            value={quickFilterOptions.find(
                                (item) =>
                                    item.value === quickFilter,
                            )}
                            onChange={(option: any) => {
                                setQuickFilter(
                                    option?.value || 'all',
                                )
                                setSelectedDate('')
                            }}
                        />
                    </div>

                    {/* Clear */}
                    <Button 
                    className='bg-red-600 text-white'
                        onClick={() => {
                            setSearch('')
                            setSelectedDate('')
                            setQuickFilter('all')
                        }}
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </div>

        {loading ? (
            <div className="flex justify-center items-center py-20">
                <span className="text-gray-500">
                    Loading Notes...
                </span>
            </div>
        ) : (
            <>
                {filteredNotes.length > 0 ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {currentNotes.map((note) => (

                        <Card
                            key={note._id}
                            bodyClass="p-5"
                            style={{
                                background: note.color,
                            }}
                        >
                            <div className="flex justify-between items-start">

                                <div className="flex items-center gap-2">
                                    <PiNoteDuotone size={20} />

                                    <h5 className="font-semibold">
                                        {note.title}
                                    </h5>
                                </div>

                                {note.isPinned && (
                                    <PiPushPinSimpleDuotone size={18} />
                                )}
                            </div>

                            <p
                                className="mt-4 text-sm text-gray-700"
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 5,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'pre-wrap',
                                    minHeight: '64px',
                                }}
                            >
                                {note.description}
                            </p>

                            <div className="flex justify-between items-center mt-6">

                                <small>
                                    {new Date(
                                        note.createdAt,
                                    ).toLocaleDateString()}
                                </small>

                                <div className="flex gap-2">

                                    <Button
                                        size="xs"
                                        icon={<PiPencilSimpleDuotone />}
                                        onClick={() => openEdit(note)}
                                    />

                                    <Button
                                        size="xs"
                                        variant="solid"
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                        icon={<PiTrashDuotone />}
                                        onClick={() => openDelete(note._id)}
                                    />

                                    <Button
                                        size="xs"
                                        icon={<PiEyeDuotone size={18} />}
                                        onClick={() => setViewNote(note)}
                                    />

                                    <Button
                                        size="xs"
                                        variant="solid"
                                        icon={<PiImageSquareDuotone size={18} />}
                                        onClick={() => downloadImage(note)}
                                    />

                                </div>
                            </div>
                        </Card>

                    ))}

                    </div>


                      {filteredNotes.length > pageSize && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">

                        <div className="text-sm text-gray-500">
                            Showing {startIndex + 1} - {Math.min(endIndex, totalNotes)} of {totalNotes} Notes
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">

                            <select
                                value={pageSize}
                           onChange={(e) => {
    setCurrentPage(1)
    setPageSize(Number(e.target.value))
}}
                                className="border rounded px-2 py-1"
                            >
                                <option value={11}>11</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>

                            <Button
                                size="xs"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                Prev
                            </Button>

                            {Array.from({ length: totalPages }, (_, index) => (
                                <Button
                                    key={index}
                                    size="xs"
                                    variant={currentPage === index + 1 ? 'solid' : 'default'}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Button>
                            ))}

                            <Button
                                size="xs"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                Next
                            </Button>

                        </div>

                    </div>
                )}

                   </>
                    
                ) : (
                    <Card bodyClass="py-16">
                        <div className="flex flex-col items-center justify-center text-center">

                            <PiNoteDuotone
                                size={70}
                                className="text-gray-300 mb-5"
                            />

                            <h4 className="font-semibold text-xl">
                                No Notes Found
                            </h4>

                            <p className="text-gray-500 mt-2 max-w-md">
                                No notes match your current search
                                or filter. Try changing the search,
                                selecting another filter or clear
                                all filters.
                            </p>

                            <Button
                                className="mt-6"
                                onClick={() => {
                                    setSearch('')
                                    setSelectedDate('')
                                    setQuickFilter('all')
                                }}
                            >
                                Clear Filters
                            </Button>

                        </div>
                    </Card>
                )}










{/* 
<Dialog
    isOpen={!!previewNote}
    onClose={() => setPreviewNote(null)}
>
    <div className="p-6">

        <div
            ref={exportRef}
            className="rounded-3xl p-8 shadow-xl"
            style={{
                background: previewNote?.color || "#ffffff",
                width: 700,
            }}
        >

            <div className="flex justify-between">

                <h2 className="text-3xl font-bold">
                    {previewNote?.title}
                </h2>

                {previewNote?.isPinned && (
                    <PiPushPinSimpleDuotone size={24} />
                )}

            </div>

            <p className="text-gray-500 mt-2">
                {previewNote &&
                    new Date(previewNote.createdAt).toLocaleDateString()}
            </p>

            <div className="border-b my-6"></div>

            <div className="whitespace-pre-wrap leading-8 text-lg">
                {previewNote?.description}
            </div>

            <div className="border-t mt-8 pt-5 flex justify-between text-sm text-gray-500">

                <span>Personal Expense Tracker</span>

                <PiNoteDuotone size={22} />

            </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">

            <Button onClick={() => setPreviewNote(null)}>
                Cancel
            </Button>

            <Button
                variant="solid"
                onClick={downloadImage}
            >
                Download PNG
            </Button>

        </div>

    </div>
</Dialog> */}



            </>
        )}

        {/* Edit Dialog */}
        <Dialog
            isOpen={editDialog}
            onClose={() => setEditDialog(false)}
            onRequestClose={() => setEditDialog(false)}
        >
            <h4 className="mb-5">Edit Note</h4>

            <div className="space-y-4">

                <FormItem label="Title">
                    <Input
                        value={editData.title}
                        onChange={(e) =>
                            setEditData((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                    />
                </FormItem>

                <FormItem label="Description">
                    <Input
                        textArea
                        rows={5}
                        value={editData.description}
                        onChange={(e) =>
                            setEditData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />





                </FormItem>



 <FormItem label="Note Color">
    <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
            <button
                key={color}
                type="button"
                onClick={() =>
                    setEditData((prev) => ({
                        ...prev,
                        color,
                    }))
                }
                className={`w-8 h-8 rounded-full border-2 ${
                    editData.color === color
                        ? 'border-black'
                        : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
            />
        ))}
    </div>
</FormItem>


{/* 
                <FormItem label="Tags">
                    <Input
                        value={editData.tags}
                        placeholder="Work, Personal"
                        onChange={(e) =>
                            setEditData((prev) => ({
                                ...prev,
                                tags: e.target.value,
                            }))
                        }
                    />
                </FormItem> */}


                

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        onClick={() => setEditDialog(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="solid"
                        onClick={updateNote}
                    >
                        Update Note
                    </Button>
                </div>

            </div>
        </Dialog>


<Dialog
    isOpen={!!viewNote}
    onClose={() => setViewNote(null)}
    onRequestClose={() => setViewNote(null)}
>
    <div className="1">

        <div
            className="rounded-2xl border overflow-hidden"
            style={{
                background: viewNote?.color || '#fff',
            }}
        >
            {/* Header */}
            <div className="p-6">

                <div className="flex justify-between items-start">

                    <h3 className="text-2xl font-bold break-words">
                        {viewNote?.title}
                    </h3>

                    {viewNote?.isPinned && (
                        <PiPushPinSimpleDuotone size={22} />
                    )}

                </div>

                <p className="text-gray-500 mt-2">
                    {viewNote &&
                        new Date(viewNote.createdAt).toLocaleDateString()}
                </p>

            </div>

            <div className="border-t" />

            {/* Scroll Area */}
            <div
                className="overflow-y-auto px-6 py-5 whitespace-pre-wrap leading-8"
                style={{
                    maxHeight: 430,
                }}
            >
                {viewNote?.description}
            </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">

            <Button
                variant="default"
                onClick={() => setViewNote(null)}
            >
                Close
            </Button>

            <Button
                variant="solid"
                icon={<TbDownload size={18} />}
                onClick={() => {
                    if (viewNote) {
                        downloadImage(viewNote)
                    }
                }}
            >
                Download 
            </Button>

        </div>

    </div>
</Dialog>









        {/* Delete Dialog */}
        <Dialog
            isOpen={deleteDialog}
            onClose={() => setDeleteDialog(false)}
            onRequestClose={() => setDeleteDialog(false)}
        >
            <div className="py-3">

                <h4 className="mb-3">
                    Delete Note
                </h4>

                <p className="text-gray-500">
                    Are you sure you want to delete this note?
                </p>

                <div className="flex justify-end gap-3 mt-8">

                    <Button
                        onClick={() =>
                            setDeleteDialog(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="solid"
                        color="red"
                        onClick={deleteNote}
                    >
                        Delete
                    </Button>

                </div>

            </div>
        </Dialog>


       <div
    style={{
        position: 'fixed',
        left: '-99999px',
        top: 0,
        zIndex: -1,
    }}
>
    <div
        ref={exportRef}
        style={{
            width: 1080,
            minHeight: 1350,
            background:
                "linear-gradient(135deg,#0f172a 0%,#1e293b 45%,#334155 100%)",
            padding: 70,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Inter, sans-serif",
        }}
    >
        <div
            style={{
                width: "100%",
                minHeight: 1180,
                background: "rgba(255,255,255,.96)",
                borderRadius: 50,
                overflow: "hidden",
                boxShadow: "0 40px 100px rgba(0,0,0,.30)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Top Accent */}
            <div
                style={{
                    height: 16,
                    background: previewNote?.color || "#22c55e",
                }}
            />

            {/* Header */}
            <div
                style={{
                    padding: "70px 70px 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: 72,
                            fontWeight: 800,
                            color: "#111827",
                            margin: 0,
                            lineHeight: 1.15,
                            wordBreak: "break-word",
                        }}
                    >
                        {previewNote?.title}
                    </h1>

                    <div
                        style={{
                            marginTop: 18,
                            fontSize: 26,
                            color: "#64748b",
                        }}
                    >
                        📅{" "}
                        {previewNote &&
                            new Date(
                                previewNote.createdAt,
                            ).toLocaleDateString()}
                    </div>
                </div>

                {previewNote?.isPinned && (
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: 22,
                            background: "#f8fafc",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow:
                                "0 10px 25px rgba(0,0,0,.08)",
                        }}
                    >
                        <PiPushPinSimpleDuotone size={34} />
                    </div>
                )}
            </div>

            <div
                style={{
                    height: 2,
                    background: "#e5e7eb",
                    margin: "0 70px",
                }}
            />

            {/* Description */}
            <div
                style={{
                    flex: 1,
                    padding: "60px 70px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <p
                    style={{
                        fontSize: 38,
                        color: "#374151",
                        lineHeight: 1.9,
                        whiteSpace: "pre-wrap",
                        margin: 0,
                        width: "100%",
                        wordBreak: "break-word",
                    }}
                >
                    {previewNote?.description}
                </p>
            </div>

            {/* Footer */}
            <div
                style={{
                    margin: "0 70px 70px",
                    paddingTop: 35,
                    borderTop: "2px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#111827",
                        }}
                    >
                        Personal Expense Tracker
                    </div>

                    <div
                        style={{
                            marginTop: 10,
                            fontSize: 22,
                            color: "#64748b",
                        }}
                    >
                        Organize • Remember • Achieve
                    </div>
                </div>

                <div
                    style={{
                        width: 78,
                        height: 78,
                        borderRadius: 24,
                        background: previewNote?.color || "#22c55e",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                    }}
                >
                    <PiNoteDuotone size={42} />
                </div>
            </div>
        </div>
    </div>
</div>




    </Container>
)


 
}

export default ViewNotes