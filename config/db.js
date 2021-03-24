const mongoose = require('mongoose')

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  // .then((conn) => {
  //   return conn
  // })
  // .catch((err) => {
  //   console.log(err)
  // })

  console.log(
    `Connected to Mongo DB at  ${conn.connection.host}`.cyan.underline
      .bold
  )
}

module.exports = connectDB
