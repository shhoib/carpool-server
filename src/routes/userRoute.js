const express = require('express')
const user_route = express();
const user = require('../controllers/userController')


user_route.post('/users/signup',user.signupUser)

module.exports = user_route;