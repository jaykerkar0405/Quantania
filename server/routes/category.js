const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { body, validationResult } = require("express-validator");
const administrator_details = require("../middleware/administrator_details");
const customer_details = require("../middleware/customer_details");
const cloudinary = require("cloudinary");

// ROUTE 1: Creating A Category Entry | Method: POST | Endpoint: /api/category/add_category
router.post(
  "/add_category",
  administrator_details,
  [
    body(
      "category_name",
      "Please enter a valid category name of minimum length 5 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.administrator_data.administrator_authenticity) {
      try {
        let category = await Category.findOne({
          category_name: req.body.category_name,
        });

        if (category) {
          return res.status(400).json({
            result: {
              error: "The category with same name already exists",
            },
          });
        }

        const cloud = await cloudinary.v2.uploader.upload(
          req.body.category_image,
          {
            folder: "category",
            width: 150,
            crop: "scale",
          }
        );

        // Creating A Category Entry According To The Data Provided
        category = await Category.create({
          category_name: req.body.category_name,
          category_image: {
            public_id: cloud.public_id,
            image_url: cloud.secure_url,
          },
          category_registrar: req.administrator_data.administrator_id,
          category_status: "active",
        });

        res.status(200).send({
          result: {
            success: "The category has been added successfully",
          },
          category_details: category,
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

// ROUTE 2: Fetching All Category | Method: Get | Endpoint: /api/category/fetch_category/administrator
router.get(
  "/fetch_category/administrator",
  administrator_details,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.administrator_data.administrator_authenticity) {
      try {
        let category = await Category.find({});
        if (category) {
          return res.status(200).send({
            result: {
              success: "The category has been fetched successfully",
            },
            category: category,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "Failed to fetch category",
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

// ROUTE 3: Updating Category | Method: PUT | Endpoint: /api/category/update_category
router.put(
  "/update_category/:id",
  administrator_details,
  [
    body(
      "category_name",
      "Please enter a valid category name of minimum length 5 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.administrator_data.administrator_authenticity) {
      try {
        // Retrieving Data From The Body Of Request
        const { category_name, category_status } = req.body;

        // Creating A Category For Updation According To The Data Provided By The Admin
        const category = {};
        if (category_name) {
          category.category_name = category_name;
        }
        if (category_status) {
          category.category_status = category_status;
        }
        if (req.administrator_data.administrator_id) {
          category.category_updater = req.administrator_data.administrator_id;
        }

        if (category_status == "inactive") {
          await Product.updateMany(
            {
              product_category: {
                category_id: req.params.id,
                category_name: category_name,
              },
            },
            {
              $set: { status: "inactive" },
            }
          );
        }

        if (category_status == "active") {
          await Product.updateMany(
            {
              product_category: {
                category_id: req.params.id,
                category_name: category_name,
              },
            },
            {
              $set: { status: "active" },
            }
          );
        }

        // Validating The Category For Updation
        let update_category = await Category.findById(req.params.id);
        if (!update_category) {
          return res.status(404).send({
            result: { error: "The category with this ID was not found" },
          });
        }

        let cloud;
        if (req.body.category_image) {
          const delete_image = await cloudinary.v2.uploader.destroy(
            update_category.category_image.public_id
          );

          if (delete_image) {
            cloud = await cloudinary.v2.uploader.upload(
              req.body.category_image,
              {
                folder: "category",
                width: 150,
                crop: "scale",
              }
            );

            category.category_image = {
              public_id: cloud.public_id,
              image_url: cloud.secure_url,
            };
          }
        } else {
          category.category_image = {
            public_id: update_category.category_image.public_id,
            image_url: update_category.category_image.image_url,
          };
        }

        update_category = await Category.findByIdAndUpdate(
          req.params.id,
          { $set: category },
          { new: true }
        );
        res.json({
          result: {
            success: "The category has been updated successfully",
          },
          category_details: update_category,
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

// ROUTE 4: Deleting Category | Method: DELETE | Endpoint: /api/category/delete_category
router.delete(
  "/delete_category/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        // Validating The Category For Deletion
        let delete_category = await Category.findById(req.params.id);

        if (!delete_category) {
          return res.status(404).send({
            result: { error: "The category with this ID was not found" },
          });
        }

        await Product.deleteMany({
          product_category: {
            category_id: req.params.id,
            category_name: delete_category.category_name,
          },
        });

        const cloud = await cloudinary.v2.uploader.destroy(
          delete_category.category_image.public_id
        );

        // Deleting The Category As Per The Request Provided By Admin
        delete_category = await Category.findByIdAndDelete(req.params.id);
        res.json({
          result: {
            success: "The category has been deleted successfully",
          },
          delete_category: delete_category,
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

// ROUTE 5: Fetching Category Based On Id | Method: Get | Endpoint: /api/category/category_details
router.get("/category_details/:id", administrator_details, async (req, res) => {
  if (req.administrator_data.administrator_authenticity) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let fetch_category_details = await Category.findById({
        _id: req.params.id,
      });

      if (fetch_category_details) {
        res.status(200).send({
          result: { success: "The category has been fetched successfully" },
          category_details: fetch_category_details,
        });
      } else {
        return res.status(400).send({
          result: {
            error: "Failed to fetch the category",
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

// ROUTE 6: Fetching Recent Category | Method: Get | Endpoint: /api/category/recent_category
router.get("/recent_category", administrator_details, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ result: { errors: errors.array() } });
  }

  if (req.administrator_data.administrator_authenticity) {
    try {
      let recent_category = await Category.find().sort({ _id: -1 }).limit(5);

      if (recent_category) {
        return res.status(200).send({
          recent_category,
        });
      } else {
        return res.status(400).json({
          result: {
            error: "There is some problem while fetching the recent category",
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

// ROUTE 7: Fetching All Products Based On Category - Administrator Level | Method: Get | Endpoint: /api/category/category_product/administrator
router.get(
  "/category_product/administrator/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        let category_product = await Product.find({
          "product_category.category_id": req.params.id,
        });
        if (category_product) {
          return res.status(200).send({
            result: {
              success: "The product has been fetched successfully",
            },
            category_product: category_product,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "Failed to fetch product",
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

// ROUTE 8: Fetching All Categories - Customer Level | Method: Get | Endpoint: /api/category/fetch_category/customer
router.get("/fetch_category/customer", customer_details, async (req, res) => {
  if (req.customer_data.customer_authenticity) {
    try {
      if (req.query.limit) {
        let category = await Category.find({ category_status: "active" }).limit(
          req.query.limit
        );

        if (category) {
          return res.status(200).send({
            result: {
              success: "The category has been fetched successfully",
            },
            category: category,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "Failed to fetch category",
            },
          });
        }
      } else if (req.query.page) {
        const result_per_page = 12;
        const page = req.query.page;

        const skip_category = result_per_page * (page - 1);

        let category = await Category.find({ category_status: "active" })
          .limit(result_per_page)
          .skip(skip_category);

        let total_result = await Category.find({
          category_status: "active",
        }).count();

        if (category) {
          return res.status(200).send({
            result: {
              success: "The category has been fetched successfully",
            },
            category: category,
            total_result: total_result,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "Failed to fetch category",
            },
          });
        }
      } else {
        let category = await Category.find({ category_status: "active" });

        if (category) {
          return res.status(200).send({
            result: {
              success: "The category has been fetched successfully",
            },
            category: category,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "Failed to fetch category",
            },
          });
        }
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

// ROUTE 9: Fetching New Arrival Category | Method: Get | Endpoint: /api/category/newly_added
router.get("/newly_added", customer_details, async (req, res) => {
  if (req.customer_data.customer_authenticity) {
    try {
      const result_per_page = 12;
      const page = req.query.page || 1;

      const skip_category = result_per_page * (page - 1);

      let newly_added = await Category.find({ category_status: "active" })
        .limit(result_per_page)
        .skip(skip_category)
        .sort({ _id: -1 });
      let total_result = await Category.find({ category_status: "active" })
        .sort({ _id: -1 })
        .count();

      if (newly_added) {
        return res.status(200).send({
          result: {
            success: "The newly added category has been fetched successfully",
          },
          newly_added: newly_added,
          total_result: total_result,
        });
      } else {
        return res.status(400).json({
          result: {
            error:
              "There is some problem while fetching the newly added product",
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
});

// ROUTE 10: Fetching All Products Based On Category | Method: Get | Endpoint: /api/category/category_product/customer
router.get(
  "/category_product/customer/:id",
  customer_details,
  async (req, res) => {
    if (req.customer_data.customer_authenticity) {
      try {
        if (req.query.page) {
          const result_per_page = 12;
          const page = req.query.page;

          const skip_product = result_per_page * (page - 1);

          let category_product = await Product.find({
            "product_category.category_id": req.params.id,
          })
            .limit(result_per_page)
            .skip(skip_product);

          let total_result = await Product.find({
            "product_category.category_id": req.params.id,
          }).count();

          if (category_product) {
            return res.status(200).send({
              result: {
                success: "The product has been fetched successfully",
              },
              category_product: category_product,
              total_result: total_result,
            });
          } else {
            return res.status(400).json({
              result: {
                error: "Failed to fetch product",
              },
            });
          }
        }
      } catch (error) {
        console.log(error.message);
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
