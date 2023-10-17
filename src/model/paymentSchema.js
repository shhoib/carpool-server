const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    payment_id : {
        type: String
    },
    razorPay_order_id : {
        type: String
    },
    amount : {
        type: Number
    },
    payed_by : {
        type: String
    },
    payed_to : {
        type: String
    },
    payed_at : {
        type: String
    },
    });

module.exports = mongoose.model('payment', paymentSchema);
