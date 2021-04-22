const UserController = require('../controllers/userController')
const authenticate = require('../middlewares/auth')
const router = require('express').Router()

router.post('/login', UserController.login)

router.use(authenticate)

router.post('/users', UserController.createUser)
router.get('/users/account-number/:accountNumber', UserController.getUserByAccountNumber)
router.get('/users/identity-number/:identityNumber', UserController.getUserByIdentityNumber)
router.put('/users/identity-number/:identityNumber', UserController.updateUser)
router.delete('/users/identity-number/:identityNumber', UserController.deleteUser)

module.exports = router