import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import session from 'express-session'
import passport from 'passport'
import User from './User'
import { IUser } from './Types'
const GoogleStrategy = require('passport-google-oauth20').Strategy

var cors = require('cors')
dotenv.config()
const app = express()

mongoose.connect(
  `${process.env.START_MONGODB}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.END_MONGODB}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Connected to mongoose successfully')
  }
)
// Middlewere
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
  })
)

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user: any, done: any) => {
  return done(null, user._id)
})
passport.deserializeUser((id: string, done: any) => {
  User.findById(id, (err: Error, doc: IUser) => {
    return done(null, doc)
  })
})
passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: '/auth/google/callback',
    },
    function (accessToken: any, refreshToken: any, profile: any, cb: any) {
      User.findOne({ googleId: profile.id }, async (err: Error, doc: IUser) => {
        if (err) {
          return cb(err, null)
        }

        if (!doc) {
          const newUser = new User({
            googleId: profile.id,
            username: profile.name.givenName,
          })

          await newUser.save()
          cb(null, newUser)
        } else {
          cb(null, doc)
        }
      })
      // cb(null, profile)
    }
  )
)

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    // session: true,
  }),
  function (req, res) {
    res.redirect('http://localhost:3000')
  }
)

app.get('/getuser', (req, res) => {
  res.send(req.user)
})

app.get('/', (req: any, res: any) => {
  res.send('Helllo WOlrd')
})
app.listen(4000, () => {
  console.log('Server Starrted')
})
