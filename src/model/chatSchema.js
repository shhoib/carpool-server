const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({

    fromID:{
        type: String
    },
    toID:{
        type: String
    }

})

module.exports= mongoose.model('chat',chatSchema);