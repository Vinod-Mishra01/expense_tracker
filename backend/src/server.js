const express = require('express')

const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const savingRoutes = require('./routes/savingRoutes')
const borrowLendRoutes = require('./routes/borrowLendRoutes')
const salaryRoutes = require('./routes/salaryRoutes')
const aiRoutes = require('./routes/aiRoutes')
const authMiddleware = require('./middleware/authMiddleware')

const connectDb = require('./config/db')

const app = express()

connectDb()

app.use(cors())
app.use(express.json())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/expense', expenseRoutes)
app.use('/api/saving', savingRoutes)
app.use('/api/borrow-lend', borrowLendRoutes)
app.use('/api/salary', salaryRoutes)
app.use('/api/ai', aiRoutes)



app.get('/', (req, res) => {
    res.send('Personal Expense Tracker API Running')
})

app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({
        message: 'Protected route accessed',
        user: req.user,
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})