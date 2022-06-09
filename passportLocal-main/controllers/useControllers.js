const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/userModel')
const passport = require('passport')

createUser = async (req, res) => {
  const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const { username, password: plainPassword, confirmPassword } = req.body
  if (!username.match(emailRegx)) {
    res.json({
      status: 'Error',
      msg: 'Plase Enter valid Email',
    })
  } else if (plainPassword.length <= 7) {
    res.json({
      status: 'Error',
      msg: 'Password should have atleast 7 charecters',
    })
  } else if (plainPassword !== confirmPassword) {
    res.json({
      status: 'Error',
      msg: 'Both Password Field should have equal Value',
    })
  } else if (plainPassword === confirmPassword) {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(plainPassword, salt)

    const newUser = new User({ username, password })
    try {
      await newUser.save()

      res.status(201).json(newUser)
    } catch (error) {
      res.status(409).json({ message: error.message })
    }
  } else {
    res.json({
      status: 'Error',
      msg: 'Something went wrong Check your fields',
    })
  }
}
LoginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err
    if (!user) res.send('No User Exists')
    else {
      req.logIn(user, (err) => {
        if (err) throw err
        res.send('Successfully Authenticated')
        console.log(req.user)
      })
    }
  })(req, res, next)
}

LogoutUser = (req, res, next) => {
  req.logout()
  res.send('You are successfully Logout')
}
module.exports = { createUser, LoginUser, LogoutUser }
