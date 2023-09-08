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
    phoneNumber:{
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
    emailVerified:{
        type:Boolean,
    },
    phoneNumberVerified:{
        type:Boolean,
    },
    DOB:{
        type:Number,
    },
    feedback:{
        type:String,
    },
    about:{
        type:String,
    },
    
})

module.exports = mongoose.model('user',userSchema)