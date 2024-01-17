const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const Administrator = require("../models/Administrator");
const { findById } = require("../models/Administrator");

// JWT_SECRET_KEY For Authentication Of A Administrator - This Is A Confidential Key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const administrator_details = async (req, res, next) => {
  // Verifying The JWT Authentication Token
  const administrator_authentication_token = req.header(
    "administrator_authentication_token"
  );

  if (!administrator_authentication_token) {
    res.status(401).send({
      result: {
        error: "Please authenticate using a valid authentication token",
      },
    });
  }

  // Fetch The Administrator Id From The JWT Authentication Token
  if (administrator_authentication_token) {
    try {
      const jwt_data = jwt.verify(
        administrator_authentication_token,
        JWT_SECRET_KEY
      );

      let find_administrator = await Administrator.findById(
        jwt_data.administrator.id
      );

      if (find_administrator && find_administrator.status == "active") {
        req.administrator_data = {
          administrator_id: find_administrator._id,
          administrator_authenticity: true,
        };
      }

      if (find_administrator && find_administrator.status == "inactive") {
        req.administrator_data = {
          administrator_id: find_administrator._id,
          administrator_authenticity: false,
        };
      }

      if (!find_administrator) {
        req.administrator_data = {
          administrator_authenticity: false,
        };
      }

      next();
    } catch (error) {
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  }
};

module.exports = administrator_details;
