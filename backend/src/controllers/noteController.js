const Note = require('../models/Note')

/* ==========================
   Create Note
========================== */

const createNote = async (req, res) => {
    try {
        const {
            title,
            description,
            color,
            isPinned,
            tags,
        } = req.body

        const note = await Note.create({
            userId: req.user.id,
            title,
            description,
            color,
            isPinned,
            tags,
        })

        res.status(201).json(note)
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Failed to create note',
        })
    }
}

/* ==========================
   Get All Notes
========================== */

const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            userId: req.user.id,
        }).sort({
            isPinned: -1,
            createdAt: -1,
        })

        res.json(notes)
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Failed to fetch notes',
        })
    }
}

/* ==========================
   Update Note
========================== */

const updateNote = async (req, res) => {
    try {
        const {
            title,
            description,
            color,
            isPinned,
            tags,
        } = req.body

        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id,
            },
            {
                title,
                description,
                color,
                isPinned,
                tags,
            },
            {
                new: true,
            },
        )

        if (!note) {
            return res.status(404).json({
                message: 'Note not found',
            })
        }

        res.json(note)
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Failed to update note',
        })
    }
}

/* ==========================
   Delete Note
========================== */

const deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        })

        if (!note) {
            return res.status(404).json({
                message: 'Note not found',
            })
        }

        res.json({
            message: 'Note deleted successfully',
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Failed to delete note',
        })
    }
}

module.exports = {
    createNote,
    getNotes,
    updateNote,
    deleteNote,
}