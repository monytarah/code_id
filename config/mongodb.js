const { MongoClient } = require("mongodb");

let database

async function connect () {
  try {
    const uri = 'mongodb://localhost:27017'
    const client = new MongoClient(uri, { useUnifiedTopology: true })
    
    await client.connect()
    
    const db = client.db('monyta')
    // console.log(db)
    database = db 

  } catch (error) {
    console.log(error)
  }
}

function getDatabase () {
  return database
}

module.exports = {
  connect, 
  getDatabase
}