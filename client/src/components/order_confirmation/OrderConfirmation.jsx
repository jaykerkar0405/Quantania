import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/order_confirmation.css";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state.order_details) {
    navigate("/");
  }

  const [order_details, set_order_details] = useState(
    location.state.order_details
  );
  // eslint-disable-next-line

  const cart_price = order_details.reduce((accumulator, object) => {
    return accumulator + object.product_price;
  }, 0);

  let total_price = (
    cart_price +
    0.01 * cart_price +
    0.02 * cart_price
  ).toFixed(2);

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      document.title =
        "Order Confirmation ||  Quantania - An efficient computer programs and application source code provider";
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div class="page-header text-center">
        <div class="container">
          <h1 class="page-title">Order Confirmation</h1>
        </div>
      </div>

      <div class="order-card mt-50 mb-50" style={{ height: "auto" }}>
        <div class="gap-element">
          <div class="col-2 d-flex mx-auto"> </div>
        </div>
        <div class="summary-title-order mx-auto">
          {" "}
          Thank you for your order !{" "}
        </div>
        <div class="main-div">
          {" "}
          <span id="sub-title">
            <p>
              <b style={{ fontSize: "14px" }}>Payment Summary</b>
            </p>
          </span>
          {order_details.map((element) => {
            return (
              <div class="row row-main">
                <div class="col-3">
                  {" "}
                  <img
                    class="img-fluid"
                    src={element.product_image.image_url}
                    alt="product_image"
                  />{" "}
                </div>
                <div class="col-6">
                  <div class="row d-flex">
                    <p>
                      <b style={{ fontSize: "15px" }}>{element.product_name}</b>
                    </p>
                  </div>
                  <div class="row d-flex">
                    <p class="text-success" style={{ fontSize: "12px" }}>
                      Developer : {element.product_developer}
                    </p>
                  </div>
                </div>
                <div class="col-3 d-flex justify-content-end">
                  <p>
                    <b style={{ fontSize: "12px" }}>
                      Rs {element.product_price}
                    </b>
                  </p>
                </div>
              </div>
            );
          })}
          <hr />
          <div class="total">
            <div class="row">
              <div class="col">
                {" "}
                <b style={{ fontSize: "15px", color: "white" }}> Total:</b>{" "}
              </div>
              <div class="col d-flex justify-content-end">
                {" "}
                <b style={{ fontSize: "15px", color: "white" }}>
                  Rs {total_price}
                </b>{" "}
              </div>
            </div>{" "}
            <Link to={"/"}>
              <button
                class="button d-flex mx-auto"
                style={{ fontSize: "12px", marginTop: "3rem" }}
              >
                {" "}
                Continue Shopping{" "}
              </button>
            </Link>
            <br />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
