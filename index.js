const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json())

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/coride")
const db= mongoose.connection;

const userRoute = require('./src/routes/userRoute')
app.use('/',userRoute)


app.listen(PORT,()=>console.log("server started")); 
console.log(PORT);