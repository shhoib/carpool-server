const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    USERID:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"  
        },
    payment_details : [{
        razorPay_order_id : {
            type: String
        },
        amount : {
            type: Number
        },
        payed_by : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        },  
        payed_at : {
            type: String
        }
    }]
    });

module.exports = mongoose.model('payment', paymentSchema);
