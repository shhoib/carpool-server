const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userID: {
        type: String
    },
   
    notifications: [
        {
            message: {
                type: String
            },
            senderName: {
                type: String
            },
             senderID: {
                type: String
            },
        }
    ]
});

module.exports = mongoose.model('notification', notificationSchema);
