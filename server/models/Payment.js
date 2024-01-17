const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const PaymentSchema = new Schema(
  {
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
    razorpay_payment_status: {
      type: Boolean,
      required: true,
    },
    razorpay_order_price: {
      type: String,
      required: true,
    },
    time_stamp: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Payments" }
);

const Payment = mongoose.model("payment", PaymentSchema);
module.exports = Payment;
