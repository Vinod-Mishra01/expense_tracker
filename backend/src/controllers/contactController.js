const Contact = require('../models/Contact')

// Create Contact
exports.createContact = async (req, res) => {
    try {
        const contact = await Contact.create({
            userId: req.user.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
         phoneNumbers: JSON.parse(req.body.phoneNumbers || '[]'),

emails: JSON.parse(req.body.emails || '[]'),
            birthday: req.body.birthday || null,
            address: req.body.address || '',
            notes: req.body.notes || '',
            photo: req.file ? req.file.filename : '',
            favorite: req.body.favorite || false,
        })

        res.status(201).json({
            success: true,
            message: 'Contact created successfully',
            data: contact,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get All Contacts
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({
            userId: req.user.id,
        }).sort({
            favorite: -1,
            firstName: 1,
        })

        res.status(200).json({
            success: true,
            data: contacts,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get Single Contact
exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            userId: req.user.id,
        })

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            })
        }

        res.status(200).json({
            success: true,
            data: contact,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Update Contact
exports.updateContact = async (req, res) => {
    try {
        const updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
         phoneNumbers: JSON.parse(req.body.phoneNumbers || '[]'),

emails: JSON.parse(req.body.emails || '[]'),
            birthday: req.body.birthday,
            address: req.body.address,
            notes: req.body.notes,
            favorite: req.body.favorite,
        }

        if (req.file) {
            updateData.photo = req.file.filename
        }

        const contact = await Contact.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id,
            },
            updateData,
            {
                new: true,
            },
        )

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Contact updated successfully',
            data: contact,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Delete Contact
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        })

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Toggle Favorite
exports.toggleFavorite = async (req, res) => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            userId: req.user.id,
        })

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            })
        }

        contact.favorite = !contact.favorite

        await contact.save()

        res.status(200).json({
            success: true,
            message: 'Favorite updated successfully',
            data: contact,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}