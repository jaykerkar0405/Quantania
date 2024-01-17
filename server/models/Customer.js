const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const CustomerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email_id: {
      type: String,
      unique: true,
      required: true,
    },
    mobile_number: {
      type: Number,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    time_stamp: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Customers" }
);

const Customer = mongoose.model("customer", CustomerSchema);
module.exports = Customer;
