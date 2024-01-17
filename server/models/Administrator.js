const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const AdministratorSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email_id: {
      type: String,
      required: true,
      unique: true,
    },
    mobile_number: {
      type: Number,
      required: true,
      unique: true,
    },
    administrator_image: {
      public_id: {
        type: String,
      },
      image_url: {
        type: String,
      },
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
  { collection: "Administrators" }
);

const Administrator = mongoose.model("administrator", AdministratorSchema);
module.exports = Administrator;
