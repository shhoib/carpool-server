const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    userID: {
        type : mongoose.Schema.Types.ObjectId,
         ref : "user"
    },
    ratings:[{    
            raterByID:{
                type : mongoose.Schema.Types.ObjectId,
                 ref : "user"
            },
            ratedImogi:{
                type:Number
            },
            aboutRide:{
                type:String
            }
        }]    
    });

module.exports = mongoose.model('ratings', ratingSchema);
