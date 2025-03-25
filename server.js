// const express = require('express');
// require('./config/database')
// const PORT = process.env.PORT
// const secret = process.env.express_session_secret
// const userRouter = require('./router/userRouter');
// const categoryRouter = require('./router/categoryRouter');
// const roomRouter = require('./router/roomRouter');
// const session = require('express-session')
// const passport = require('passport');
// require('./middleware/passport')
// const app = express(); 

// app.use(express.json())
// app.use(session({
//     secret:secret,
//     resave: false,
//     saveUninitialized: false
// }))

// app.use(passport.initialize());
// app.use(passport.session());

// app.use('/api/v1', userRouter)
// app.use('/api/v1', categoryRouter)
// app.use('/api/v1', roomRouter)
// app.listen(PORT, ()=>{
//     console.log(`Server is listening to PORT: ${PORT}`)
    
// })


const express = require("express");
require("./config/database");
const session = require("express-session");
const passport = require("passport");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');

require("./middleware/passport");

const PORT = process.env.PORT || 3000;
const secret = process.env.express_session_secret;

// Import Routers
const userRouter = require("./router/userRouter");
const categoryRouter = require("./router/categoryRouter");
const roomRouter = require("./router/roomRouter");

const app = express();
app.use(express.json());
app.use(cors({origin: '*'}));

// Express Session
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cloud View Hotel Documentation",
      version: "1.0.0",
      description: "API for User, Category, and Room Management",
      license: {
        name: "base: https://hotel-api-svnc.onrender.com/api/v1",
      }
    },
    servers: [{ url: "https://hotel-api-svnc.onrender.com/api/v1",
        description: 'production Server'
     },
        {url: "http://localhost:"+ PORT, 
            description: 'Development server'
        }
    ],
  },
  apis: ["./router/*.js"], // Load API documentation from route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use Routers
app.get('/', (req, res)=>{
    res.send('Welcome to cloud view Hotel')
})
app.use("/api/v1", userRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", roomRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
  console.log(`Swagger docs available at https://hotel-api-svnc.onrender.com/api-docs`);
});


