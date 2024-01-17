import React, { useState, useEffect } from "react";
import "../../assets/css/authentication.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  let navigate = useNavigate();

  const [registration_details, set_registration_details] = useState({
    username: "",
    email_id: "",
    mobile_number: "",
    password: "",
    confirm_password: "",
  });
  const [disabled, set_disabled] = useState(false);

  const set_value = (event) => {
    set_registration_details({
      ...registration_details,
      [event.target.name]: event.target.value,
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    let { username, email_id, mobile_number, password, confirm_password } =
      registration_details;

    if (
      username.length > 0 &&
      email_id.length > 0 &&
      mobile_number.length > 0 &&
      password.length >= 8 &&
      confirm_password.length >= 8
    ) {
      if (password === confirm_password) {
        set_disabled(true);
        const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/registration`;

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
        const request_result = await request.json();

        if (request_result.result.success) {
          set_registration_details({});

          toast.success(request_result.result.success, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }

        if (request_result.result.error) {
          set_disabled(false);
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
      if (username.length === 0) {
        set_disabled(false);
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
    document.title = "Administrator Registration - Quantania Admin Panel";
    if (localStorage.getItem("administrator_authentication_token")) {
      navigate("/#/admin_panel/dashboard");
    }
    //eslint-disable-next-line
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

      <div className="container right-panel-active" id="container">
        <div className="form-container sign-up-container">
          <form style={{ marginTop: "0.5rem" }} method="post">
            <h1 style={{ fontSize: "2rem" }}>Create Account</h1>
            <span style={{ visibility: "hidden" }}>Fill the below details</span>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={set_value}
              autoComplete="off"
              required
            />
            <input
              type="email"
              placeholder="Email id"
              name="email_id"
              onChange={set_value}
              autoComplete="off"
              required
            />
            <input
              type="number"
              placeholder="Mobile number"
              name="mobile_number"
              onChange={set_value}
              autoComplete="off"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={set_value}
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              name="confirm_password"
              onChange={set_value}
              required
            />
            <button
              style={{ marginTop: "0.5rem" }}
              onClick={submit}
              disabled={disabled}
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <a href={`/#/admin_panel/login`} style={{ color: "white" }}>
                <button id="signUp" className="ghost">
                  Sign In
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
