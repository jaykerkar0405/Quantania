const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const CategorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    category_image: {
      public_id: {
        type: String,
      },
      image_url: {
        type: String,
      },
    },
    category_status: {
      type: String,
      required: true,
    },
    category_registrar: {
      type: String,
    },
    category_updater: {
      type: String,
    },
    time_stamp: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Categories" }
);

const Category = mongoose.model("category", CategorySchema);
module.exports = Category;
