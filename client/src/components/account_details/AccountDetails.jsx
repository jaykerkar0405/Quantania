import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../../layouts/loader/PageLoader";

const AccountDetails = ({ set_progress }) => {
  const [customer, set_customer] = useState({
    username: "",
    email_id: "",
    mobile_number: "",
  });
  const [loading, set_loading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  if (location.state) {
    toast.success(location.state.alert, {
      position: "top-right",
      toastId: "changed_account_details",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    location.state.alert = null;
  }

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

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      document.write =
        "Account Details ||  Quantania - An efficient computer programs and application source code provider";
      fetch_customer_details();
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

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
              value={customer.username}
              readOnly
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
              value={customer.email_id}
              readOnly
              style={{
                backgroundColor: "hsl(250,29%,16%)",
                color: "hsl(250,8%,75%)",
                border: "none",
              }}
            />
            <label>Mobile number</label>
            <input
              type="number"
              class="form-control"
              value={customer.mobile_number}
              readOnly
              style={{
                backgroundColor: "hsl(250,29%,16%)",
                color: "hsl(250,8%,75%)",
                border: "none",
              }}
            />
            <Link
              to={"/account/change_account_details"}
              class="btn btn-outline-primary-2"
            >
              <span>CHANGE ACCOUNT DETAILS</span>
            </Link>
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

export default AccountDetails;
