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
    hoster:{
        type: String
    }
})

module.exports= mongoose.model('Rides',rideSchema);