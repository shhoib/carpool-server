const express = require('express')
const user_route = express.Router();
const user = require('../controllers/userController')
const tryCatchMiddleware = require('../middlewares/tryCatch')

user_route.post('/signup',tryCatchMiddleware(user.signup))
user_route.post('/signup/googleAuth',tryCatchMiddleware(user.signupWithGoogleAuth))
user_route.post('/login',tryCatchMiddleware(user.login))
user_route.post('/login/googleAuth',tryCatchMiddleware(user.loginWithGoogleAuth))
user_route.post('/hostRide',tryCatchMiddleware(user.hostRide))
user_route.get('/JoinRide',tryCatchMiddleware(user.joinRide))
user_route.get('/rideDetails/:id',tryCatchMiddleware(user.rideDetails))

module.exports = user_route;