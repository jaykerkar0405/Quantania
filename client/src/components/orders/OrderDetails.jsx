import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../../layouts/loader/PageLoader";

const OrderDetails = () => {
  const location = useLocation();
  const order_details = location.state.order_details;
  const [product, set_product] = useState({});
  const [loading, set_loading] = useState(true);
  const navigate = useNavigate();

  const fetch_product_details = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/order/fetch_product/customer`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
      body: JSON.stringify({
        product: order_details.product,
      }),
    });
    const request_result = await request.json();
    set_product(request_result.fetch_product);

    set_loading(false);

    if (request_result.result.error) {
      toast.error(request_result.result.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate(`/account/orders`);
      }, 3000);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      document.title =
        "Order Details || Quantania - An efficient computer programs and application source code provider";
      fetch_product_details();
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />

      <main class="main">
        <div class="page-header text-center">
          <div class="container">
            <h1 class="page-title">
              My Account<span>View placed orders & manage your profile</span>
            </h1>
          </div>
        </div>

        <nav aria-label="breadcrumb" class="breadcrumb-nav mb-3">
          <div class="container">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <Link to={"/"}>Home</Link>
              </li>
              <li class="breadcrumb-item active " aria-current="page">
                <Link to="/account">My Account</Link>
              </li>
              <li class="breadcrumb-item active " aria-current="page">
                <Link to="/account/orders">My Orders</Link>
              </li>
              <li class="breadcrumb-item active " aria-current="page">
                <a // eslint-disable-next-line
                  href="javascript:void(0)"
                >
                  Order Details
                </a>
              </li>
            </ol>
          </div>
        </nav>

        <div class="page-content">
          <div class="dashboard">
            <div class="container">
              <div class="row">
                <aside class="col-md-4 col-lg-3">
                  <ul
                    class="nav nav-dashboard flex-column mb-3 mb-md-0"
                    role="tablist"
                  >
                    <li class="nav-item">
                      <Link
                        class="nav-link active"
                        id="tab-orders-link"
                        data-toggle="tab"
                        to="/account/orders"
                        role="tab"
                        aria-controls="tab-orders"
                        aria-selected="false"
                      >
                        My Orders
                      </Link>
                    </li>
                    <li class="nav-item">
                      <Link
                        class="nav-link"
                        id="tab-downloads-link"
                        data-toggle="tab"
                        to="/account/downloads"
                        role="tab"
                        aria-controls="tab-downloads"
                        aria-selected="false"
                      >
                        My Downloads
                      </Link>
                    </li>
                    <li class="nav-item">
                      <Link
                        class="nav-link"
                        id="tab-account-link"
                        data-toggle="tab"
                        to="/account/account_details"
                        role="tab"
                        aria-controls="tab-account"
                        aria-selected="false"
                      >
                        Account Details
                      </Link>
                    </li>
                    <li class="nav-item">
                      <Link
                        class="nav-link"
                        id="tab-account-link"
                        data-toggle="tab"
                        to="/account/change_password"
                        role="tab"
                        aria-controls="tab-account"
                        aria-selected="false"
                      >
                        Change Password
                      </Link>
                    </li>
                  </ul>
                </aside>

                {loading ? (
                  <PageLoader />
                ) : (
                  <div class="col-md-8 col-lg-9">
                    <div class="tab-content">
                      <div
                        class="tab-pane fade active show"
                        id="tab-orders"
                        role="tabpanel"
                        aria-labelledby="tab-orders-link"
                      >
                        <section class="h-100 gradient-custom">
                          <div class="details-container py-5 h-100">
                            <div class="row d-flex justify-content-center align-items-center h-100">
                              <div class="col-lg-10 col-xl-8">
                                <div
                                  class="card"
                                  style={{
                                    borderRadius: "10px",
                                    backgroundColor: "rgb(46, 27, 144)",
                                  }}
                                >
                                  <div class="card-header px-4 py-5">
                                    <h5 class="mb-0">
                                      Here are the details of your order,{" "}
                                      <span style={{ color: "#a8729a" }}>
                                        {order_details._id}
                                      </span>
                                    </h5>
                                  </div>
                                  <div class="card-body p-4">
                                    <div class="d-flex justify-content-between align-items-center mb-4">
                                      <p
                                        class="lead fw-normal mb-0"
                                        style={{ color: "#fff" }}
                                      >
                                        Receipt
                                      </p>
                                      <p class="small mb-0">
                                        Date & Time : {order_details.time_stamp}
                                      </p>
                                    </div>
                                    {product.length > 0 &&
                                      product.map((element) => {
                                        return (
                                          <div
                                            class="card shadow-0 mb-4"
                                            style={{ border: "none" }}
                                          >
                                            <div
                                              class="card-body"
                                              style={{
                                                backgroundColor: "#10061b",
                                              }}
                                            >
                                              <div
                                                class="row"
                                                style={{ marginTop: "1rem" }}
                                              >
                                                <div class="col-md-2">
                                                  <img
                                                    src={
                                                      element.product_image
                                                        .image_url
                                                    }
                                                    class="img-fluid"
                                                    alt="product_image"
                                                  />
                                                </div>
                                                <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                  <p class="text-muted mb-0">
                                                    <Link
                                                      to={`/product/product_details?product_id=${element._id}`}
                                                    >
                                                      {element.product_name.slice(
                                                        0,
                                                        5
                                                      )}
                                                      ...
                                                    </Link>
                                                  </p>
                                                </div>
                                                <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                  <p class="text-muted mb-0 small">
                                                    Category:{" "}
                                                    <Link
                                                      to={`/category/category_product?category_id=${element.product_category.category_id}`}
                                                    >
                                                      {
                                                        element.product_category
                                                          .category_name
                                                      }
                                                    </Link>
                                                  </p>
                                                </div>
                                                <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                  <p class="text-muted mb-0 small">
                                                    Mrp: <br />
                                                    Rs {element.product_mrp}
                                                  </p>
                                                </div>
                                                <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                  <p class="text-muted mb-0 small">
                                                    Developer:{" "}
                                                    {element.product_developer}
                                                  </p>
                                                </div>
                                                <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                  <p class="text-muted mb-0 small">
                                                    Price: Rs{" "}
                                                    {element.product_price}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}

                                    <div class="d-flex justify-content-between pt-2">
                                      <p class="fw-bold mb-0">Order Details</p>
                                      <p class="mb-0">
                                        <span class="fw-bold me-4">
                                          Order Base Value :{" "}
                                        </span>
                                        Rs{" "}
                                        {(
                                          order_details.order_price -
                                          (0.02 * order_details.order_price +
                                            0.01 * order_details.order_price)
                                        ).toFixed(2)}
                                      </p>
                                    </div>

                                    <div class="d-flex justify-content-between pt-2">
                                      <p class="mb-0">
                                        <span class="fw-bold me-4">
                                          Tax (GST) :{" "}
                                        </span>
                                        Rs{" "}
                                        {(
                                          0.01 * order_details.order_price
                                        ).toFixed(2)}
                                      </p>
                                      <p class="mb-0">
                                        <span class="fw-bold me-4">
                                          Payment Gateway :{" "}
                                        </span>
                                        Rs{" "}
                                        {(
                                          0.02 * order_details.order_price
                                        ).toFixed(2)}
                                      </p>
                                    </div>

                                    <div class="d-flex justify-content-between">
                                      <p class="mb-0">
                                        Order Date : {order_details.time_stamp}
                                      </p>
                                      <p class="mb-0">
                                        <span class="fw-bold me-4">
                                          Total Tax Charges :
                                        </span>{" "}
                                        Rs{" "}
                                        {(
                                          0.02 * order_details.order_price +
                                          0.01 * order_details.order_price
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    class="card-footer border-0 px-4 py-5"
                                    style={{
                                      backgroundColor: "#a8729a",
                                      borderBottomLeftRadius: "10px",
                                      borderBottomRightRadius: "10px",
                                    }}
                                  >
                                    <h5 class="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">
                                      Total Paid :
                                      <span class="h4 mb-0 ms-2">
                                        Rs {order_details.order_price}
                                      </span>
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderDetails;
