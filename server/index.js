const connectToMongoDB = require("./database");
const express = require("express");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT;

connectToMongoDB();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(fileUpload());
app.use(
  cors({
    origin: "*",
  })
);

// Cloudinary Configuration :
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Quantania Application Routes :
app.options("*", cors());
app.use("/api/customer", require("./routes/customer"));
app.use("/api/administrator", require("./routes/administrator"));
app.use("/api/product", require("./routes/product"));
app.use("/api/category", require("./routes/category"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/order", require("./routes/order"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/statistics", require("./routes/statistics"));
app.use("/api/banner", require("./routes/banner"));

app.listen(port, () => {
  console.log(`The Quantania server is listening on port ${port}`);
});
