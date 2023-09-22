const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userID:{
        type: String
    },
    notifications:{
        type: Array
    }
})

module.exports= mongoose.model('notification',notificationSchema);