const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { body, validationResult } = require("express-validator");
const administrator_details = require("../middleware/administrator_details");
const customer_details = require("../middleware/customer_details");
const dotenv = require("dotenv").config();
const cloudinary = require("cloudinary");

// ROUTE 1: Creating A Product Entry | Method: POST | Endpoint: /api/product/add_product
router.post(
  "/add_product",
  [
    body(
      "product_name",
      "Please enter a valid product name of minimum length 5 characters"
    ).isLength({ min: 5 }),
    body(
      "product_mrp",
      "Please enter a valid product mrp of minimum 2 digits"
    ).isLength({ min: 2 }),
    body(
      "product_price",
      "Please enter a valid product price of minimum 2 digits"
    ).isLength({ min: 2 }),
    body(
      "product_details",
      "Please enter valid product details of minimum length 20 characters"
    ).isLength({
      min: 20,
    }),
  ],
  administrator_details,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ result: { errors: errors.array() } });
    }

    if (req.administrator_data.administrator_authenticity) {
      try {
        let add_product = await Product.findOne({
          product_name: req.body.product_name,
        });

        if (add_product) {
          return res.status(400).json({
            result: {
              error: "The product with same name already exists",
            },
          });
        }

        const cloud = await cloudinary.v2.uploader.upload(
          req.body.product_image,
          {
            folder: "product",
            width: 150,
            crop: "scale",
          }
        );

        //Creating Product Entry According To The Data Provided
        add_product = await Product.create({
          product_name: req.body.product_name,
          product_category: req.body.product_category,
          product_details: req.body.product_details,
          product_mrp: req.body.product_mrp,
          product_price: req.body.product_price,
          product_developer: req.body.product_developer,
          product_registrar: req.administrator_data.administrator_id,
          product_image: {
            public_id: cloud.public_id,
            image_url: cloud.secure_url,
          },
          featured_product: false,
          download_link: req.body.download_link,
          status: "active",
        });
        res.status(200).send({
          result: { success: "The product has been added successfully" },
          add_product: add_product,
        });
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
  }
);

