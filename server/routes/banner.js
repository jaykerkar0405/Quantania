const express = require("express");
const router = express.Router();
const Banner = require("../models/Banner");
const { body, validationResult } = require("express-validator");
const administrator_details = require("../middleware/administrator_details");
const customer_details = require("../middleware/customer_details");
const cloudinary = require("cloudinary");

// ROUTE 1: Creating A Banner Entry | Method: POST | Endpoint: /api/banner/add_banner
router.post(
  "/add_banner",
  administrator_details,
  [
    body(
      "banner_title",
      "Please enter a valid banner title of minimum length 5 characters"
    ).isLength({ min: 5 }),
    body(
      "button_text",
      "Please enter a valid button text of minimum length 4 characters"
    ).isLength({ min: 4 }),
    body(
      "button_link",
      "Please enter a valid button link of minimum length 20 characters"
    ).isLength({ min: 20 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.administrator_data.administrator_authenticity) {
      try {
        let banner = await Banner.findOne({
          banner_title: req.body.banner_title,
        });

        if (banner) {
          return res.status(400).json({
            result: {
              error: "The banner with same title already exists",
            },
          });
        }

        const cloud = await cloudinary.v2.uploader.upload(
          req.body.banner_image,
          {
            folder: "banner",
            width: 150,
            crop: "scale",
          }
        );

        // Creating A banner Entry According To The Data Provided
        banner = await Banner.create({
          banner_title: req.body.banner_title,
          banner_image: {
            public_id: cloud.public_id,
            image_url: cloud.secure_url,
          },
          button_text: req.body.button_text,
          button_link: req.body.button_link,
          banner_registrar: req.administrator_data.administrator_id,
          banner_status: "active",
        });

        res.status(200).send({
          result: {
            success: "The banner has been added successfully",
          },
          add_banner: banner,
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

// ROUTE 2: Fetching All Banner - Administrator Level| Method: Get | Endpoint: /api/banner/fetch_banner/administrator
router.get(
  "/fetch_banner/administrator",
  administrator_details,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.administrator_data.administrator_authenticity) {
      try {
        let banner = await Banner.find({});
        if (banner) {
          return res.status(200).send({
            result: {
              success: "The banner has been fetched successfully",
            },
            banner: banner,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "Failed to fetch the banner",
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
  }
);

// ROUTE 3: Updating Banner | Method: PUT | Endpoint: /api/banner/update_banner
router.put(
  "/update_banner/:id",
  administrator_details,
  [
    body(
      "banner_title",
      "Please enter a valid banner title of minimum length 5 characters"
    ).isLength({ min: 5 }),
    body(
      "button_text",
      "Please enter a valid button text of minimum length 4 characters"
    ).isLength({ min: 4 }),
    body(
      "button_link",
      "Please enter a valid button link of minimum length 20 characters"
    ).isLength({ min: 20 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.administrator_data.administrator_authenticity) {
      try {
        // Retrieving Data From The Body Of Request
        const { banner_title, button_text, button_link, banner_status } =
          req.body;

        // Creating A banner For Updation According To The Data Provided By The Admin
        const banner = {};
        if (banner_title) {
          banner.banner_title = banner_title;
        }
        if (button_text) {
          banner.button_text = button_text;
        }
        if (button_link) {
          banner.button_link = button_link;
        }
        if (banner_status) {
          banner.banner_status = banner_status;
        }
        if (req.administrator_data.administrator_id) {
          banner.banner_updater = req.administrator_data.administrator_id;
        }

        // Validating The Banner For Updation
        let update_banner = await Banner.findById(req.params.id);
        if (!update_banner) {
          return res.status(404).send({
            result: { error: "The banner with this ID was not found" },
          });
        }

        let cloud;
        if (req.body.banner_image) {
          const delete_image = await cloudinary.v2.uploader.destroy(
            update_banner.banner_image.public_id
          );

          if (delete_image) {
            cloud = await cloudinary.v2.uploader.upload(req.body.banner_image, {
              folder: "banner",
              width: 150,
              crop: "scale",
            });

            banner.banner_image = {
              public_id: cloud.public_id,
              image_url: cloud.secure_url,
            };
          }
        } else {
          banner.banner_image = {
            public_id: update_banner.banner_image.public_id,
            image_url: update_banner.banner_image.image_url,
          };
        }

        update_banner = await Banner.findByIdAndUpdate(
          req.params.id,
          { $set: banner },
          { new: true }
        );
        res.json({
          result: {
            success: "The banner has been updated successfully",
          },
          update_banner: update_banner,
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

// ROUTE 4: Deleting Banner | Method: DELETE | Endpoint: /api/banner/delete_banner
router.delete("/delete_banner/:id", administrator_details, async (req, res) => {
  if (req.administrator_data.administrator_authenticity) {
    try {
      // Validating The banner For Deletion
      let delete_banner = await Banner.findById(req.params.id);

      if (!delete_banner) {
        return res.status(404).send({
          result: { error: "The banner with this ID was not found" },
        });
      }

      const cloud = await cloudinary.v2.uploader.destroy(
        delete_banner.banner_image.public_id
      );

      // Deleting The Banner As Per The Request Provided By Admin
      delete_banner = await Banner.findByIdAndDelete(req.params.id);
      res.json({
        result: {
          success: "The banner has been deleted successfully",
        },
        delete_banner: delete_banner,
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
});

// ROUTE 5: Fetching Banner Based On Id | Method: Get | Endpoint: /api/banner/banner_details
router.get("/banner_details/:id", administrator_details, async (req, res) => {
  if (req.administrator_data.administrator_authenticity) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let fetch_banner_details = await Banner.findById({
        _id: req.params.id,
      });

      if (fetch_banner_details) {
        res.status(200).send({
          result: { success: "The banner has been fetched successfully" },
          banner_details: fetch_banner_details,
        });
      } else {
        return res.status(400).send({
          result: {
            error: "Failed to fetch the banner",
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

// ROUTE 6: Fetching All Banner - Customer Level | Method: Get | Endpoint: /api/banner/fetch_banner/customer
router.get("/fetch_banner/customer", customer_details, async (req, res) => {
  if (req.customer_data.customer_authenticity) {
    try {
      let banner = await Banner.find({ banner_status: "active" });
      if (banner) {
        return res.status(200).send({
          result: {
            success: "The banner has been fetched successfully",
          },
          banner: banner,
        });
      } else {
        return res.status(400).json({
          result: {
            error: "Failed to fetch the banner",
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

module.exports = router;
