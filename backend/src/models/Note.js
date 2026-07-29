const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: '',
            trim: true,
        },

        color: {
            type: String,
            default: '#ffffff',
        },

        isPinned: {
            type: Boolean,
            default: false,
        },

        tags: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model(
    'Note',
    noteSchema,
)