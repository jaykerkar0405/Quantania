import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../spinner/Spinner";

const ForgotPassword = () => {
  let navigate = useNavigate();
  const [forgot_password, set_forgot_password] = useState({
    password: "",
    confirm_password: "",
  });

  let search_string = window.location.href;
  let replaced_searched_string = search_string.replace("/#/", "/");
  let url = new URL(replaced_searched_string);
  let search_params = url.searchParams;
  let administrator_authentication_token = search_params.get(
    "administrator_authentication_token"
  );
  if (!administrator_authentication_token) {
    navigate(`/#/admin_panel/error`);
  }

  const submit_forgot_password = async () => {
    if (forgot_password.password === forgot_password.confirm_password) {
      if (
        forgot_password.password.length < 8 ||
        forgot_password.confirm_password.length < 8
      ) {
        if (forgot_password.password.length < 8) {
          toast.error("Please enter the new password of minimum 8 characters", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }

        if (forgot_password.confirm_password.length < 8) {
          toast.error(
            "Please enter the confirm new password of minimum 8 characters",
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
        }
      } else {
        const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/forgot_password`;
        const request = await fetch(api_url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            administrator_authentication_token:
              administrator_authentication_token,
          },
          body: JSON.stringify({
            password: forgot_password.password,
          }),
        });
        const request_result = await request.json();

        if (request_result.result.success) {
          localStorage.setItem(
            "administrator_authentication_token",
            administrator_authentication_token
          );
          navigate(`/admin_panel/dashboard`);
        }

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
      }
    } else {
      toast.error("Please make sure that the passwords are matching", {
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

  const set_value = (event) => {
    set_forgot_password({
      ...forgot_password,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("administrator_authentication_token")) {
      document.title = "Forgot Password - Quantania Admin Panel";
    } else {
      navigate(`/admin_panel/dashboard`);
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

      {forgot_password ? (
        <div className="container-xl px-4 mt-4">
          <div className="row">
            <div className="col-xl-12">
              <div className="card mb-4">
                <div className="card-header text-dark">Forgot password</div>
                <div className="card-body">
                  <form>
                    <div className="row gx-3 mb-3">
                      <div className="col-md-12 mb-3">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputUsername"
                        >
                          New password
                        </label>
                        <input
                          className="form-control"
                          id="inputUsername"
                          type="password"
                          name="password"
                          value={forgot_password.password}
                          onChange={set_value}
                        />
                      </div>
                    </div>
                    <div className="row gx-3 mb-3">
                      <div className="col-md-12">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputLastName"
                        >
                          Confirm new password
                        </label>
                        <input
                          className="form-control"
                          id="inputUsername"
                          type="password"
                          name="confirm_password"
                          value={forgot_password.confirm_password}
                          onChange={set_value}
                        />
                      </div>
                    </div>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={submit_forgot_password}
                    >
                      Submit
                    </button>
                  </form>
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

export default ForgotPassword;
