const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { findByIdAndUpdate } = require("../models/Order");
const { body, validationResult } = require("express-validator");
const customer_details = require("../middleware/customer_details");
const administrator_details = require("../middleware/administrator_details");

// ROUTE 1: Creating A Order Entry | Method: POST | Endpoint: /api/order/add_order_entry
router.post(
  "/add_order_entry",
  customer_details,
  [
    body(
      "order_price",
      "Please enter a valid order price of minimum length 2 digits"
    ).isLength({ min: 2 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.customer_data.customer_authenticity) {
      try {
        let download_link = [];

        for (let index = 0; index < req.body.product.length; index++) {
          let fetch_download_link = await Product.findById(
            req.body.product[index]
          );
          download_link.push(fetch_download_link.download_link);
        }

        //Creating A Order Entry According To The Data Provided
        let add_order_entry = await Order.create({
          customer: req.customer_data.customer_id,
          product: req.body.product,
          order_price: req.body.order_price,
          payment_information: req.body.payment_information,
          payment_status: req.body.payment_status,
          order_status: req.body.payment_status,
          download_link: download_link,
        });
        res.status(200).send({
          result: {
            success: "The order has been added successfully",
          },
          add_order_entry: add_order_entry,
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

// ROUTE 2: Fetching All Orders | Method: Get | Endpoint: /api/order/fetch_order_entry/administrator
router.get(
  "/fetch_order_entry/administrator",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        let fetch_order_entry = await Order.find({
          order_status: "inactive",
        }).select("-download_link");
        if (fetch_order_entry) {
          return res.status(200).json({
            result: {
              success: "The order has been fetched successfully",
            },
            fetch_order_entry: fetch_order_entry,
          });
        } else {
          res.status(500).json({
            result: {
              error: "There is some problem while fetching the order entry",
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

// ROUTE 3: Fetching Specific Customer Order | Method: Get | Endpoint: /api/order/fetch_order_entry/customer
router.get(
  "/fetch_order_entry/customer",
  customer_details,
  async (req, res) => {
    if (req.customer_data.customer_authenticity) {
      try {
        if (req.query.page) {
          const result_per_page = 5;
          const page = req.query.page;

          const skip_order = result_per_page * (page - 1);

          let fetch_order_entry = await Order.find({
            customer: req.customer_data.customer_id,
          })
            .limit(result_per_page)
            .skip(skip_order)
            .select("-download_link");

          let total_results = await Order.find({
            customer: req.customer_data.customer_id,
          }).count();

          if (fetch_order_entry) {
            return res.status(200).json({
              result: {
                success: "The order has been fetched successfully",
              },
              fetch_order_entry: fetch_order_entry,
              total_results: total_results,
            });
          } else {
            res.status(500).json({
              result: {
                error: "There is some problem while fetching the order entry",
              },
            });
          }
        } else {
          let fetch_order_entry = await Order.find({
            customer: req.customer_data.customer_id,
          }).select("-download_link");

          if (fetch_order_entry) {
            return res.status(200).json({
              result: {
                success: "The order has been fetched successfully",
              },
              fetch_order_entry: fetch_order_entry,
              total_results: total_results,
            });
          } else {
            res.status(500).json({
              result: {
                error: "There is some problem while fetching the order entry",
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
  }
);

// ROUTE 4: Updating Order | Method: PUT | Endpoint: /api/order/update_order_entry
router.put(
  "/update_order_entry/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        // Retrieving Data From The Body Of Request
        const { payment_status } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // Creating A Order For Updation According To The Data Provided
        const order = {};
        if (payment_status) {
          order.payment_status = payment_status;
          order.order_status = payment_status;
          order.status_updater = req.administrator_data.administrator_id;
        }

        // Validating The Order For Updation
        let update_order_entry = await Order.findById(req.params.id);

        if (!update_order_entry) {
          return res.status(404).send({
            result: { error: "The order with this ID was not found" },
          });
        }

        update_order_entry = await Order.findByIdAndUpdate(
          req.params.id,
          { $set: order },
          { new: true }
        );
        res.json({
          result: {
            success: "The order has been updated successfully",
          },
          update_order_entry: update_order_entry,
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

// ROUTE 5: Deleting Order | Method: DELETE | Endpoint: /api/order/delete_order_entry
router.delete(
  "/delete_order_entry/:id",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        // Validating The Sub Category For Deletion
        let delete_order_entry = await Order.findById(req.params.id);
        if (!delete_order_entry) {
          return res.status(404).send({
            result: { error: "The order with this ID was not found" },
          });
        }

        // Delting The Order As Per The Request Provided By Admin
        delete_order_entry = await Order.findByIdAndDelete(req.params.id);
        res.json({
          result: {
            success: "The requested order has been deleted successfully",
          },
          delete_order_entry: delete_order_entry,
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

// ROUTE 6: Fetching Order Based On Id | Method: Get | Endpoint: /api/order/order_details
router.get("/order_details/:id", administrator_details, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.administrator_data.administrator_authenticity) {
    try {
      let fetch_order_entry = await Order.findById(req.params.id).select(
        "-download_link"
      );
      if (fetch_order_entry) {
        return res.status(200).json({
          result: {
            success: "The order has been fetched successfully",
          },
          fetch_order_entry: fetch_order_entry,
        });
      } else {
        res.status(500).json({
          result: {
            error: "There is some problem while fetching the order entry",
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

// ROUTE 7: Fetching Order Count Based On Month | Method: Get | Endpoint: /api/order/order_count
router.get("/order_count", administrator_details, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ result: { errors: errors.array() } });
  }

  if (req.administrator_data.administrator_authenticity) {
    try {
      let months = [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12];
      let result = [];

      for (let index = 0; index < months.length; index++) {
        let order_count = await Order.find({
          time_stamp: {
            $gt: new Date(`2022-${months[index]}-01`),
            $lt: new Date(`2022-${months[index]}-31`),
          },
        }).count();
        result.push(order_count);
      }

      if (result) {
        return res.status(200).send({
          result: { result },
        });
      } else {
        return res.status(400).json({
          result: {
            error: "There is some problem while fetching the order count",
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

// ROUTE 8: Fetching Recent Order | Method: Get | Endpoint: /api/order/recent_order
router.get("/recent_order", administrator_details, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ result: { errors: errors.array() } });
  }

  if (req.administrator_data.administrator_authenticity) {
    try {
      let recent_order = await Order.find({})
        .sort({ _id: -1 })
        .limit(5)
        .select("-download_link");

      if (recent_order) {
        return res.status(200).send({
          recent_order,
        });
      } else {
        return res.status(400).json({
          result: {
            error: "There is some problem while fetching the recent order",
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

// ROUTE 9: Fetching Completed Orders | Method: Get | Endpoint: /api/order/fetch_completed_order_entry/administrator
router.get(
  "/fetch_completed_order_entry/administrator",
  administrator_details,
  async (req, res) => {
    if (req.administrator_data.administrator_authenticity) {
      try {
        let fetch_completed_order_entry = await Order.find({
          order_status: "active",
        }).select("-download_link");
        if (fetch_completed_order_entry) {
          return res.status(200).json({
            result: {
              success: "The completed order has been fetched successfully",
            },
            fetch_completed_order_entry: fetch_completed_order_entry,
          });
        } else {
          res.status(500).json({
            result: {
              error:
                "There is some problem while fetching the completed order entry",
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

// ROUTE 10: Fetching Specific Customer Order For Downloads | Method: Get | Endpoint: /api/order/fetch_download_entry
router.get("/fetch_download_entry", customer_details, async (req, res) => {
  if (req.customer_data.customer_authenticity) {
    try {
      if (req.query.page) {
        const result_per_page = 5;
        const page = req.query.page;

        const skip_order = result_per_page * (page - 1);

        let fetch_download_entry = await Order.find({
          customer: req.customer_data.customer_id,
          order_status: "active",
          payment_status: "active",
        })
          .limit(result_per_page)
          .skip(skip_order);

        let total_results = await Order.find({
          customer: req.customer_data.customer_id,
        }).count();

        if (fetch_download_entry) {
          return res.status(200).json({
            result: {
              success: "The order has been fetched successfully",
            },
            fetch_download_entry: fetch_download_entry,
            total_results: total_results,
          });
        } else {
          res.status(500).json({
            result: {
              error: "There is some problem while fetching the order entry",
            },
          });
        }
      } else {
        let fetch_download_entry = await Order.find({
          customer: req.customer_data.customer_id,
        });

        if (fetch_download_entry) {
          return res.status(200).json({
            result: {
              success: "The order has been fetched successfully",
            },
            fetch_download_entry: fetch_download_entry,
            total_results: total_results,
          });
        } else {
          res.status(500).json({
            result: {
              error: "There is some problem while fetching the order entry",
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

// ROUTE 2: Fetching Products In An Order - Customer Level | Method: Get | Endpoint: /api/order/fetch_product/customer
router.post("/fetch_product/customer", customer_details, async (req, res) => {
  if (req.customer_data.customer_authenticity) {
    try {
      let fetch_product = await Product.find({
        _id: {
          $in: req.body.product,
        },
      });

      if (fetch_product) {
        return res.status(200).json({
          result: {
            success: "The product has been fetched successfully",
          },
          fetch_product: fetch_product,
        });
      } else {
        res.status(500).json({
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
});

module.exports = router;
