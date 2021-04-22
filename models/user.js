const { getDatabase } = require("../config/mongodb")

class User {
  static async create(input) {
    try {
      await getDatabase().collection('monyta').createIndex({ "accountNumber": 1}, { unique: true })
      await getDatabase().collection('monyta').createIndex({ "identityNumber": 1}, { unique: true })
      return getDatabase().collection('monyta').insertOne(input)
    } catch (error) {
      return error
    }
  }

  static getUsersData () {
    return getDatabase().collection('monyta').find().toArray()
  }

  static getUserByAccountNumber(accountNumber) {
    return getDatabase().collection('monyta').findOne({ accountNumber })
  }

  static getUserByIdentityNumber(identityNumber) {
    return getDatabase().collection('monyta').findOne({ identityNumber })
  }
  
  static updateUser(identityNumber, input) {
    const { userName, emailAddress, accountNumber } = input
    const newData = {
      "$set": {
        userName, emailAddress, accountNumber 
      }
    }
    return getDatabase().collection('monyta').findOneAndUpdate({ identityNumber }, newData, { returnOriginal: false })
  }

  static deleteUser(identityNumber) {
    return getDatabase().collection('monyta').findOneAndDelete({ identityNumber })

  }
}

module.exports = User