const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();

var http = require('http').createServer(app)
var io = require('socket.io')(http)

const PORT = process.env.PORT;

app.use(cors()); 
app.use(express.json())
// app.use(express.urlencoded({ limit: "30mb", extended: true }));


const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/coride")
const db= mongoose.connection;

const userRoute = require('./src/routes/userRoute')
app.use('/',userRoute)


http.listen(PORT,()=>console.log("server started")); 
console.log(PORT);