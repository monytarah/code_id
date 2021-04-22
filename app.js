const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const { connect } = require('./config/mongodb')
const routes = require('./routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('hello')
})

app.use(routes)

connect().then(() => {
  console.log('Mongodb connected')
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
})

