import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js' //.js is necessary while using ES6 module.
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import morgan from 'morgan'
import path from 'path'

import productRoutes from './routes/productRouter.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

//Init
const app = express()
app.use(express.json()) //body parser
dotenv.config()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


//Connect to DB
connectDB()


// Routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID)
})
app.use('/api/upload', uploadRoutes)

const __dirname = path.resolve()

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', () => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}


//Middlewares
app.use(notFound)
app.use(errorHandler)




const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server started in ${process.env.NODE_ENV} on PORT ${PORT}`))