const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userID: {
        type: String
    },
   
    notifications: [
        {
            notificationType: {
                type: String
            },
            message: {
                type: String
            },
            senderName: {
                type: String
            },
             senderID: {
                type: String
            },
             rideID: {
                type: String
            },
        }
    ]
});

module.exports = mongoose.model('notification', notificationSchema);
