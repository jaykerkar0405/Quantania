import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../layouts/loader/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangeAccountDetails = ({ set_progress }) => {
  const [customer, set_customer] = useState({
    username: "",
    email_id: "",
    mobile_number: "",
  });
  const [loading, set_loading] = useState(true);
  const [disabled, set_disabled] = useState(false);
  const [customer_previous_email_id, set_customer_previous_email_id] =
    useState(true);

  const navigate = useNavigate();
  const form_reset_button = useRef(null);

  const fetch_customer_details = async () => {
    set_progress(25);
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/customer_details`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
    });
    set_progress(50);
    const request_result = await request.json();
    set_progress(75);
    set_customer(request_result.customer_details);
    set_customer_previous_email_id(request_result.customer_details.email_id);
    set_progress(100);

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
    } else {
      set_loading(false);
    }
  };

  const change_customer_details = async () => {
    set_disabled(true);
    set_progress(25);
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/update_customer`;
    const request = await fetch(api_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
      body: JSON.stringify({
        username: customer.username,
        email_id: customer.email_id,
        mobile_number: customer.mobile_number,
      }),
    });
    set_progress(50);
    const request_result = await request.json();
    set_progress(75);
    if (request_result.result.success) {
      set_progress(100);
      form_reset_button.current.click();
      set_disabled(false);
      if (customer_previous_email_id === customer.email_id) {
        navigate("/account/account_details", {
          state: { alert: "Successfully changed the account details" },
        });
      } else {
        localStorage.removeItem("customer_authentication_token");
        navigate("/authentication/login", {
          state: {
            alert:
              "Successfully changed the account details, please verify the email id and then login",
          },
        });
      }
    }

    if (request_result.result.error) {
      set_disabled(false);
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

    if (request_result.result.errors) {
      set_disabled(false);
      for (
        let index = 0;
        index < request_result.result.errors.length;
        index++
      ) {
        toast.error(request_result.result.errors[index].msg, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const set_value = (event) => {
    set_customer({
      ...customer,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      document.title =
        "Change Account Details ||  Quantania - An efficient computer programs and application source code provider";
      fetch_customer_details();
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />

      <div
        class="tab-pane fade active show"
        id="tab-account"
        role="tabpanel"
        aria-labelledby="tab-account-link"
      >
        {!loading ? (
          <form>
            <label>Username</label>{" "}
            <input
              type="text"
              class="form-control"
              name="username"
              value={customer.username}
              onChange={set_value}
              autoComplete="off"
              style={{
                backgroundColor: "hsl(250,29%,16%)",
                color: "hsl(250,8%,75%)",
                border: "none",
              }}
            />
            <small class="form-text">
              This will be how your name will be displayed in the account
              section and in purchases
            </small>
            <label>Email address</label>
            <input
              type="email"
              class="form-control"
              name="email_id"
              value={customer.email_id}
              onChange={set_value}
              autoComplete="off"
              style={{
                backgroundColor: "hsl(250,29%,16%)",
                color: "hsl(250,8%,75%)",
                border: "none",
              }}
            />
            <small class="form-text">
              If you change your email address, you will need to verify it and
              then you can login
            </small>
            <label>Mobile number</label>
            <input
              type="number"
              class="form-control"
              name="mobile_number"
              value={customer.mobile_number}
              onChange={set_value}
              autoComplete="off"
              style={{
                backgroundColor: "hsl(250,29%,16%)",
                color: "hsl(250,8%,75%)",
                border: "none",
              }}
            />
            <input
              type="reset"
              ref={form_reset_button}
              style={{ display: "none" }}
            />
            <button
              class="btn btn-outline-primary-2"
              onClick={change_customer_details}
              disabled={disabled}
            >
              <span>SAVE CHANGES</span>
            </button>
          </form>
        ) : (
          <div style={{ margin: "7rem 0" }}>
            <PageLoader />
          </div>
        )}
      </div>
    </>
  );
};

export default ChangeAccountDetails;
