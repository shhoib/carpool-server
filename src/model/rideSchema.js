const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    from:{
        type: String,
    },
    to:{
        type: String,
    },
    date:{
        type: String
    },
    passengers:{
        type: Number
    },
    vehicle:{
        type : String
    },
    amount:{
        type:Number
    },
    hoster:{
        type: String
    },
    hosterID:{
        type: String
    },
    joinerID:{
        type: String
    },
    isCompleted : {
        type : Boolean,
        default: false
    }
})

module.exports= mongoose.model('Rides',rideSchema);