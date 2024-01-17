import React from "react";
import { useEffect, useState } from "react";
import "../../assets/css/order_details.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowBackOutlined } from "@material-ui/icons";
import Spinner from "../spinner/Spinner";

const OrderDetails = () => {
  let navigate = useNavigate();
  const [order_details, set_order_details] = useState({});
  const [product_details, set_product_details] = useState({});

  let search_string = window.location.href;
  let replaced_searched_string = search_string.replace("/#/", "/");
  let url = new URL(replaced_searched_string);
  let search_params = url.searchParams;
  let order_id = search_params.get("order_id");
  let product_id = search_params.get("product_id");
  let redirect = search_params.get("redirect");
  if (!redirect) {
    navigate("/#/admin_panel/dashboard");
  }
  if (!order_id || !product_id) {
    navigate(`/#/admin_panel/${redirect}`);
  }

  const fetch_order_details = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/order/order_details/${order_id}`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const request_result = await request.json();
    set_order_details(request_result.fetch_order_entry);

    if (request_result.result.success) {
      toast.success(request_result.result.success, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

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
    }
  };

  const fetch_product_details = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/product_details/${product_id}`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const request_result = await request.json();
    set_product_details(request_result.product_details);

    if (request_result.result.success) {
      toast.success(request_result.result.success, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

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
        navigate(`/#/admin_panel/${redirect}`);
      }, 3000);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_order_details();
      fetch_product_details();
      document.title = "Order Details - Quantania Admin Panel";
    } else {
      navigate(`/admin_panel/login`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {order_details ? (
        <div className="container-fluid">
          <div className="container">
            <a
              href={`#/admin_panel/${redirect}`}
              className="mb-3"
              style={{ color: "gray", margin: "0 1.3rem" }}
            >
              <ArrowBackOutlined />
            </a>
            <div className="d-flex justify-content-between align-items-center py-3">
              <h2 className="h5 mb-0">
                <a
                  href="/order"
                  className="text-dark"
                  disabled={true}
                  style={{ marginLeft: "1rem" }}
                >
                  {" "}
                  Order #{order_details._id}
                </a>
              </h2>
            </div>
            <div className="row">
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="mb-3 d-flex justify-content-between">
                      <div style={{ margin: "0 0.3rem" }}>
                        <span className="me-3">{order_details.time_stamp}</span>
                        <a
                          href={`#/admin_panel/product_details?product_id=${product_details._id}&redirect=order`}
                          className="text-dark"
                          disabled={true}
                          style={{ marginLeft: "1rem" }}
                        >
                          <span className="me-3">#{product_details._id}</span>
                        </a>
                        <span className="badge rounded-pill bg-info">
                          {order_details.payment_status}
                        </span>
                      </div>
                    </div>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex mb-2">
                              <div className="flex-shrink-0">
                                <a
                                  href={product_details.product_image.image_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={
                                      product_details.product_image.image_url
                                    }
                                    width="35"
                                    className="img-fluid"
                                    style={{ height: "4rem", width: "4rem" }}
                                    alt="product image"
                                  />
                                </a>
                              </div>
                              <div className="flex-lg-grow-1 ms-3">
                                <h6
                                  className="small mb-0"
                                  style={{ marginTop: "1.3rem" }}
                                >
                                  <a
                                    className="text-reset"
                                    href={`#/admin_panel/product_details?product_id=${product_details._id}&redirect=order`}
                                    style={{ textDecoration: "none" }}
                                  >
                                    {product_details.product_name}
                                  </a>
                                </h6>
                              </div>
                            </div>
                          </td>
                          <td className="text-end">
                            <span
                              style={{ position: "absolute", top: "5.3rem" }}
                            >
                              Rs {product_details.product_price}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="2">Subtotal</td>
                          <td className="text-end">
                            Rs {order_details.order_price}
                          </td>
                        </tr>
                        <tr className="fw-bold">
                          <td colspan="2">TOTAL</td>
                          <td className="text-end">
                            Rs {order_details.order_price}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12">
                        <h3 className="h6 d-inline-block">
                          Payment Information
                        </h3>
                        {order_details.payment_status === "active" ? (
                          <span
                            className="badge bg-success rounded-pill"
                            style={{ margin: "0 1rem" }}
                          >
                            Completed
                          </span>
                        ) : (
                          <span
                            className="badge bg-error rounded-pill"
                            style={{ margin: "0 1rem" }}
                          >
                            Pending
                          </span>
                        )}
                        <p>{order_details.payment_information}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card mb-4">
                  <div className="card-body">
                    <h3 className="h6">Customer: {order_details.customer}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default OrderDetails;
