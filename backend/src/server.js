const express = require ('express')
const cors = require('cors')
const authRoutes = require ('./routes/authRoutes')
const authMiddleware = require('./middleware/authMiddleware')
require('dotenv').config()



const connectDb = require('./config/db')

const app = express()

connectDb()

app.use (cors())
app.use (express.json())
app.use ('/api/auth',authRoutes)


app.get('/', (req,res) => {
    res.send('Personal expense Tracker Api running')

})


app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Protected route accessed', user: req.user })
})


const PORT = 5000

app.listen(PORT,()=> {
    console.log(`server is running on port ${PORT}`)
})