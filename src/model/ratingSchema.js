const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    userID: {
        type: String
    },
    ratedBy: {
        type: String
    },
    rating: {
        type: String
    },
    about: {
        type: String
    },
   
});

module.exports = mongoose.model('ratings', ratingSchema);
