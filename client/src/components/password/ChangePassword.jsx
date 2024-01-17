import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = ({ set_progress }) => {
  const [password, set_password] = useState({
    old_password: "",
    new_password: "",
  });
  const [disabled, set_disabled] = useState(false);

  const form_reset_button = useRef(null);
  const navigate = useNavigate();

  const set_value = (event) => {
    set_password({
      ...password,
      [event.target.name]: event.target.value,
    });
  };

  const change_password = async () => {
    if (
      password.old_password.length >= 8 &&
      password.new_password.length >= 8 &&
      password.new_password === password.confirm_new_password
    ) {
      set_progress(25);
      const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/change_password`;
      const request = await fetch(api_url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          customer_authentication_token: localStorage.getItem(
            "customer_authentication_token"
          ),
        },
        body: JSON.stringify({
          old_password: password.old_password,
          new_password: password.new_password,
        }),
      });
      set_progress(50);
      const request_result = await request.json();
      set_progress(75);
      if (request_result.result.success) {
        set_progress(100);
        set_disabled(false);
        form_reset_button.current.click();
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
    } else {
      if (password.new_password !== password.confirm_new_password) {
        set_disabled(false);
        toast.error("Please make sure that the passwords are matching", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (password.old_password.length < 8) {
        set_disabled(false);
        toast.error(
          "Please enter a valid current password of minimum length 8 characters",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else if (password.new_password.length < 8) {
        set_disabled(false);
        toast.error(
          "Please enter a valid new password of minimum length 8 characters",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else {
        set_disabled(false);
        toast.error("Please enter valid details", {
          position: "top-right",
          autoClose: 5000,
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
    if (localStorage.getItem("customer_authentication_token")) {
      document.title =
        "Change Password ||  Quantania - An efficient computer programs and application source code provider";
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
        <form>
          <label>Current password</label>
          <input
            type="password"
            class="form-control"
            name="old_password"
            placeholder="Enter the current password"
            autoComplete="off"
            onChange={set_value}
            style={{
              backgroundColor: "hsl(250,29%,16%)",
              color: "hsl(250,8%,75%)",
              border: "none",
            }}
          />
          <label>
            New password (password must be of minimum length 8 characters)
          </label>
          <input
            type="password"
            class="form-control"
            name="new_password"
            placeholder="Enter the new password"
            autoComplete="off"
            onChange={set_value}
            style={{
              backgroundColor: "hsl(250,29%,16%)",
              color: "hsl(250,8%,75%)",
              border: "none",
            }}
          />
          <label>Confirm new password</label>
          <input
            type="password"
            class="form-control mb-2"
            name="confirm_new_password"
            placeholder="Enter the new password again"
            autoComplete="off"
            onChange={set_value}
            style={{
              backgroundColor: "hsl(250,29%,16%)",
              color: "hsl(250,8%,75%)",
              border: "none",
            }}
          />{" "}
          <input
            type="reset"
            ref={form_reset_button}
            style={{ display: "none" }}
          />
          <button
            type="button"
            class="btn btn-outline-primary-2"
            onClick={change_password}
            disabled={disabled}
          >
            <span>SAVE CHANGES</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
