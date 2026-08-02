const Contact = require('../models/Contact')
const fs = require('fs')
const vCardParser = require('vcard-parser')

// ================= CREATE CONTACT =================
exports.createContact = async (req, res) => {
    try {

        const phoneNumbers = JSON.parse(
            req.body.phoneNumbers || '[]',
        )

        const emails = JSON.parse(
            req.body.emails || '[]',
        )

        // Duplicate Check
        const duplicate = await Contact.findOne({
            userId: req.user.id,
            $or: [
                {
                    'phoneNumbers.number': {
                        $in: phoneNumbers.map(
                            (p) => p.number,
                        ),
                    },
                },
                {
                    'emails.email': {
                        $in: emails.map(
                            (e) => e.email,
                        ),
                    },
                },
            ],
        })

        if (duplicate) {
            return res.status(409).json({
                success: false,
                duplicate: true,
                message:
                    'Contact already exists',
                data: duplicate,
            })
        }

        const contact = await Contact.create({
            userId: req.user.id,

            firstName: req.body.firstName,

            lastName: req.body.lastName,

            phoneNumbers,

            emails,

            birthday:
                req.body.birthday || null,

            address:
                req.body.address || '',

            notes:
                req.body.notes || '',

            photo: req.file
                ? req.file.filename
                : '',

            favorite:
                req.body.favorite || false,
        })

        return res.status(201).json({
            success: true,
            message:
                'Contact created successfully',
            data: contact,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}

// ================= GET ALL CONTACTS =================
exports.getContacts = async (req, res) => {
    try {

        const contacts = await Contact.find({
            userId: req.user.id,
        }).sort({
            favorite: -1,
            firstName: 1,
        })

        return res.status(200).json({
            success: true,
            data: contacts,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}

// ================= GET SINGLE CONTACT =================
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

        return res.status(200).json({
            success: true,
            data: contact,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}

// ================= UPDATE CONTACT =================
exports.updateContact = async (req, res) => {
    try {

        const phoneNumbers = JSON.parse(
            req.body.phoneNumbers || '[]',
        )

        const emails = JSON.parse(
            req.body.emails || '[]',
        )

        // Duplicate Check
        const duplicate = await Contact.findOne({
            _id: { $ne: req.params.id },
            userId: req.user.id,
            $or: [
                {
                    'phoneNumbers.number': {
                        $in: phoneNumbers.map(
                            (p) => p.number,
                        ),
                    },
                },
                {
                    'emails.email': {
                        $in: emails.map(
                            (e) => e.email,
                        ),
                    },
                },
            ],
        })

        if (duplicate) {
            return res.status(409).json({
                success: false,
                duplicate: true,
                message:
                    'Contact already exists',
                data: duplicate,
            })
        }

        const updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumbers,
            emails,
            birthday: req.body.birthday,
            address: req.body.address,
            notes: req.body.notes,
            favorite: req.body.favorite,
        }

        if (req.file) {
            updateData.photo = req.file.filename
        }

        const contact =
            await Contact.findOneAndUpdate(
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

        return res.status(200).json({
            success: true,
            message:
                'Contact updated successfully',
            data: contact,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}

// ================= DELETE CONTACT =================
exports.deleteContact = async (req, res) => {
    try {

        const contact =
            await Contact.findOneAndDelete({
                _id: req.params.id,
                userId: req.user.id,
            })

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            })
        }

        return res.status(200).json({
            success: true,
            message:
                'Contact deleted successfully',
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}

// ================= TOGGLE FAVORITE =================
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

        return res.status(200).json({
            success: true,
            message:
                'Favorite updated successfully',
            data: contact,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
}

// ================= BULK FAVORITE =================
exports.favoriteMultipleContacts = async (req, res) => {
    try {

        const { ids } = req.body

        if (!ids || !ids.length) {
            return res.status(400).json({
                success: false,
                message: 'No contacts selected',
            })
        }

        await Contact.updateMany(
            {
                _id: { $in: ids },
                userId: req.user.id,
            },
            {
                $set: {
                    favorite: true,
                },
            },
        )

        return res.status(200).json({
            success: true,
            message:
                'Contacts updated successfully',
        })

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message,
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

        return res.status(200).json({
            success: true,
            message:
                'Contacts deleted successfully',
        })

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message,
        })

    }
}

// ================= IMPORT VCF =================
exports.importVCF = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a VCF file',
            })
        }

        const fileContent = fs.readFileSync(
            req.file.path,
            'utf8',
        )

        const parsed = vCardParser.parse(fileContent)

        const total = parsed.fn?.length || 0

        let imported = 0
        let skipped = 0

        for (let i = 0; i < total; i++) {

            const fullName = String(
                parsed.fn?.[i]?.value || '',
            ).trim()

            const nameParts = fullName.split(' ')

            const firstName =
                nameParts[0] || 'Unknown'

            const lastName =
                nameParts.slice(1).join(' ')

            const phone = String(
                parsed.tel?.[i]?.value || '',
            ).trim()

            const email = String(
                parsed.email?.[i]?.value || '',
            ).trim()

            const addressValue =
                parsed.adr?.[i]?.value

            const address = Array.isArray(
                addressValue,
            )
                ? addressValue
                      .filter(Boolean)
                      .join(', ')
                : String(
                      addressValue || '',
                  ).trim()

            const notes = String(
                parsed.note?.[i]?.value || '',
            ).trim()

            // Skip empty contact
            if (
                !fullName &&
                !phone &&
                !email
            ) {
                skipped++
                continue
            }

            let exists = null

            if (phone) {
                exists = await Contact.findOne({
                    userId: req.user.id,
                    'phoneNumbers.number': phone,
                })
            }

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

        console.error(
            'IMPORT ERROR:',
            err,
        )

        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}