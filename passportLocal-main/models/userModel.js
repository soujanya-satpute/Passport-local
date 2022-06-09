const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },

  password: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  numberOfBooksRead: {
    type: Number,
    default: 0,
  },
})

var User = mongoose.model('User', userSchema)

module.exports = User
