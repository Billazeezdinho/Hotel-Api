const express = require('express');
require('./config/database')
const PORT = process.env.PORT
const userRouter = require('./router/userRouter')
const categoryRouter = require('./router/categoryRouter')
const roomRouter = require('./router/roomRouter')
const app = express(); 

app.use(express.json())
app.use('/api/v1', userRouter)
app.use('/api/v1', categoryRouter)
app.use('/api/v1', roomRouter)
app.listen(PORT, ()=>{
    console.log(`Server is listening to PORT: ${PORT}`)
    
})