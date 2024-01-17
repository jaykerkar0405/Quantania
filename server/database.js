const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const mongooseURI = process.env.MONGOOSE_URI;

const connectToMongoDB = () => {
  mongoose.connect(mongooseURI, () => {
    console.log("Connected to MongoDB successfully");
  });
};

module.exports = connectToMongoDB;
