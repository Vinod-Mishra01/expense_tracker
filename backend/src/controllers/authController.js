const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// ================= REGISTER =================
exports.register = async (req, res) => {

    const { name, email, password } = req.body

    // ✅ validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save()

        res.status(201).json({
            message: 'User registered successfully'
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ================= LOGIN =================
exports.login = async (req, res) => {

    const { email, password } = req.body

    // ✅ validation
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" })
    }

    try {

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        // ✅ better response
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}