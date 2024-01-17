const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ContactSchema = new Schema(
  {
    customer: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email_id: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    resolver: {
      type: String,
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
  { collection: "Contact" }
);

const Contact = mongoose.model("contact", ContactSchema);
module.exports = Contact;
