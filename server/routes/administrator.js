const express = require("express");
const router = express.Router();
const Administrator = require("../models/Administrator");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const administrator_details = require("../middleware/administrator_details");
const email_verification = require("../middleware/email_verification");
const forgot_password_mail = require("../middleware/forgot_password_mail");
const cloudinary = require("cloudinary");

// JWT_SECRET_KEY For Authentication Of A Administrator - This Is A Confidential Key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// ROUTE 1: Creating A Administrator | Method: POST | Endpoint: /api/administrator/registration
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
      "Please enter a valid password of minimum length 8 characters"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ result: { errors: errors.array() } });
    }

    try {
      // Fetching administrator information from the body of request
      let { username, email_id, mobile_number, password } = req.body;

      let find_administrator = await Administrator.find({
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

      if (find_administrator.length > 0) {
        return res.status(400).json({
          result: {
            error:
              "Sorry a administrator with same username/email id/mobile number already exists",
          },
        });
      }

      // Generating Salt And Hashing The Password Received By The Administrator
      const salt = await bcrypt.genSalt(10);
      const password_hashed = await bcrypt.hash(password, salt);

      // Creating A Administrator According To The Data Provided
      let administrator = await Administrator.create({
        username: username,
        email_id: email_id,
        mobile_number: mobile_number,
        password: password_hashed,
        administrator_image: {
          public_id: "",
          image_url: "",
        },
        status: "inactive",
      });

      // Signing The Json Web Token For Creating Authentication Token
      const jwt_data = { administrator: { id: administrator.id } };
      const administrator_authentication_token = jwt.sign(
        jwt_data,
        JWT_SECRET_KEY
      );

      if (administrator) {
        let administrator_email_verification = await email_verification(
          administrator.username,
          administrator.email_id,
          administrator_authentication_token,
          administrator
        );

        if (administrator_email_verification == 1) {
          res.status(200).send({
            result: {
              success: `Successfully sent the administrator verification email at ${administrator.email_id}`,
            },
          });
        } else {
          res.status(500).send({
            result: {
              error:
                "Failed to send the administrator verification email. Please try again later",
            },
          });
        }
      } else {
        res.status(500).send({
          result: {
            error:
              "Failed to create the administrator account. Please try again later",
          },
        });
      }
    } catch (error) {
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  }
);

// ROUTE 2: Logging In A Administrator | Method: POST | Endpoint: /api/administrator/login
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
      return res.status(400).json({ result: { errors: errors.array() } });
    }

    try {
      // Fetching Identifier And Password From The Body Of Request
      const { identifier, password } = req.body;

      // Verification Of The Fetched Identifier
      let administrator;

      if (typeof identifier == "number") {
        administrator = await Administrator.findOne({
          mobile_number: identifier,
        });
      } else {
        administrator = await Administrator.findOne({
          username: identifier,
        });
      }

      if (!administrator || administrator.status == "inactive") {
        return res.status(400).json({
          result: { error: "Please try to login using valid credentials" },
        });
      }

      // Verification Of The Fetched Password
      const compare_password = await bcrypt.compare(
        password,
        administrator.password
      );

      if (!compare_password) {
        return res.status(400).json({
          result: { error: "Please try to login using valid credentials" },
        });
      }

      // Signing The Json Web Token For Creating Authentication Token
      const jwt_data = { administrator: { id: administrator.id } };
      const administrator_authentication_token = jwt.sign(
        jwt_data,
        JWT_SECRET_KEY
      );

      res.json({
        result: {
          success: "The administrator has logged in successfully",
        },
        administrator_authentication_token: administrator_authentication_token,
      });
    } catch (error) {
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  }
);

