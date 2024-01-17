import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmailVerification = () => {
  const navigate = useNavigate();

  let search_string = window.location.href;
  let replaced_searched_string = search_string.replace("/#/", "/");
  let url = new URL(replaced_searched_string);
  let search_params = url.searchParams;
  let customer_authentication_token = search_params.get(
    "customer_authentication_token"
  );

  if (!customer_authentication_token) {
    navigate("/authentication/registration");
  }

  const verify_customer = async () => {
    if (customer_authentication_token) {
      const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/update_customer_status/authentication_token`;

      const request = await fetch(api_url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          customer_authentication_token: customer_authentication_token,
        },
        body: JSON.stringify({
          status: "active",
        }),
      });

      const response = await request.json();

      if (response.result.success) {
        localStorage.setItem(
          "customer_authentication_token",
          customer_authentication_token
        );

        navigate("/");
      } else {
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
    verify_customer();
    document.title =
      "Email Verification || Quantania - An efficient computer programs and application source code provider";

    // eslint-disable-next-line
  }, []);

  return <ToastContainer />;
};

export default EmailVerification;
