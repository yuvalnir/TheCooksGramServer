const express = require('express')

const UserController = require('../controllers/userController')

const router = express.Router()

router.post('/user', UserController.createUser)
router.put('/user/:id', UserController.updateUser)
router.delete('/user/:id', UserController.deleteUser)
router.get('/user/:email', UserController.getUserByEmail)
//router.get('/users', UserController.getUsers)

module.exports = router