const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT;
console.log(PORT);

app.use(cors());
app.use(express.json())

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/coride")
const db= mongoose.connection;

const items = ['a','b','c']

app.get('/coride/items',(req,res)=>{
    res.json(items)
})



app.listen(PORT,()=>console.log("server started")); 