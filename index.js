const express = require('express')
const app = express();
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const {Server} = require('socket.io')


const server = http.createServer(app)

const io = new Server(server,{
    cors: {
        origin : 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket)=>{
    // console.log(`user connected : ${socket.id}`);
 
    socket.on('disconnect',()=>{
        // console.log(`user disconnected: ${socket.id}`);
    })

    socket.on('join_room',(data)=>{
        console.log(data);
        socket.join(data) 
        console.log(`joined room ${data}`);
    })
 
    socket.on('send_message',(data)=>{ 
        socket.to(data.room).emit('receive_message', data)
    })   
    socket.on('send_notification',(data)=>{ 
        console.log(data.socketID,'hi');
        console.log(data);
        socket.to(data.socketID).emit('receive_notification',data.message)
    })  
})

 
const PORT = process.env.PORT;

app.use(cors()); 
app.use(express.json())
// app.use(express.urlencoded({ limit: "30mb", extended: true }));


const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/coride")
const db= mongoose.connection;

const userRoute = require('./src/routes/userRoute')
app.use('/',userRoute)


server.listen(PORT,()=>console.log("server started")); 
console.log(PORT);