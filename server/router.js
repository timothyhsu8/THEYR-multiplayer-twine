const express = require('express');
const UserController = require('./UserController')

const router = express.Router();

router.get('/users', UserController.getUsers)

module.exports = router