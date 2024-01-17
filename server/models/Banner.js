const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const BannerSchema = new Schema(
  {
    banner_title: {
      type: String,
      required: true,
    },
    banner_image: {
      public_id: {
        type: String,
      },
      image_url: {
        type: String,
      },
    },
    button_text: {
      type: String,
      required: true,
    },
    button_link: {
      type: String,
      required: true,
    },
    banner_registrar: {
      type: String,
    },
    banner_updater: {
      type: String,
    },
    banner_status: {
      type: String,
      required: true,
    },
    time_stamp: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "Banners" }
);

const Banner = mongoose.model("banner", BannerSchema);
module.exports = Banner;
