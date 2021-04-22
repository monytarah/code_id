const jwt = require('jsonwebtoken')

function authenticate (req, res, next) {
  try {
    const decoded = jwt.verify(req.headers.access_token, 'meong');
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" })
    } else {
      next()
    } 
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" })
  }
}

module.exports = authenticate