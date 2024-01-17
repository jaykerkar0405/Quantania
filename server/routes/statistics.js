const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Administrator = require("../models/Administrator");
const { body, validationResult } = require("express-validator");
const administrator_details = require("../middleware/administrator_details");
const dotenv = require("dotenv").config();

// ROUTE 1: Fetching Statistical Data | Method: Get | Endpoint: /api/statistics/statistical_data
router.get("/statistical_data", administrator_details, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ result: { errors: errors.array() } });
  }

  if (req.administrator_data.administrator_authenticity) {
    try {
      let months = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12];
      let order_result = [];
      let product_result = [];
      let customer_result = [];
      let administrator_result = [];

      for (let index = 0; index < months.length; index++) {
        let product_count = await Product.find({
          time_stamp: {
            $gt: new Date(`2022-${months[index]}-01`),
            $lt: new Date(`2022-${months[index]}-31`),
          },
        }).count();

        let order_count = await Order.find({
          time_stamp: {
            $gt: new Date(`2022-${months[index]}-01`),
            $lt: new Date(`2022-${months[index]}-31`),
          },
        }).count();

        let customer_count = await Customer.find({
          time_stamp: {
            $gt: new Date(`2022-${months[index]}-01`),
            $lt: new Date(`2022-${months[index]}-31`),
          },
        }).count();

        let administrator_count = await Administrator.find({
          time_stamp: {
            $gt: new Date(`2022-${months[index]}-01`),
            $lt: new Date(`2022-${months[index]}-31`),
          },
        }).count();

        product_result.push(product_count);
        order_result.push(order_count);
        customer_result.push(customer_count);
        administrator_result.push(administrator_count);
      }

      if (
        product_result &&
        order_result &&
        customer_result &&
        administrator_result
      ) {
        return res.status(200).send({
          product_result,
          order_result,
          customer_result,
          administrator_result,
        });
      } else {
        return res.status(400).json({
          result: {
            error: "There is some problem while fetching the statistical data",
          },
        });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  } else {
    res.status(401).send({
      result: {
        error: "Your Access Has Been Denied - Unauthorized Access",
      },
    });
  }
});

module.exports = router;
