/* ADD BELOW IN authController.js */

const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/* ================= REGISTER ================= */
exports.register =
    async (
        req,
        res,
    ) => {
        const {
            name,
            email,
            password,
        } =
            req.body

        if (
            !name ||
            !email ||
            !password
        ) {
            return res.status(
                400,
            ).json({
                message:
                    'All fields are required',
            })
        }

        try {
            const existingUser =
                await User.findOne(
                    {
                        email,
                    },
                )

            if (
                existingUser
            ) {
                return res.status(
                    400,
                ).json({
                    message:
                        'User already exists',
                })
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10,
                )

            const user =
                new User(
                    {
                        name,
                        email,
                        password:
                            hashedPassword,
                    },
                )

            await user.save()

            res.status(
                201,
            ).json({
                message:
                    'User registered successfully',
            })
        } catch (
            error
        ) {
            res.status(
                500,
            ).json({
                error:
                    error.message,
            })
        }
    }

/* ================= LOGIN ================= */

exports.login =
    async (
        req,
        res,
    ) => {
        const {
            email,
            password,
        } =
            req.body

        if (
            !email ||
            !password
        ) {
            return res.status(
                400,
            ).json({
                message:
                    'Email and password required',
            })
        }

        try {
            const user =
                await User.findOne(
                    {
                        email,
                    },
                )

            if (
                !user
            ) {
                return res.status(
                    400,
                ).json({
                    message:
                        'Invalid credentials',
                })
            }

            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password,
                )

            if (
                !isMatch
            ) {
                return res.status(
                    400,
                ).json({
                    message:
                        'Invalid credentials',
                })
            }

            const token =
                jwt.sign(
                    {
                        id: user._id,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn:
                            '1h',
                    },
                )

            res.status(
                200,
            ).json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email:
                        user.email,
                },
            })
        } catch (
            error
        ) {
            res.status(
                500,
            ).json({
                error:
                    error.message,
            })
        }
    }

/* ================= GET PROFILE ================= */

exports.getProfile =
    async (
        req,
        res,
    ) => {
        try {
            const user =
                await User.findById(
                    req.user.id,
                ).select(
                    '-password',
                )

            res.json(
                user,
            )
        } catch (
            error
        ) {
            res.status(
                500,
            ).json({
                message:
                    'Error loading profile',
            })
        }
    }




    exports.changePassword =
    async (
        req,
        res,
    ) => {
        try {
            const {
                currentPassword,
                newPassword,
            } =
                req.body

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

            if (
                !user
            ) {
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

            if (
                !isMatch
            ) {
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
        } catch (
            error
        ) {
            res.status(
                500,
            ).json({
                message:
                    'Password change failed',
            })
        }
    }



/* ================= UPDATE PROFILE ================= */



exports.updateProfile =
    async (
        req,
        res,
    ) => {
        try {
            const user =
                await User.findByIdAndUpdate(
                    req.user.id,
                    req.body,
                    {
                        new: true,
                    },
                ).select(
                    '-password',
                )

            res.json(
                user,
            )
        } catch (
            error
        ) {
            res.status(
                500,
            ).json({
                message:
                    'Error updating profile',
            })
        }
    }