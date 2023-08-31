const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        // required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        // required:true
    },
    password:{
        type:String,
        // required:true
    },
    gender:{
        type:String,
        // required:true
    },
    feedback:{
        type:String,
    },
    
})

module.exports = mongoose.model('user',userSchema)