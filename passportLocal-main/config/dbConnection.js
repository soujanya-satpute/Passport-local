const mongoose = require('mongoose')
require('dotenv').config()
const CONNECTION_URL = process.env.DB_STRING

const connection = mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`DB is Connected`)
  })
  .catch((error) => console.log(`${error} do not connect`))

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

module.exports = connection
