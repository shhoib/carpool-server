const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({

    userID:{
        type: String
    },
    hosterID:{
        type: String
    }

})

module.exports= mongoose.model('chat',chatSchema);