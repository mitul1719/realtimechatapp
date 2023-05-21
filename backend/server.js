const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const connectDb = require('./config/db')
const { notFound, errorHandler } = require('./middlewares/errorMiddlewares')

require('dotenv').config()
connectDb()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT || 1337, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})
