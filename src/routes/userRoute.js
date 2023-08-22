const express = require('express')
const user_route = express.Router();
const user = require('../controllers/userController')

user_route.post('/signup',user.signupUser)

module.exports = user_route;