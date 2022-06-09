const express = require('express')
const session = require('express-session')
const cors = require('cors')
const MongoStore = require('connect-mongo')
const passport = require('passport')

// -------------------- End Of externalLib Import --------------------//
const connection = require('./config/dbConnection')
const userRouter = require('./routes/userRoutes')

// -------------------- End Of personalLib Import --------------------//

// --------------------dotenv variable importing --------------------//
require('dotenv').config()
const app = express()

// --------------------All Constant required in File --------------------//
const PORT = process.env.PORT
const FrontEndLink = 'http://localhost:3000'
// express inbuilt bodyParser
app.use(express.json({ extended: true, limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
// cors
app.use(
  cors({
    origin: FrontEndLink,
    credentials: true,
  })
)

// express session and session store
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_STRING,
      dbName: 'Session',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
)
// Passport Auth
// const intializePassport = require('./config/passport')
// intializePassport(passport)

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

// app.use((req, res, next) => {
//   console.log(req.session)
//   console.log(req.user)
//   next()
// })

// -------------------- Starting App on Port --------------------//
app.listen(PORT, () => {
  console.log(`Server Running on Port: http://localhost:${PORT}`)
})

// --------------------------- User Router --------------------------//

app.use('/users', userRouter)