// ROUTE 2: Fetching All Products - Administrator Level | Method: Get | Endpoint: /api/product/fetch_product/administrator
router.get(
  "/fetch_product/administrator",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        let fetch_product = await Product.find({});
        if (fetch_product) {
          return res.status(200).send({
            result: { success: "The product has been fetched successfully" },
            fetch_product: fetch_product,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "There is some problem while fetching the product",
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

// ROUTE 3: Updating Product | Method: PUT | Endpoint: /api/product/update_product
router.put(
  "/update_product/:id",
  [
    body(
      "product_name",
      "Please enter a valid product name of minimum length 5 characters"
    ).isLength({ min: 5 }),
    body(
      "product_mrp",
      "Please enter a valid product mrp of minimum 2 digits"
    ).isLength({ min: 2 }),
    body(
      "product_price",
      "Please enter a valid product mrp of minimum 2 digits"
    ).isLength({ min: 2 }),
    body(
      "product_details",
      "Please enter valid product details of minimum length 20 characters"
    ).isLength({
      min: 20,
    }),
  ],
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ result: { errors: errors.array() } });
        }

        // Validating The Product For Updation
        let update_product;
        update_product = await Product.findById(req.params.id);
        if (!update_product) {
          return res.status(404).send({
            result: {
              error: "The product with this ID was not found",
            },
          });
        }

        let cloud;
        if (req.body.product_image) {
          const delete_image = await cloudinary.v2.uploader.destroy(
            update_product.product_image.public_id
          );

          if (delete_image) {
            cloud = await cloudinary.v2.uploader.upload(
              req.body.product_image,
              {
                folder: "product",
                width: 150,
                crop: "scale",
              }
            );
          }
        }

        // Creating A Product For Updation According To The Data Provided
        let product = {
          product_name: req.body.product_name,
          product_category: req.body.product_category,
          product_details: req.body.product_details,
          product_mrp: req.body.product_mrp,
          product_price: req.body.product_price,
          product_developer: req.body.product_developer,
          product_updater: req.administrator_data.administrator_id,
          product_image: req.body.product_image
            ? {
                public_id: cloud.public_id,
                image_url: cloud.secure_url,
              }
            : {
                public_id: update_product.product_image.public_id,
                image_url: update_product.product_image.image_url,
              },
          status: req.body.status,
        };

        update_product = await Product.findByIdAndUpdate(
          req.params.id,
          { $set: product },
          { new: true }
        );
        res.json({
          result: {
            success: "The requested product has been updated successfully",
          },
          update_product: update_product,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({
          result: {
            error: "Internal Server Error",
          },
        });
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

// ROUTE 4: Deleting Product | Method: DELETE | Endpoint: /api/product/delete_product
router.delete(
  "/delete_product/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        // Validating The Product For Deletion
        let delete_product = await Product.findById(req.params.id);
        if (!delete_product) {
          return res.status(404).send({
            result: {
              error: "The product with this ID was not found",
            },
          });
        }

        const cloud = await cloudinary.v2.uploader.destroy(
          delete_product.product_image.public_id
        );

        // Deleting The Product As Per The Request Provided By Admin
        delete_product = await Product.findByIdAndDelete(req.params.id);
        res.json({
          result: {
            success: "The requested product has been deleted successfully",
          },
          delete_product: delete_product,
        });
      } catch (error) {
        res.status(500).send({
          result: {
            error: "Internal Server Error",
          },
        });
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

// ROUTE 5: Fetching Product Based On Id | Method: POST | Endpoint: /api/product/product_details/administrator
router.post(
  "/product_details/administrator",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        let product_details = await Product.find({
          _id: { $in: [req.body.product_id] },
        });
        if (product_details) {
          return res.status(200).send({
            result: { success: "The product has been fetched successfully" },
            product_details: product_details,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "There is some problem while fetching the product",
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

// ROUTE 6: Fetching Product Count Based On Month | Method: Get | Endpoint: /api/product/product_count
router.get("/product_count", administrator_details, async (req, res) => {
  if (req.administrator_data.administrator_authenticity) {
    try {
      let months = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12];
      let result = [];

      for (let index = 0; index < months.length; index++) {
        let product_count = await Product.find({
          time_stamp: {
            $gt: new Date(`2022-${months[index]}-01`),
            $lt: new Date(`2022-${months[index]}-31`),
          },
        }).count();
        result.push(product_count);
      }

      if (result) {
        return res.status(200).send({
          result: { result },
        });
      } else {
        return res.status(400).json({
          result: {
            error: "There is some problem while fetching the product count",
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

// ROUTE 6: Fetching Recent Product | Method: Get | Endpoint: /api/product/recent_product
router.get("/recent_product", administrator_details, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ result: { errors: errors.array() } });
  }

  if (req.administrator_data.administrator_authenticity) {
    try {
      let recent_product = await Product.find().sort({ _id: -1 }).limit(5);

      if (recent_product) {
        return res.status(200).send({
          recent_product,
        });
      } else {
        return res.status(400).json({
          result: {
            error: "There is some problem while fetching the recent product",
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

// ROUTE 7: Updating Featured Product | Method: PUT | Endpoint: /api/product/update_featured_product
router.put(
  "/update_featured_product/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ result: { errors: errors.array() } });
        }

        // Validating The Product For Updation
        let update_featured_product;
        update_featured_product = await Product.findById(req.params.id);
        if (!update_featured_product) {
          return res.status(404).send({
            result: {
              error: "The product with this ID was not found",
            },
          });
        }

        // Creating A Product For Updation According To The Data Provided
        let product = {
          featured_product: req.body.featured_product,
        };

        update_featured_product = await Product.findByIdAndUpdate(
          req.params.id,
          { $set: product },
          { new: true }
        );
        res.json({
          result: {
            success: "The requested product has been updated successfully",
          },
          update_featured_product: update_featured_product,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({
          result: {
            error: "Internal Server Error",
          },
        });
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

// ROUTE 8: Fetching All Featured Product - Administrator Level| Method: Get | Endpoint: /api/product/fetch_featured_product/administrator
router.get(
  "/fetch_featured_product/administrator",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        let featured_product = await Product.find({
          featured_product: true,
        });
        if (featured_product) {
          return res.status(200).send({
            result: {
              success: "The featured product has been fetched successfully",
            },
            featured_product: featured_product,
          });
        } else {
          return res.status(400).json({
            result: {
              error:
                "There is some problem while fetching the featured product",
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

// ROUTE 9: Fetching New Arrival Products | Method: Get | Endpoint: /api/product/fetch_new_arrivals
router.get("/fetch_new_arrivals", customer_details, async (req, res) => {
  if (req.customer_data.customer_authenticity) {
    try {
      if (req.query.limit) {
        let limit = req.query.limit || 1;
        let fetch_new_arrivals = await Product.find({ status: "active" })
          .sort({ _id: -1 })
          .limit(limit);

        if (fetch_new_arrivals) {
          return res.status(200).send({
            result: {
              success: "The new arrival product has been fetched successfully",
            },
            new_arrivals: fetch_new_arrivals,
          });
        } else {
          return res.status(400).json({
            result: {
              error:
                "There is some problem while fetching the new arrival product",
            },
          });
        }
      } else if (req.query.page) {
        const result_per_page = 12;
        const page = req.query.page;

        const skip_product = result_per_page * (page - 1);

        let fetch_new_arrivals = await Product.find({ status: "active" })
          .limit(result_per_page)
          .skip(skip_product)
          .sort({ _id: -1 });

        let total_result = await Product.find({ status: "active" }).count();

        if (fetch_new_arrivals) {
          return res.status(200).send({
            result: {
              success: "The new arrival product has been fetched successfully",
            },
            new_arrivals: fetch_new_arrivals,
            total_result: total_result,
          });
        } else {
          return res.status(400).json({
            result: {
              error:
                "There is some problem while fetching the new arrival product",
            },
          });
        }
      } else {
        let limit = req.query.limit || 1;
        let fetch_new_arrivals = await Product.find({ status: "active" })
          .sort({ _id: -1 })
          .limit(limit);

        if (fetch_new_arrivals) {
          return res.status(200).send({
            result: {
              success: "The new arrival product has been fetched successfully",
            },
            new_arrivals: fetch_new_arrivals,
          });
        } else {
          return res.status(400).json({
            result: {
              error:
                "There is some problem while fetching the new arrival product",
            },
          });
        }
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

// ROUTE 10: Fetching All Featured Product - Customer Level | Method: Get | Endpoint: /api/product/fetch_featured_product/customer
router.get(
  "/fetch_featured_product/customer",
  customer_details,
  async (req, res) => {
    if (req.customer_data.customer_authenticity) {
      try {
        if (req.query.limit) {
          let limit = req.query.limit || 1;

          let featured_product = await Product.find({
            featured_product: true,
            status: "active",
          }).limit(limit);

          if (featured_product) {
            return res.status(200).send({
              result: {
                success: "The featured product has been fetched successfully",
              },
              featured_product: featured_product,
            });
          } else {
            return res.status(400).json({
              result: {
                error:
                  "There is some problem while fetching the featured product",
              },
            });
          }
        } else {
          const result_per_page = 12;
          const page = req.query.page;
          const skip_product = result_per_page * (page - 1);

          let featured_product = await Product.find({
            featured_product: true,
            status: "active",
          })
            .limit(result_per_page)
            .skip(skip_product);

          let total_result = await Product.find({
            featured_product: true,
            status: "active",
          }).count();

          if (featured_product) {
            return res.status(200).send({
              result: {
                success: "The featured product has been fetched successfully",
              },
              featured_product: featured_product,
              total_result: total_result,
            });
          } else {
            return res.status(400).json({
              result: {
                error:
                  "There is some problem while fetching the featured product",
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
        result: {
          error: "Your Access Has Been Denied - Unauthorized Access",
        },
      });
    }
  }
);

// ROUTE 11: Fetching All Products - Customer Level | Method: Get | Endpoint: /api/product/fetch_product/customer
router.get("/fetch_product/customer", customer_details, async (req, res) => {
  if (req.customer_data.customer_authenticity) {
    try {
      if (req.query.limit) {
        let fetch_product = await Product.find({ status: "active" }).limit(
          req.query.limit
        );
        if (fetch_product) {
          return res.status(200).send({
            result: { success: "The product has been fetched successfully" },
            product: fetch_product,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "There is some problem while fetching the product",
            },
          });
        }
      } else if (req.query.keyword) {
        const result_per_page = 12;
        const page = req.query.page;
        const skip_product = result_per_page * (page - 1);

        const keyword = {
          product_name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        };

        let fetch_product = await Product.find({ ...keyword, status: "active" })
          .limit(result_per_page)
          .skip(skip_product);

        let total_result = await Product.find({
          ...keyword,
          status: "active",
        }).count();

        if (fetch_product) {
          return res.status(200).send({
            result: { success: "The product has been fetched successfully" },
            product: fetch_product,
            total_result: total_result,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "There is some problem while fetching the product",
            },
          });
        }
      } else {
        const result_per_page = 12;
        const page = req.query.page;
        const skip_product = result_per_page * (page - 1);

        let fetch_product = await Product.find({ status: "active" })
          .limit(result_per_page)
          .skip(skip_product);

        let total_result = await Product.find({ status: "active" }).count();

        if (fetch_product) {
          return res.status(200).send({
            result: { success: "The product has been fetched successfully" },
            product: fetch_product,
            total_result: total_result,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "There is some problem while fetching the product",
            },
          });
        }
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

// ROUTE 12: Fetching Product Based On Id - Customer Level| Method: GET | Endpoint: /api/product/product_details/customer
router.get(
  "/product_details/customer/:id",
  customer_details,
  async (req, res) => {
    if (req.customer_data.customer_authenticity) {
      try {
        let product_details = await Product.findById(req.params.id);
        if (product_details) {
          return res.status(200).send({
            result: { success: "The product has been fetched successfully" },
            product_details: product_details,
          });
        } else {
          return res.status(400).json({
            result: {
              error: "There is some problem while fetching the product",
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

module.exports = router;
