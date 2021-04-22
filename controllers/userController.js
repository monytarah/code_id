const User = require("../models/user")
const jwt = require('jsonwebtoken')
const Redis = require('ioredis')
const redis = new Redis()

class UserController {
  static login (req, res) {
    let payload = {
      email: "admin@gmail.com",
      role: "admin"
    }
    const access_token = jwt.sign(payload, 'meong')
    res.status(200).json({ access_token })
  }


  static async createUser (req, res) {
    try {
      const { ops } = await User.create(req.body)
      await redis.set(`users:account-number:${ops[0].accountNumber}`, JSON.stringify(ops[0]))
      await redis.set(`users:identity-number:${ops[0].identityNumber}`, JSON.stringify(ops[0]))
      res.status(201).json(ops[0])
    } catch (error) {
      res.status(500).json(error)
    }
  }

  static async getUserByAccountNumber (req, res) {
    try {
      const accountNumber = +req.params.accountNumber
      let cachedData = await redis.get(`users:account-number:${accountNumber}`)
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData))
      }
      let user = await User.getUserByAccountNumber(accountNumber)
      if (!user) {
        res.status(404).json({ message: "Data not found"})
      } else {
        await redis.set(`users:account-number:${accountNumber}`, JSON.stringify(user))
        res.status(200).json(user)
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
  
  static async getUserByIdentityNumber (req, res) {
    try {
      const identityNumber = +req.params.identityNumber
      let cachedData = await redis.get(`users:identity-number:${identityNumber}`)
      if (cachedData) {
        console.log('asd')
        return res.status(200).json(JSON.parse(cachedData))
      }
      let user = await User.getUserByIdentityNumber(identityNumber)
      if (!user) {
        res.status(404).json({ message: "Data not found"})
      } else {
        console.log('entah')
        await redis.set(`users:identity-number:${identityNumber}`, JSON.stringify(user))
        res.status(200).json(user)
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }

  static async updateUser (req, res) {
    try {
      let identityNumber = +req.params.identityNumber
      const { ok, value } = await User.updateUser(identityNumber, req.body)
      if (ok && value) {
        await redis.del(`users:identity-number:${identityNumber}`)
        await redis.del(`users:account-number:${value.accountNumber}`)
        res.status(200).json(value)
      } else {
        res.status(404).json({ message: 'Data not found' })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }

  static async deleteUser(req, res) {
    try {
      let identityNumber = +req.params.identityNumber
      const { ok, value } = await User.deleteUser(identityNumber)
      if (ok && value) {
        await redis.del(`users:identity-number:${identityNumber}`)
        await redis.del(`users:account-number:${value.accountNumber}`)
        res.status(200).json({ message: 'Deleted' })
      } else {
        res.status(404).json({ message: 'Data not found'})
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = UserController