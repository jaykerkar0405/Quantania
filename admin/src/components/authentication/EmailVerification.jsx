import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmailVerification = () => {
  let navigate = useNavigate();
  let search_string = window.location.href;
  let replaced_searched_string = search_string.replace("/#/", "/");
  let url = new URL(replaced_searched_string);
  let search_params = url.searchParams;
  let administrator_authentication_token = search_params.get(
    "administrator_authentication_token"
  );
  if (!administrator_authentication_token) {
    navigate("/#/admin_panel/registration");
  }

  const update_administrator_status = async () => {
    if (administrator_authentication_token) {
      const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/update_administrator_status/authentication_token`;

      const request = await fetch(api_url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          administrator_authentication_token:
            administrator_authentication_token,
        },
        body: JSON.stringify({
          status: "active",
        }),
      });
      const request_result = await request.json();

      if (request_result.result.success) {
        localStorage.setItem(
          "administrator_authentication_token",
          administrator_authentication_token
        );
        navigate("/#/admin_panel/dashboard");
      }
    } else {
      toast.error("We are currently face some issues. Please try again later", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    update_administrator_status();
    document.title = "Email Verification - Quantania Admin Panel";
    // eslint-disable-next-line
  }, []);
  return (
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
  );
};

export default EmailVerification;
