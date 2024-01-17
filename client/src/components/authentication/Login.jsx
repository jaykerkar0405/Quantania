import React, { useState, useEffect } from "react";
import "../../assets/css/login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const initial_state = {
    identifier: "",
    password: "",
  };

  const [credentials, set_credentials] = useState(initial_state);
  const [disabled, set_disabled] = useState(false);

  const set_value = (event) => {
    set_credentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  };

  const location = useLocation();

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
    location.state.alert = "";
  }

  const login = async (event) => {
    event.preventDefault();
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/login`;
    const { identifier, password } = credentials;

    if (identifier.length > 0 && password.length >= 8) {
      set_disabled(true);

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

      const response = await request.json();

      if (response.result.success) {
        localStorage.setItem(
          "customer_authentication_token",
          response.customer_authentication_token
        );
        navigate("/");
      } else {
        set_disabled(false);
      }

      if (response.result.error) {
        toast.error(response.result.error, {
          position: "top-right",
          toastId: "login_error",
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

  useEffect(() => {
    document.title =
      "Sign In ||  Quantania - An efficient computer programs and application source code provider";

    if (localStorage.getItem("customer_authentication_token")) {
      navigate("/");
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />

      <div id="login-form">
        <h2 id="header-title">Sign in - Quantania</h2>

        <div class="input-row">
          <label>Username / Mobile number</label>
          <input
            type="text"
            name="identifier"
            placeholder="Enter username / mobile number"
            onChange={set_value}
            autoComplete="off"
            required
          />
        </div>

        <div class="input-row">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={set_value}
            autoComplete="off"
            required
          />
        </div>

        <div id="button" class="input-row">
          <button onClick={login} disabled={disabled ? true : false}>
            Sign In
          </button>
        </div>

        <div id="redirect">
          <label>
            <Link id="redirect-link" to="/authentication/registration">
              {" "}
              Don't have an account ? Sign up now
            </Link>
          </label>
        </div>
      </div>
    </>
  );
};

export default Login;
