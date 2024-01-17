const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const OrderSchema = new Schema(
  {
    customer: {
      type: String,
      required: true,
    },
    product: {
      type: Array,
      required: true,
    },
    order_price: {
      type: Number,
      required: true,
    },
    payment_information: {
      razorpay_payment_status: {
        type: String,
        required: true,
      },
      razorpay_order_price: {
        type: String,
        required: true,
      },
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
    },
    payment_status: {
      type: String,
      required: true,
    },
    order_status: {
      type: String,
      required: true,
    },
    download_link: {
      type: Array,
    },
    status_updater: {
      type: String,
    },
    time_stamp: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Orders" }
);

const Order = mongoose.model("order", OrderSchema);
module.exports = Order;
