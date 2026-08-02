const Contact = require('../models/Contact')
const fs = require('fs')
const vCardParser = require('vcard-parser')

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


// ================= BULK DELETE =================
exports.deleteMultipleContacts = async (req, res) => {
    try {
        const { ids } = req.body

        if (!ids || !ids.length) {
            return res.status(400).json({
                success: false,
                message: 'No contacts selected',
            })
        }

        await Contact.deleteMany({
            _id: { $in: ids },
            userId: req.user.id,
        })

        res.status(200).json({
            success: true,
            message: 'Contacts deleted successfully',
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.importVCF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a VCF file',
            })
        }

        const fileContent = fs.readFileSync(req.file.path, 'utf8')

        const parsed = vCardParser.parse(fileContent)

        const total = parsed.fn?.length || 0

        console.log('TOTAL CONTACTS =>', total)

        let imported = 0
        let skipped = 0

        for (let i = 0; i < total; i++) {

            const fullName = String(parsed.fn?.[i]?.value || '').trim()

            const nameParts = fullName.split(' ')

            const firstName = nameParts[0] || 'Unknown'

            const lastName = nameParts.slice(1).join(' ')

            const phone = String(parsed.tel?.[i]?.value || '').trim()

            const email = String(parsed.email?.[i]?.value || '').trim()

            const addressValue = parsed.adr?.[i]?.value

            const address = Array.isArray(addressValue)
                ? addressValue.filter(Boolean).join(', ')
                : String(addressValue || '').trim()

            const notes = String(parsed.note?.[i]?.value || '').trim()

            // Skip completely empty contacts
            if (!fullName && !phone && !email) {
                skipped++
                continue
            }

            // Duplicate check by phone first
            let exists = null

            if (phone) {
                exists = await Contact.findOne({
                    userId: req.user.id,
                    'phoneNumbers.number': phone,
                })
            }

            // Duplicate check by email
            if (!exists && email) {
                exists = await Contact.findOne({
                    userId: req.user.id,
                    'emails.email': email,
                })
            }

            if (exists) {
                skipped++
                continue
            }

            await Contact.create({
                userId: req.user.id,

                firstName,

                lastName,

                phoneNumbers: phone
                    ? [
                          {
                              label: 'Mobile',
                              number: phone,
                              isPrimary: true,
                          },
                      ]
                    : [],

                emails: email
                    ? [
                          {
                              label: 'Personal',
                              email,
                              isPrimary: true,
                          },
                      ]
                    : [],

                birthday: null,

                address,

                notes,

                favorite: false,

                photo: '',
            })

            imported++
        }

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }

        return res.status(200).json({
            success: true,
            message: 'VCF imported successfully',
            total,
            imported,
            skipped,
        })

    } catch (err) {

        console.error('IMPORT ERROR:', err)

        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}