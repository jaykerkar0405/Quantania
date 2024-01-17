const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const customer_details = require("../middleware/customer_details");
const administrator_details = require("../middleware/administrator_details");
const email_verification = require("../middleware/email_verification");
const dotenv = require("dotenv").config();

// JWT_SECRET_KEY For Authentication Of A Customer - This Is A Confidential Key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// ROUTE 1: Creating A Customer | Method: POST | Endpoint: /api/customer/registration
router.post(
  "/registration",
  [
    body(
      "username",
      "Please enter a valid username of minimum length 3 characters"
    ).isLength({ min: 3 }),
    body("email_id", "Please enter a valid email id").isEmail(),
    body("mobile_number", "Please enter a valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
    body(
      "password",
      "Please enter a valid name of minimum length 8 characters"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Fetching customer information from the body of request
      let { username, email_id, mobile_number, password } = req.body;

      let customer = await Customer.find({
        $or: [
          {
            username: username,
          },
          {
            email_id: email_id,
          },
          {
            mobile_number: mobile_number,
          },
        ],
      });

      if (customer.length > 0) {
        return res.status(400).json({
          result: {
            error:
              "Sorry a customer with same username/email id/mobile number already exists",
          },
        });
      }

      // Generating Salt And Hashing The Password Received By The customer
      const salt = await bcrypt.genSalt(10);
      const password_hashed = await bcrypt.hash(password, salt);

      // Creating A Customer According To The Data Provided
      customer = await Customer.create({
        username: username,
        email_id: email_id,
        mobile_number: mobile_number,
        password: password_hashed,
        status: "inactive",
      });

      // Signing The Json Web Token For Creating Authentication Token
      const jwt_data = { customer: { id: customer.id } };
      const customer_authentication_token = jwt.sign(jwt_data, JWT_SECRET_KEY);

      if (customer) {
        let customer_email_verification = await email_verification(
          customer.username,
          customer.email_id,
          customer_authentication_token,
          customer
        );

        if (customer_email_verification == 1) {
          res.status(200).send({
            result: {
              success: `Successfully sent the customer verification email at ${customer.email_id}`,
            },
          });
        } else {
          res.status(500).send({
            result: {
              error:
                "Failed to send the customer verification email. Please try again later",
            },
          });
        }
      } else {
        res.status(500).send({
          result: {
            error:
              "Failed to create the customer account. Please try again later",
          },
        });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  }
);

// ROUTE 2: Logging In A Customer | Method: POST | Endpoint: /api/customer/login
router.post(
  "/login",
  [
    body(
      "password",
      "Please enter a valid password of minimum length 8 character"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Fetching Identifier And Password From The Body Of Request
      const { identifier, password } = req.body;

      // Verification Of The Fetched Identifier
      let customer;

      if (typeof identifier == "number") {
        customer = await Customer.findOne({
          mobile_number: identifier,
        });
      } else {
        customer = await Customer.findOne({
          username: identifier,
        });
      }

      if (!customer || customer.status == "inactive") {
        return res.status(400).json({
          result: { error: "Please try to login using valid credentials" },
        });
      }

      // Verification Of The Fetched Password
      const compare_password = await bcrypt.compare(
        password,
        customer.password
      );

      if (!compare_password) {
        return res.status(400).json({
          result: { error: "Please try to login using valid credentials" },
        });
      }

      // Signing The Json Web Token For Creating Authentication Token
      const jwt_data = { customer: { id: customer.id } };
      const customer_authentication_token = jwt.sign(jwt_data, JWT_SECRET_KEY);

      res.json({
        result: {
          success: "The customer has logged in successfully",
        },
        customer_authentication_token: customer_authentication_token,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  }
);

// ROUTE 3: Fetch The Details Of The Customer Who Is Logged In | Method: POST | Endpoint: /api/customer/customer_details
router.post("/customer_details", customer_details, async (req, res) => {
  if (req.customer_data.customer_authenticity) {
    try {
      const customer_id = req.customer_data.customer_id;
      const customer_details = await Customer.findById(customer_id).select(
        "-password"
      );
      res.send({
        result: {
          success: "The customer details has been fetched successfully",
        },
        customer_details: customer_details,
      });
    } catch (error) {
      console.error(error.message);
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

// ROUTE 4: Updating A Customer | Method: PUT | Endpoint: /api/customer/update_customer
router.put(
  "/update_customer",
  customer_details,
  [
    body(
      "username",
      "Please enter a valid username of minimum length 3 characters"
    ).isLength({ min: 3 }),
    body("email_id", "Please enter a valid email id").isEmail(),
    body("mobile_number", "Please enter a valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
  ],
  async (req, res) => {
    if (req.customer_data.customer_authenticity) {
      try {
        const { username, email_id, mobile_number } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // Creating A New Customer For Updation According To The Data
        const customer = {};
        if (username) {
          customer.username = username;
        }
        if (email_id) {
          customer.email_id = email_id;
        }
        if (mobile_number) {
          customer.mobile_number = mobile_number;
        }

        // Validating The Customer For Updation
        let update_customer = await Customer.findById(
          req.customer_data.customer_id
        );
        if (!update_customer) {
          return res.status(404).send({
            result: { error: "The customer with this ID was not found" },
          });
        }

        if (update_customer.email_id != email_id) {
          customer.status = "inactive";

          email_verification(
            update_customer.username,
            email_id,
            req.get("customer_authentication_token"),
            customer
          );
        }

        // Updating The Customer According To The Data
        update_customer = await Customer.findByIdAndUpdate(
          req.customer_data.customer_id,
          { $set: customer },
          { new: true }
        );
        res.json({
          result: {
            success: "The requested customer has been updated successfully",
          },
          update_customer: update_customer,
        });
      } catch (error) {
        console.error(error.message);
        res.status(500).send({ result: { error: "Internal Server Error" } });
      }
    } else {
      res.status(401).send({
        result: {
          error: "Your Access Has Been Denied - Unauthorized Access",
        },
      });
    }
  }
);

// ROUTE 5: Deleting A Customer | Method: DELETE | Endpoint: /api/customer/delete_customer
router.delete(
  "/delete_customer/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        // Validating The Customer For Deletion
        let delete_customer = await Customer.findById(req.params.id);
        if (!delete_customer) {
          return res.status(404).send({
            result: { error: "The customer with this ID was not found" },
          });
        }

        // Deleting The Customer As Per The Request
        delete_customer = await Customer.findByIdAndDelete(req.params.id);
        res.json({
          result: {
            success: "The requested customer has been deleted successfully",
          },
          delete_customer: delete_customer,
        });
      } catch (error) {
        console.error(error.message);
        res.status(500).send({ result: { error: "Internal Server Error" } });
      }
    } else {
      res.status(401).send({
        result: {
          error: "Your Access Has Been Denied - Unauthorized Access",
        },
      });
    }
  }
);

// ROUTE 6: Fetching All Customers | Method: GET | Endpoint: /api/customer/fetch_customer
router.get("/fetch_customer", administrator_details, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.administrator_data.administrator_authenticity) {
    try {
      let customer = await Customer.find({}).select("-password");
      if (customer) {
        return res.status(200).json({
          result: {
            success: "The customer have been fetched successfully",
          },
          customer,
        });
      } else {
        return res.status(400).json({
          result: {
            error: "There is some problem while fetching the customer",
          },
        });
      }
    } catch (error) {
      console.error(error.message);
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

// ROUTE 7: Updating Status Of Customer Status Using Id | Method: PUT | Endpoint: /api/customer/update_customer_status/customer_id
router.put(
  "/update_customer_status/customer_id/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        // Retriving Title, Content And Label From The Body Of Request
        const { status } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // Creating A New Customer For Updation According To The Data Provided
        const customer_status = {};
        if (status) {
          customer_status.status = status;
        }

        // Validating The Customer For Updation
        let update_customer_status = await Customer.findById(req.params.id);
        if (!update_customer_status) {
          return res
            .status(404)
            .send({ error: "The customer with this ID was not found" });
        }

        // Updating The Customer According To The Data Provided
        update_customer_status = await Customer.findByIdAndUpdate(
          req.params.id,
          { $set: customer_status },
          { new: true }
        );
        res.json({
          success: "The customer status has been updated successfully",
          customer_details: update_customer_status,
        });
      } catch (error) {
        console.error(error.message);
        res.status(500).send({ result: { error: "Internal Server Error" } });
      }
    } else {
      res.status(401).send({
        result: {
          error: "Your Access Has Been Denied - Unauthorized Access",
        },
      });
    }
  }
);

// ROUTE 8: Updating Status Of Customer Using Authentication Token | Method: PUT | Endpoint: /api/customer/update_customer_status/authentication_token
router.put(
  "/update_customer_status/authentication_token",
  customer_details,
  async (req, res) => {
    try {
      // Fetching Customer Id From Authentication Token
      let customer_id = req.customer_data.customer_id;

      // Validating The Customer For Updation
      let find_customer = await Customer.findById(customer_id);

      if (!find_customer) {
        return res
          .status(404)
          .send({ error: "The customer with this ID was not found" });
      }

      const customer = {
        status: req.body.status,
      };

      // Updating The Customer According To The Data Provided
      let update_customer_status = await Customer.findByIdAndUpdate(
        customer_id,
        { $set: customer },
        { new: true }
      );
      res.json({
        result: {
          success: "The customer status has been updated successfully",
        },
        update_customer_status: update_customer_status,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  }
);

// ROUTE 9: Fetching Customer Count Based On Month | Method: Get | Endpoint: /api/customer/customer_count
router.get("/customer_count", administrator_details, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ result: { errors: errors.array() } });
  }

  if (req.administrator_data.administrator_authenticity) {
    try {
      let months = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12];
      let result = [];

      for (let index = 0; index < months.length; index++) {
        let customer_count = await Customer.find({
          time_stamp: {
            $gt: new Date(`2022-${months[index]}-01`),
            $lt: new Date(`2022-${months[index]}-31`),
          },
        }).count();
        result.push(customer_count);
      }

      if (result) {
        return res.status(200).send({
          result: { result },
        });
      } else {
        return res.status(400).json({
          result: {
            error: "There is some problem while fetching the customer count",
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

// ROUTE 10: Changing Password Of Customer | Method: PUT | Endpoint: /api/customer/change_password
router.put(
  "/change_password",
  customer_details,
  [
    body(
      "old_password",
      "Please enter a valid current password of minimum length 8 characters"
    ).isLength({ min: 8 }),
    body(
      "new_password",
      "Please enter a valid new password of minimum length 8 characters"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ result: { errors: errors.array() } });
    }

    if (req.customer_data.customer_authenticity) {
      try {
        // Retrieving Password Details From The Body Of Request
        let { old_password, new_password } = req.body;

        //Generating Salt And Hashing The Password Received
        const salt = await bcrypt.genSalt(10);
        const new_password_hashed = await bcrypt.hash(new_password, salt);

        // Validating The Customer For Changing Password
        let find_customer = await Customer.findById(
          req.customer_data.customer_id
        );

        if (!find_customer) {
          return res.status(404).send({
            result: { error: "The customer with this ID was not found" },
          });
        }

        // Verification Of The Retrieved Old Password
        const compare_password = await bcrypt.compare(
          old_password,
          find_customer.password
        );

        if (!compare_password) {
          return res.status(404).send({
            result: { error: "Please enter correct password" },
          });
        }

        // Creating A Administrator For Updation
        let update_customer = {};
        if (new_password_hashed) {
          update_customer.password = new_password_hashed;
        }

        // Updating The Administrator According To The Data Provided
        let customer = await Customer.findByIdAndUpdate(
          req.customer_data.customer_id,
          { $set: update_customer },
          { new: true }
        );
        res.json({
          result: { success: "Successfully updated the password" },
        });
      } catch (error) {
        res.status(500).send({ result: { error: "Internal Server Error" } });
      }
    } else {
      res.status(401).send({
        result: {
          error: "Your Access Has Been Denied - Unauthorized Access",
        },
      });
    }
  }
);

module.exports = router;
