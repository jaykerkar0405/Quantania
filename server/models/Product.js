const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ProductSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_category: {
      category_id: {
        type: String,
        required: true,
      },
      category_name: {
        type: String,
        required: true,
      },
    },
    product_details: {
      type: String,
      required: true,
    },
    product_mrp: {
      type: Number,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_image: {
      public_id: {
        type: String,
      },
      image_url: {
        type: String,
      },
    },
    product_developer: {
      type: String,
      required: true,
    },
    product_registrar: {
      type: String,
    },
    product_updater: {
      type: String,
    },
    featured_product: {
      type: Boolean,
      required: true,
    },
    download_link: {
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
  { collection: "Products" }
);

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
