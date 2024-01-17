import React, { useState, useEffect, useRef } from "react";
import "../../assets/css/authentication.css";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = (props) => {
  let navigate = useNavigate();
  const [credentials, set_credentials] = useState({
    identifier: "",
    password: "",
  });

  const [forgot_password, set_forgot_password] = useState({
    email_id: "",
  });

  const [disabled, set_disabled] = useState(false);

  const set_value = (event) => {
    set_credentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  };

  const set_forgot_password_value = (event) => {
    set_forgot_password({
      ...forgot_password,
      [event.target.name]: event.target.value,
    });
  };

  const forgot_password_modal_close = useRef(null);
  const forgot_password_modal_reset_button = useRef(null);

  const submit = async (event) => {
    event.preventDefault();
    let { identifier, password } = credentials;

    if (identifier.length > 0 && password.length >= 8) {
      set_disabled(true);
      const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/login`;

      const request = await fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: isNaN(identifier) ? identifier : parseInt(identifier),
          password: password,
        }),
      });
      const request_result = await request.json();

      if (request_result.result.success) {
        localStorage.setItem(
          "administrator_authentication_token",
          request_result.administrator_authentication_token
        );
        navigate("/#/admin_panel/dashboard");
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
      if (!identifier.length) {
        toast.error("Please enter a valid username / mobile number", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      if (password.length < 8) {
        toast.error(
          "Please enter a valid password of minimum length 8 character",
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

  const submit_forgot_password = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/forgot_password/mail`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_id: forgot_password.email_id,
      }),
    });
    const request_result = await request.json();
    forgot_password_modal_close.current.click();
    forgot_password_modal_reset_button.current.click();

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

    if (request_result.result.errors) {
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

  useEffect(() => {
    document.title = "Administrator Login - Quantania Admin Panel";
    if (localStorage.getItem("administrator_authentication_token")) {
      navigate("/#/admin_panel/dashboard");
    }
    // eslint-disable-next-line
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

      {/* Forgot password modal */}
      <div
        className="modal fade"
        id="forgot_password_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="addModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          style={{ marginTop: "10rem" }}
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-black font-bold"
                id="addModalLabel"
              >
                Forgot password
              </h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Email id
                  </label>
                  <input
                    type="text"
                    name="email_id"
                    className="form-control"
                    id="email_id"
                    placeholder="Enter email id"
                    onChange={set_forgot_password_value}
                    autoComplete="off"
                  />
                </div>
                <input
                  type="reset"
                  ref={forgot_password_modal_reset_button}
                  style={{ display: "none" }}
                />
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={forgot_password_modal_close}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                onClick={submit_forgot_password}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" id="container">
        <div className="form-container sign-in-container">
          <form method="post">
            <h1>Sign in</h1>
            <span style={{ visibility: "hidden" }}>Fill the below details</span>
            <input
              placeholder="Username / Mobile number"
              name="identifier"
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
            <Link
              // eslint-disable-next-line
              to={"javascript:void(0)"}
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#forgot_password_modal"
            >
              Forgot your password ?
            </Link>
            <button type="button" onClick={submit} disabled={disabled}>
              Sign In
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your credentials
              </p>
              <a
                href={`/#/admin_panel/registration`}
                style={{ color: "white" }}
              >
                <button id="signIn" className="ghost">
                  Sign Up
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
