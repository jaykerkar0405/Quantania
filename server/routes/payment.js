const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const dotenv = require("dotenv").config();
const Razorpay = require("razorpay");
const order_confirmation = require("../middleware/order_confirmation");

router.get("/razorpay_key_id", (req, res) => {
  try {
    res.status(200).send({ razorpay_key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/razorpay_create_payment", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.order_price,
      currency: "INR",
    };

    const payment = await instance.orders.create(options);
    if (!payment) {
      return res.status(500).send("Internal Server Error");
    }
    res.status(200).send(payment);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/razorpay_payment", async (req, res) => {
  try {
    const {
      razorpay_order_price,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      razorpay_payment_status,
      order_id,
      customer_email_id,
    } = req.body;

    const payment = {
      payment_information: {
        razorpay_payment_status: razorpay_payment_status,
        razorpay_order_price: razorpay_order_price,
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
      },
      payment_status: razorpay_payment_status ? "active" : "inactive",
      order_status: razorpay_payment_status ? "active" : "inactive",
    };

    if (razorpay_payment_status) {
      await order_confirmation(customer_email_id);
    }

    let update_order_entry = await Order.findByIdAndUpdate(
      order_id,
      { $set: payment },
      { new: true }
    );

    if (update_order_entry) {
      res.status(200).send({
        result: "Payment was successfull",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/fetch_payment", async (req, res) => {
  try {
    const payment = await Payment.find();
    res.status(200).send({
      payment: payment,
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
