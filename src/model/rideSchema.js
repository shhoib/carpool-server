const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    currentLocation:{
        type:[{
            street : String,
            city: String,
            state: String
        }],
    },
    destination:{
        type:[{
            street : String,
            city: String,
            state: String
        }],
    },
    date:{
        type: Number
    },
    passengers:{
        type: Number
    },
    hoster:{
        type: String
    }
})