const express = require('express');
require('./config/database')
const PORT = process.env.PORT
const secret = process.env.express_session_secret
const userRouter = require('./router/userRouter');
const categoryRouter = require('./router/categoryRouter');
const roomRouter = require('./router/roomRouter');
const session = require('express-session')
const passport = require('passport');
require('./middleware/passport')
const app = express(); 

app.use(express.json())
app.use(session({
    secret:secret,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', userRouter)
app.use('/api/v1', categoryRouter)
app.use('/api/v1', roomRouter)
app.listen(PORT, ()=>{
    console.log(`Server is listening to PORT: ${PORT}`)
    
})
