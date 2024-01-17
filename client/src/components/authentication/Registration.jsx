import React, { useState, useEffect } from "react";
import "../../assets/css/registration.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const initial_state = {
    username: "",
    email_id: "",
    mobile_number: "",
    password: "",
    confirm_password: "",
  };

  const [registration_details, set_registration_details] =
    useState(initial_state);
  const [disabled, set_disabled] = useState(false);

  const set_value = (event) => {
    set_registration_details({
      ...registration_details,
      [event.target.name]: event.target.value,
    });
  };

  const registration = async (event) => {
    event.preventDefault();
    const { username, email_id, mobile_number, password, confirm_password } =
      registration_details;
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/registration`;

    if (
      username.length > 0 &&
      email_id.length > 0 &&
      mobile_number.length > 0 &&
      password.length >= 8 &&
      confirm_password.length >= 8
    ) {
      if (password === confirm_password) {
        set_disabled(true);

        toast.info("Creating your account...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        const request = await fetch(api_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email_id: email_id,
            mobile_number: parseInt(mobile_number),
            password: password,
          }),
        });

        const response = await request.json();

        if (response.result.success) {
          set_registration_details(initial_state);

          toast.success(response.result.success, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          set_disabled(false);
        }

        if (response.result.error) {
          toast.error(response.result.error, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }

        if (response.result.errors) {
          for (let index = 0; index < response.result.errors.length; index++) {
            toast.error(response.result.errors[index].msg, {
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
      } else {
        set_disabled(false);

        toast.error("Please make sure that the passwords are matching", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      set_disabled(false);

      if (username.length === 0) {
        toast.error("Please enter a valid username", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      if (email_id.length === 0) {
        set_disabled(false);
        toast.error("Please enter a valid email id", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      if (mobile_number.length === 0) {
        set_disabled(false);
        toast.error("Please enter a valid mobile number", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      if (password.length === 0) {
        toast.error(
          "Please enter a valid password of minimum length 8 characters",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }

      if (confirm_password.length === 0) {
        toast.error(
          "Please enter a valid confirm password of minimum length 8 characters",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    }
  };

  useEffect(() => {
    document.title = "Customer Registration - Quantania";
    if (localStorage.getItem("customer_authentication_token")) {
      navigate("/");
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />

      <div id="registration-form">
        <h2 id="header-title">Sign up - Quantania</h2>

        <div class="input-row">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            name="username"
            onChange={set_value}
            autoComplete="off"
            required
          />
        </div>

        <div class="input-row">
          <label>Email id</label>
          <input
            type="email"
            placeholder="Enter email id"
            name="email_id"
            onChange={set_value}
            autoComplete="off"
            required
          />
        </div>

        <div class="input-row">
          <label>Mobile number</label>
          <input
            type="number"
            placeholder="Enter mobile number"
            name="mobile_number"
            onChange={set_value}
            autoComplete="off"
            required
          />
        </div>

        <div class="input-row">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            onChange={set_value}
            autoComplete="off"
            required
          />
        </div>

        <div class="input-row">
          <label>Confirm password</label>
          <input
            type="password"
            placeholder="Enter confirm password"
            name="confirm_password"
            onChange={set_value}
            autoComplete="off"
            required
          />
        </div>

        <div id="button" class="input-row">
          <button onClick={registration}>
            {/* disabled={disabled ? true : false} */}
            Sign Up
          </button>
        </div>

        <div id="redirect">
          <label>
            <Link id="redirect-link" to="/authentication/login">
              Already have an account ? Sign in now
            </Link>
          </label>
        </div>
      </div>
    </>
  );
};

export default Registration;
