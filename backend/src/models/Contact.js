const mongoose = require('mongoose')

const phoneSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            enum: ['Mobile', 'Home', 'Work', 'WhatsApp', 'Other'],
            default: 'Mobile',
        },
        number: {
            type: String,
            required: true,
            trim: true,
        },
        isPrimary: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false },
)

const emailSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            enum: ['Personal', 'Work', 'Other'],
            default: 'Personal',
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        isPrimary: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false },
)

const contactSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            default: '',
            trim: true,
        },

        phoneNumbers: {
            type: [phoneSchema],
            default: [],
        },

        emails: {
            type: [emailSchema],
            default: [],
        },

        birthday: {
            type: Date,
            default: null,
        },

        address: {
            type: String,
            default: '',
            trim: true,
        },

        notes: {
            type: String,
            default: '',
            trim: true,
        },

        photo: {
            type: String,
            default: '',
        },

        favorite: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Contact', contactSchema)