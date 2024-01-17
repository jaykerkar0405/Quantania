const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { body, validationResult } = require("express-validator");
const customer_details = require("../middleware/customer_details");
const administrator_details = require("../middleware/administrator_details");
const contact_solution = require("../middleware/contact_solution");

// ROUTE 1: Creating A Contact Entry | Method: POST | Endpoint: /api/contact/add_contact_entry
router.post(
  "/add_contact_entry",
  customer_details,
  [
    body(
      "username",
      "Please enter a valid username of minimum length 3 characters"
    ).isLength({ min: 3 }),
    body("email_id", "Please enter a valid email id").isEmail(),
    body(
      "subject",
      "Please enter a valid subject of minimum length 10 characters"
    ).isLength({ min: 10 }),
    body(
      "message",
      "Please enter a valid message of minimum length 20 characters"
    ).isLength({ min: 20 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ result: { errors: errors.array() } });
    }

    if (req.customer_data.customer_authenticity) {
      try {
        let contact_entry = await Contact.findOne({
          customer: req.customer_data.customer_id,
          status: "active",
          $or: [{ subject: req.body.subject }, { message: req.body.message }],
        });

        if (contact_entry) {
          return res.status(400).json({
            result: {
              error:
                "The contact request with same subject and message has already been raised",
            },
          });
        }

        //Creating A Contact Entry According To The Data Provided By The Customer
        contact_entry = await Contact.create({
          customer: req.customer_data.customer_id,
          username: req.body.username,
          email_id: req.body.email_id,
          subject: req.body.subject,
          message: req.body.message,
          solution: " ",
          status: "active",
        });

        if (contact_entry) {
          res.status(200).send({
            result: {
              success: "The contact request has been raised successfully",
            },
            add_contact_entry: contact_entry,
          });
        } else {
          res.status(500).json({
            result: {
              error: "The contact request has not been raised",
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
  }
);

// ROUTE 2: Fetching Administrator Level Contact Entry | Method: Get | Endpoint: /api/contact/fetch_contact_entry/administrator
router.get(
  "/fetch_contact_entry/administrator",
  administrator_details,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ result: { errors: errors.array() } });
    }

    if (req.administrator_data.administrator_authenticity) {
      try {
        let contact_entry = await Contact.find({
          status: "active",
        });

        if (contact_entry) {
          res.status(200).json({
            result: {
              success: "The contact entry has been fetched successfully",
            },
            contact_entry: contact_entry,
          });
        } else {
          res.status(500).json({
            result: {
              error: "There is some problem while fetching the contact entry",
            },
          });
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send({ result: { error: "Internal Server Error" } });
      }
    } else {
      res.status(401).send({
        result: { error: "Your Access Has Been Denied - Unauthorized Access" },
      });
    }
  }
);

// ROUTE 3: Deleting Contact Entry | Method: DELETE | Endpoint: /api/contact/delete_contact_entry
router.delete(
  "/delete_contact_entry/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        // Validating The Contact Entry For Deletion
        let delete_contact_entry = await Contact.findById(req.params.id);
        if (!delete_contact_entry) {
          return res.status(404).send({
            result: { error: "The contact entry with this ID was not found" },
          });
        }

        // Deleting The Contact Entry As Per The Request By Admin
        delete_contact_entry = await Contact.findByIdAndDelete(req.params.id);
        if (delete_contact_entry) {
          res.status(200).json({
            result: {
              success:
                "The requested contact entry has been deleted successfully",
            },
            delete_contact_entry: delete_contact_entry,
          });
        } else {
          res.status(500).json({
            result: {
              error: "The requested contact entry has not been deleted",
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
  }
);

// ROUTE 4: Resolving Contact Entry | Method: POST | Endpoint: /api/contact/resolve_contact_entry
router.put(
  "/resolve_contact_entry/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        // Validating The Contact Entry For Resolving
        let resolve_contact_entry = await Contact.findById(req.params.id);
        if (!resolve_contact_entry) {
          return res.status(404).send({
            result: { error: "The contact entry with this ID was not found" },
          });
        }

        // Resolving The Contact Entry As Per The Request Provided By Admin
        resolve_contact_entry = await Contact.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              solution: req.body.solution,
              resolver: req.administrator_data.administrator_id,
              status: "inactive",
            },
          },
          { new: true }
        );

        if (resolve_contact_entry) {
          res.status(200).json({
            result: {
              success:
                "The requested contact entry has been resolved successfully",
            },
            resolve_contact_entry: resolve_contact_entry,
          });

          contact_solution(
            resolve_contact_entry.username,
            resolve_contact_entry.email_id,
            resolve_contact_entry.solution
          );
        } else {
          res.status(500).json({
            result: {
              success: "The requested contact entry has not been resolved",
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
  }
);

// ROUTE 5: Fetching Customer Level Contact Entry | Method: Get | Endpoint: /api/contact/fetch_contact_entry/customer
router.get(
  "/fetch_contact_entry/customer",
  customer_details,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ result: { errors: errors.array() } });
    }

    if (req.customer_data.customer_authenticity) {
      try {
        let contact_entry = await Contact.find({
          customer: req.customer_data.customer_id,
        });

        if (contact_entry) {
          return res.status(200).json({
            result: {
              success: "The contact entry has been fetched successfully",
            },
            contact_entry: contact_entry,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "There is some problem while fetching the contact entry",
            },
          });
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send({ result: { error: "Internal Server Error" } });
      }
    } else {
      res.status(401).send({
        result: { error: "Your Access Has Been Denied - Unauthorized Access" },
      });
    }
  }
);

module.exports = router;
