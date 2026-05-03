const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const SibApiV3Sdk = require('sib-api-v3-sdk')

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'All fields are required',
        })
    }

    try {
        const existingUser = await User.findOne({
            email,
        })

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
            })
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10,
            )

        const user = new User({
            name,
            email,
            password:
                hashedPassword,
        })

        await user.save()

        res.status(201).json({
            message:
                'User registered successfully',
        })
    } catch (error) {
        res.status(500).json({
            error:
                error.message,
        })
    }
}

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
    const { email, password } =
        req.body

    if (!email || !password) {
        return res.status(400).json({
            message:
                'Email and password required',
        })
    }

    try {
        const user =
            await User.findOne({
                email,
            })

        if (!user) {
            return res.status(400).json({
                message:
                    'Invalid credentials',
            })
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password,
            )

        if (!isMatch) {
            return res.status(400).json({
                message:
                    'Invalid credentials',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            },
        )

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email:
                    user.email,
                avatar:
                    user.avatar ||
                    '',
                phone:
                    user.phone ||
                    '',
                country:
                    user.country ||
                    '',
            },
        })
    } catch (error) {
        res.status(500).json({
            error:
                error.message,
        })
    }
}

/* ================= GET PROFILE ================= */
exports.getProfile =
    async (req, res) => {
        try {
            const user =
                await User.findById(
                    req.user.id,
                ).select(
                    '-password',
                )

            res.json(user)
        } catch (error) {
            res.status(500).json({
                message:
                    'Error loading profile',
            })
        }
    }

/* ================= CHANGE PASSWORD ================= */
exports.changePassword =
    async (req, res) => {
        try {
            const {
                currentPassword,
                newPassword,
            } = req.body

            if (
                !currentPassword ||
                !newPassword
            ) {
                return res.status(
                    400,
                ).json({
                    message:
                        'All fields are required',
                })
            }

            const user =
                await User.findById(
                    req.user.id,
                )

            if (!user) {
                return res.status(
                    404,
                ).json({
                    message:
                        'User not found',
                })
            }

            const isMatch =
                await bcrypt.compare(
                    currentPassword,
                    user.password,
                )

            if (!isMatch) {
                return res.status(
                    400,
                ).json({
                    message:
                        'Current password incorrect',
                })
            }

            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    10,
                )

            user.password =
                hashedPassword

            await user.save()

            res.json({
                message:
                    'Password updated successfully',
            })
        } catch (error) {
            res.status(500).json({
                message:
                    'Password change failed',
            })
        }
    }

/* ================= UPDATE PROFILE ================= */
exports.updateProfile =
    async (req, res) => {
        try {
            const {
                name,
                email,
                phone,
                avatar,
                country,
                address,
                city,
                postcode,
            } = req.body

            const user =
                await User.findByIdAndUpdate(
                    req.user.id,
                    {
                        name,
                        email,
                        phone,
                        avatar,
                        country,
                        address,
                        city,
                        postcode,
                    },
                    {
                        new: true,
                        runValidators: true,
                    },
                ).select(
                    '-password',
                )

            res.json(user)
        } catch (error) {
            console.log(
                'PROFILE UPDATE ERROR:',
                error,
            )

            res.status(500).json({
                message:
                    'Error updating profile',
            })
        }
    }

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword =
    async (req, res) => {
        try {
            const { email } =
                req.body

            const user =
                await User.findOne({
                    email,
                })

            if (!user) {
                return res.status(
                    404,
                ).json({
                    message:
                        'User not found',
                })
            }

            const resetToken =
                crypto
                    .randomBytes(
                        32,
                    )
                    .toString(
                        'hex',
                    )

            user.resetPasswordToken =
                resetToken

            user.resetPasswordExpire =
                Date.now() +
                15 *
                    60 *
                    1000

            await user.save()

            const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

            const client =
                SibApiV3Sdk
                    .ApiClient
                    .instance

            client
                .authentications[
                    'api-key'
                ].apiKey =
                process.env.BREVO_API_KEY

            const api =
                new SibApiV3Sdk.TransactionalEmailsApi()

            await api.sendTransacEmail(
                {
                   sender: {
   name: 'Expense Tracker',
   email: process.env.SENDER_EMAIL
},

                    to: [
                        {
                            email,
                        },
                    ],

              subject:
    'Reset Your Password',

htmlContent: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#f8f9fa;border-radius:12px;border:1px solid #e5e7eb;">

    <h2 style="color:#111827;margin-bottom:10px;">
        Expense Tracker
    </h2>

    <p style="font-size:16px;color:#374151;">
        Hello,
    </p>

    <p style="font-size:16px;color:#374151;line-height:1.6;">
        We received a request to reset your password.
        Click the button below to create a new password.
    </p>

    <div style="margin:30px 0;text-align:center;">
        <a 
            href="${resetUrl}"
            style="
                background:#f97316;
                color:#ffffff;
                padding:14px 28px;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
                display:inline-block;
            "
        >
            Reset Password
        </a>
    </div>

    <p style="font-size:14px;color:#6b7280;">
        This link will expire in 15 minutes.
    </p>

    <p style="font-size:14px;color:#6b7280;">
        If you did not request this, you can safely ignore this email.
    </p>

    <hr style="margin:25px 0;border:none;border-top:1px solid #e5e7eb;" />

    <p style="font-size:13px;color:#9ca3af;text-align:center;">
        © 2026 Expense Tracker
    </p>

</div>
`,
                },
            )

            res.json({
                message:
                    'Reset link sent to email',
            })
        } catch (error) {
            console.log(
                'FORGOT PASSWORD ERROR:',
                error,
            )

            res.status(500).json({
                message:
                    'Forgot password failed',
            })
        }
    }

/* ================= RESET PASSWORD ================= */
exports.resetPassword =
    async (req, res) => {
        try {
            const { token } =
                req.params

            const {
                password,
            } = req.body

            const user =
                await User.findOne(
                    {
                        resetPasswordToken:
                            token,

                        resetPasswordExpire:
                            {
                                $gt:
                                    Date.now(),
                            },
                    },
                )

            if (!user) {
                return res.status(
                    400,
                ).json({
                    message:
                        'Invalid or expired link',
                })
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10,
                )

            user.password =
                hashedPassword

            user.resetPasswordToken =
                ''

            user.resetPasswordExpire =
                null

            await user.save()

            res.json({
                message:
                    'Password reset successful',
            })
        } catch (error) {
            res.status(500).json({
                message:
                    'Reset failed',
            })
        }
    }