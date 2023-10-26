const express = require('express')
const user_route = express.Router();
const user = require('../controllers/userController')
const tryCatchMiddleware = require('../middlewares/tryCatch')
const multer = require('../middlewares/multer')

user_route.post('/signup',tryCatchMiddleware(user.signup))
user_route.post('/signup/googleAuth',tryCatchMiddleware(user.signupWithGoogleAuth))
user_route.post('/login',tryCatchMiddleware(user.login))
user_route.post('/login/googleAuth',tryCatchMiddleware(user.loginWithGoogleAuth))
user_route.post('/hostRide',tryCatchMiddleware(user.hostRide))
user_route.get('/JoinRide',tryCatchMiddleware(user.joinRide))
user_route.get('/rideDetails/:id',tryCatchMiddleware(user.rideDetails))
user_route.get('/hosterDetails/:id',tryCatchMiddleware(user.hosterDetails))
user_route.post('/EditPersonalDetails',tryCatchMiddleware(user.EditPersonalDetails))
user_route.post('/EditPassword',tryCatchMiddleware(user.EditPassword))
user_route.get('/myRides/:id',tryCatchMiddleware(user.myRides))
user_route.get('/fetchChat',tryCatchMiddleware(user.fetchChat))
user_route.get('/fetchChatForNotification',tryCatchMiddleware(user.fetchChatForNotification))
user_route.get('/fetchPreviuosChatDetails',tryCatchMiddleware(user.fetchPreviuosChatDetails))
user_route.post('/uploadImage',multer,tryCatchMiddleware(user.uploadImage))
user_route.post('/sendNotification',tryCatchMiddleware(user.sendNotification))
user_route.get('/fetchNotification',tryCatchMiddleware(user.fetchNotification))
user_route.delete('/deleteNotification/:id',tryCatchMiddleware(user.deleteNotification))
user_route.post('/changeRideStatus',tryCatchMiddleware(user.changeRideStatus))
user_route.post('/review',tryCatchMiddleware(user.review))
user_route.post('/orders',tryCatchMiddleware(user.orders))
user_route.get('/reviews',tryCatchMiddleware(user.reviews))
user_route.get('/getKey',tryCatchMiddleware(user.getKey))
user_route.post('/paymentVerification',tryCatchMiddleware(user.paymentVerification))
user_route.post('/saveReceiverName',tryCatchMiddleware(user.saveReceiverName))
user_route.get('/fetchPayments',tryCatchMiddleware(user.fetchPayments))
user_route.get('/updateNumber',tryCatchMiddleware(user.updateNumber))
user_route.get('/hostedRideDetails',tryCatchMiddleware(user.hostedRideDetails))

module.exports = user_route;