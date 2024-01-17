const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const Customer = require("../models/Customer");
const { findById } = require("../models/Customer");

// JWT_SECRET_KEY For Authentication Of A Customer - This Is A Confidential Key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const customer_details = async (req, res, next) => {
  // Verifying The JWT Authentication Token
  const customer_authentication_token = req.header(
    "customer_authentication_token"
  );

  if (!customer_authentication_token) {
    res.status(401).send({
      result: {
        error: "Please authenticate using a valid authentication token",
      },
    });
  }

  // Fetch The Customer Id From The JWT Authentication Token
  if (customer_authentication_token) {
    try {
      const jwt_data = jwt.verify(
        customer_authentication_token,
        JWT_SECRET_KEY
      );

      let find_customer = await Customer.findById(jwt_data.customer.id);

      if (find_customer && find_customer.status == "active") {
        req.customer_data = {
          customer_id: find_customer._id,
          customer_authenticity: true,
        };
      }

      if (find_customer && find_customer.status == "inactive") {
        req.customer_data = {
          customer_id: find_customer._id,
          customer_authenticity: false,
        };
      }

      if (!find_customer) {
        req.customer_data = {
          customer_authenticity: false,
        };
      }
      next();
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  }
};

module.exports = customer_details;
