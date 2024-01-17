import React, { useState, useEffect } from "react";
import "../../assets/css/payment.css";
import Spinner from "../spinner/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  let navigate = useNavigate();
  const [loading, set_loading] = useState(false);
  const [admin_details, set_admin_details] = useState();

  // JavaScript Logic To Get Current Date
  let date = new Date();
  var dd = String(date.getDate()).padStart(2, "0");
  var mm = String(date.getMonth() + 1).padStart(2, "0");
  var yyyy = date.getFullYear();
  date = dd + "/" + mm + "/" + yyyy;

  const fetch_admin_details = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/administrator_details/authentication_token`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({}),
    });
    const request_result = await request.json();
    set_admin_details(request_result.administrator_details);

    if (request_result.result.error) {
      toast.error(request_result.result.error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const initiate_payment = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onerror = () => {
      toast.error("Razorpay SDK failed to load", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    script.onload = async () => {
      try {
        set_loading(true);

        const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/payment/razorpay_create_payment`;
        const request = await fetch(api_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_price: 499 + "00",
          }),
        });
        const { currency, id } = await request.json();

        const razorpay_key_id_api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/payment/razorpay_key_id`;
        const razorpay_key_id_request = await fetch(razorpay_key_id_api_url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { razorpay_key_id } = await razorpay_key_id_request.json();

        const options = {
          key: razorpay_key_id,
          image:
            "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/6.webp",
          amount: 49900,
          escape: false,
          currency: currency,
          name: "Headphones Bose 35 II",
          description:
            "These are very premium and powerfull headphones for your workspace",
          order_id: id,
          handler: async function (response) {
            const razorpay_payment_api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/payment/razorpay_payment`;
            const razorpay_payment_request = await fetch(
              razorpay_payment_api_url,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_price: "49900",
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  razorpay_payment_status: true,
                }),
              }
            );
            const razorpay_payment_response =
              await razorpay_payment_request.json();

            if (razorpay_payment_response.result) {
              navigate("/admin_panel/payment_table");
            }
          },
          perfill: {
            name: admin_details.username,
            email: admin_details.email_id,
            contact: admin_details.mobile_number,
          },
        };

        set_loading(false);
        const payment_object = new window.Razorpay(options);
        payment_object.on("payment.failed", async function (response) {
          const razorpay_payment_api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/payment/razorpay_payment`;
          await fetch(razorpay_payment_api_url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_price: "49900",
              razorpay_payment_id: response.error.metadata.payment_id,
              razorpay_order_id: response.error.metadata.order_id,
              razorpay_payment_status: false,
              razorpay_signature: response.error.reason,
            }),
          });

          payment_object.close();
          navigate("/admin_panel/payment_table");
        });
        payment_object.open();
      } catch (error) {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        set_loading(false);
      }
    };

    document.body.appendChild(script);
  };

  useEffect(() => {
    fetch_admin_details();
    document.title = "Payment - Quantania Admin Panel";
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

      {loading ? (
        <Spinner />
      ) : (
        <section className="vh-100 gradient-custom-2">
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-md-10 col-lg-8 col-xl-6">
                <div
                  className="card card-stepper"
                  style={{ borderRadius: "16px" }}
                >
                  <div className="card-header p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted mb-2">
                          {" "}
                          Order ID:{" "}
                          <span className="fw-bold text-body">1222528743</span>
                        </p>
                        <p className="text-muted mb-0">
                          {" "}
                          Place On:{" "}
                          <span className="fw-bold text-body">{date}</span>{" "}
                        </p>
                      </div>
                      <div>
                        <h6 className="mb-0">
                          {" "}
                          <a
                            href="#/admin_panel/payment_table"
                            style={{ textDecoration: "none" }}
                          >
                            View Payment
                          </a>{" "}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex flex-row mb-4 pb-2">
                      <div className="flex-fill">
                        <h5 className="bold">Headphones Bose 35 II</h5>
                        <p className="text-muted"> Quantity: 1 item</p>
                        <h4 className="mb-3">
                          {" "}
                          Rs 499{" "}
                          <span className="small text-muted">
                            {" "}
                            via (Online){" "}
                          </span>
                        </h4>
                        <p className="text-muted">
                          Payment method:{" "}
                          <span className="text-body">Razorpay</span>
                        </p>
                      </div>
                      <div>
                        <img
                          className="align-self-center img-fluid"
                          src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/6.webp"
                          width="250"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer p-4">
                    <div className="d-flex justify-content-between">
                      <h5 className="fw-normal mb-0">
                        <button
                          className="btn btn-primary"
                          disabled={loading}
                          onClick={initiate_payment}
                        >
                          Pay with Razorpay
                        </button>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Payment;