// ROUTE 3: Fetch The Details Of The Administrator Using Authentication Token  | Method: POST | Endpoint: /api/authentication/administrator_details/authentication_token
router.post(
  "/administrator_details/authentication_token",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        const administrator_id = req.administrator_data.administrator_id;
        const administrator_details = await Administrator.findById(
          administrator_id
        ).select("-password");

        if (!administrator_details) {
          return res.status(404).send({
            result: { error: "The administrator with this ID was not found" },
          });
        }

        res.send({
          result: {
            success: "The administrator details have been fetched successfully",
          },
          administrator_details: administrator_details,
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

// ROUTE 4: Fetch The Details Of The Administrator Using Administrator Id  | Method: POST | Endpoint: /api/authentication/administrator_details/administrator_id
router.post(
  "/administrator_details/administrator_id/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        const administrator_id = req.params.id;
        const administrator_details = await Administrator.findById(
          administrator_id
        ).select("-password");

        if (!administrator_details) {
          return res.status(404).send({
            result: { error: "The administrator with this ID was not found" },
          });
        }

        res.send({
          result: {
            success: "The administrator details have been fetched successfully",
          },
          administrator_details: administrator_details,
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

// ROUTE 5: Updating A Administrator Using Authentication Token | Method: PUT | Endpoint: /api/administrator/update_administrator
router.put(
  "/update_administrator/",
  administrator_details,
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ result: { errors: errors.array() } });
    }

    if (req.administrator_data.administrator_authenticity) {
      try {
        // Validating The Administrator For Updation
        let update_administrator = await Administrator.findById(
          req.administrator_data.administrator_id
        );

        if (!update_administrator) {
          return res.status(404).send({
            result: { error: "The administrator with this ID was not found" },
          });
        }

        // Fetching Administrator Details From The Body Of Request
        let { username, email_id, mobile_number, administrator_image } =
          req.body;

        let cloud;
        if (administrator_image) {
          if (update_administrator.administrator_image.public_id) {
            const delete_image = await cloudinary.v2.uploader.destroy(
              update_administrator.administrator_image.public_id
            );

            if (delete_image) {
              cloud = await cloudinary.v2.uploader.upload(
                req.body.administrator_image,
                {
                  folder: "administrator",
                  width: 150,
                  crop: "scale",
                }
              );
            }
          } else {
            cloud = await cloudinary.v2.uploader.upload(
              req.body.administrator_image,
              {
                folder: "administrator",
                width: 150,
                crop: "scale",
              }
            );
          }
        }

        // Creating A Administrator For Updation
        const administrator = {};
        if (username) {
          administrator.username = username;
        }
        if (email_id) {
          administrator.email_id = email_id;
        }
        if (mobile_number) {
          administrator.mobile_number = mobile_number;
        }
        if (cloud) {
          administrator.administrator_image = {
            public_id: cloud.public_id,
            image_url: cloud.secure_url,
          };
        }

        if (update_administrator.email_id != email_id) {
          administrator.status = "inactive";

          email_verification(
            update_administrator.username,
            update_administrator.email_id,
            req.get("administrator_authentication_token"),
            administrator
          );
        }

        // Updating The Administrator
        update_administrator = await Administrator.findByIdAndUpdate(
          req.administrator_data.administrator_id,
          { $set: administrator },
          { new: true }
        );
        res.json({
          result: {
            success: "The administrator details has been updated successfully",
          },
          update_administrator: update_administrator,
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

// ROUTE 6: Deleting A Administrator | Method: DELETE | Endpoint: /api/administrator/delete_administrator
router.delete(
  "/delete_administrator/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        // Validating The Administrator For Deletion
        let delete_administrator = await Administrator.findById(req.params.id);

        if (!delete_administrator) {
          return res.status(404).send({
            result: { error: "The administrator with this ID was not found" },
          });
        }

        const cloud = await cloudinary.v2.uploader.destroy(
          delete_administrator.administrator_image.public_id
        );

        // Deleting The Administrator
        delete_administrator = await Administrator.findByIdAndDelete(
          req.params.id
        );

        if (delete_administrator) {
          res.status(200).json({
            result: {
              success: "The administrator has been deleted successfully",
            },
            delete_administrator: delete_administrator,
          });
        } else {
          res.status(500).json({
            result: {
              error: "Failed to deleted administrator",
            },
          });
        }
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

// ROUTE 7: Fetching All Administrators | Method: GET | Endpoint: /api/administrator/fetch_administrator
router.get("/fetch_administrator", administrator_details, async (req, res) => {
  if (req.administrator_data.administrator_authenticity) {
    try {
      let administrator = await Administrator.find({}).select("-password");

      if (administrator) {
        return res.status(200).json({
          result: {
            success: "The administrator have been fetched successfully",
          },
          administrator,
        });
      } else {
        return res.status(400).json({
          result: {
            error: "There is some problem while fetching the administrator",
          },
        });
      }
    } catch (error) {
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  } else {
    res.status(401).send({
      result: { error: "Your Access Has Been Denied - Unauthorized Access" },
    });
  }
});

// ROUTE 8: Updating Status Of Administrator Using Authentication Token | Method: PUT | Endpoint: /api/administrator/update_administrator_status/authentication_token
router.put(
  "/update_administrator_status/authentication_token",
  administrator_details,
  async (req, res) => {
    try {
      // Fetching Administrator Id From Authentication Token
      let administrator_id = req.administrator_data.administrator_id;

      // Validating The Administrator For Updation
      let find_administrator = await Administrator.findById(administrator_id);

      if (!find_administrator) {
        return res.status(404).send({
          result: { error: "The administrator with this ID was not found" },
        });
      }

      // Creating A Administrator For Updation
      const administrator = {};
      if (req.body.status) {
        administrator.status = req.body.status;
      }

      // Updating The Administrator According To The Data Provided
      let update_administrator_status = await Administrator.findByIdAndUpdate(
        administrator_id,
        { $set: administrator },
        { new: true }
      );
      res.json({
        result: {
          success: "The administrator status has been updated successfully",
        },
        update_administrator_status: update_administrator_status,
      });
    } catch (error) {
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  }
);

// ROUTE 9: Updating Status Of Administrator Using Administrator Id | Method: PUT | Endpoint: /api/administrator/update_administrator_status/administrator_id
router.put(
  "/update_administrator_status/administrator_id/:id",
  async (req, res) => {
    try {
      // Fetching Administrator Id
      let administrator_id = req.params.id;

      // Validating The Administrator For Updation
      let find_administrator = await Administrator.findById(administrator_id);

      if (!find_administrator) {
        return res.status(404).send({
          result: { error: "The administrator with this ID was not found" },
        });
      }

      // Creating A Administrator For Updation
      const administrator = {};
      if (req.body.status) {
        administrator.status = req.body.status;
      }

      // Updating The Administrator According To The Data Provided
      let update_administrator_status = await Administrator.findByIdAndUpdate(
        administrator_id,
        { $set: administrator },
        { new: true }
      );
      res.json({
        result: {
          success: "The administrator status has been updated successfully",
        },
        update_administrator_status: update_administrator_status,
      });
    } catch (error) {
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  }
);

// ROUTE 10: Changing Password Of Administrator | Method: PUT | Endpoint: /api/administrator/change_password
router.put(
  "/change_password/",
  administrator_details,
  [
    body(
      "old_password",
      "Please enter a valid old password of minimum length 8 characters"
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

    if (req.administrator_data.administrator_authenticity) {
      try {
        // Retrieving Password Details From The Body Of Request
        let { old_password, new_password } = req.body;

        //Generating Salt And Hashing The Password Received
        const salt = await bcrypt.genSalt(10);
        const new_password_hashed = await bcrypt.hash(new_password, salt);

        // Validating The Administrator For Changing Password
        let find_administrator = await Administrator.findById(
          req.administrator_data.administrator_id
        );

        if (!find_administrator) {
          return res.status(404).send({
            result: { error: "The administrator with this ID was not found" },
          });
        }

        // Verification Of The Retrieved Old Password
        const compare_password = await bcrypt.compare(
          old_password,
          find_administrator.password
        );

        if (!compare_password) {
          return res.status(404).send({
            result: { error: "Please enter correct password" },
          });
        }

        // Creating A Administrator For Updation
        let update_administrator = {};
        if (new_password_hashed) {
          update_administrator.password = new_password_hashed;
        }

        // Updating The Administrator According To The Data Provided
        let administrator = await Administrator.findByIdAndUpdate(
          req.administrator_data.administrator_id,
          { $set: update_administrator },
          { new: true }
        );
        res.json({
          result: { success: "successfully updated the password" },
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

// ROUTE 11: Fetching Administrator Count Based On Month | Method: Get | Endpoint: /api/administrator/administrator_count
router.get("/administrator_count", administrator_details, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ result: { errors: errors.array() } });
  }

  if (req.administrator_data.administrator_authenticity) {
    try {
      let months = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12];
      let result = [];

      for (let index = 0; index < months.length; index++) {
        let administrator_count = await Administrator.find({
          time_stamp: {
            $gt: new Date(`2022-${months[index]}-01`),
            $lt: new Date(`2022-${months[index]}-31`),
          },
        }).count();
        result.push(administrator_count);
      }

      if (result) {
        return res.status(200).send({
          result: { result },
        });
      } else {
        return res.status(400).json({
          result: {
            error:
              "There is some problem while fetching the administrator count",
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

// ROUTE 12: Forgot Password Mail | Method: POST | Endpoint: /api/administrator/forgot_password/mail
router.post(
  "/forgot_password/mail",
  [body("email_id", "Please enter a valid email id").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ result: { errors: errors.array() } });
    }

    try {
      // Fetching administrator information from the body of request
      let { email_id } = req.body;

      let find_administrator = await Administrator.find({
        email_id: email_id,
      });

      if (find_administrator.length == 0) {
        return res.status(400).json({
          result: {
            error: "The administrator with this email id was not found",
          },
        });
      }

      // Signing The Json Web Token For Creating Authentication Token
      const jwt_data = { administrator: { id: find_administrator[0]._id } };
      const administrator_authentication_token = jwt.sign(
        jwt_data,
        JWT_SECRET_KEY
      );

      let mail = forgot_password_mail(
        find_administrator[0].email_id,
        find_administrator[0].username,
        administrator_authentication_token
      );

      if (mail) {
        res.status(200).send({
          result: {
            success: `Successfully sent the forgot passoword email at ${find_administrator[0].email_id}`,
          },
        });
      } else {
        res.status(500).send({
          result: {
            error: "Failed to send the forgot passoword email",
          },
        });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ result: { error: "Internal Server Error" } });
    }
  }
);

// ROUTE 13: Forgot Password | Method: PUT | Endpoint: /api/administrator/forgot_password
router.put(
  "/forgot_password",
  administrator_details,
  [
    body("password", "Please enter a valid password").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ result: { errors: errors.array() } });
    }

    if (req.administrator_data.administrator_authenticity) {
      try {
        // Validating The Administrator For Updation
        let find_administrator = await Administrator.findById(
          req.administrator_data.administrator_id
        );

        if (!find_administrator) {
          return res.status(404).send({
            result: { error: "The administrator with this ID was not found" },
          });
        }

        // Fetching Administrator Details From The Body Of Request
        let { password } = req.body;

        //Generating Salt And Hashing The Password Received
        const salt = await bcrypt.genSalt(10);
        const password_hashed = await bcrypt.hash(password, salt);

        // Creating A Administrator For Updation
        const administrator = {
          password: password_hashed,
        };

        // Updating The Administrator
        let forgot_password = await Administrator.findByIdAndUpdate(
          req.administrator_data.administrator_id,
          { $set: administrator },
          { new: true }
        );
        res.json({
          result: {
            success: "The password has been changed successfully",
          },
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
