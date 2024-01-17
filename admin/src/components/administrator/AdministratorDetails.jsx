import React from "react";
import { useEffect, useState } from "react";
import "../../assets/css/administrator_details.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdministratorDetails = () => {
  let navigate = useNavigate();
  const [administrator_details, set_administrator_details] = useState({
    administrator_image: {
      public_id: "",
      image_url: "",
    },
    _id: "",
    username: "",
    email_id: "",
    mobile_number: "",
    status: "",
    time_stamp: "",
  });

  let search_string = window.location.href;
  let replaced_searched_string = search_string.replace("/#/", "/");
  let url = new URL(replaced_searched_string);
  let search_params = url.searchParams;
  let administrator_id = search_params.get("administrator_id");
  let redirect = search_params.get("redirect");
  if (!redirect) {
    navigate("/#/admin_panel/dashboard");
  }
  if (!administrator_id) {
    navigate(`/#/admin_panel/${redirect}`);
  }

  const fetch_administrator_details = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/administrator_details/administrator_id/${administrator_id}`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({}),
    });
    const request_result = await request.json();
    set_administrator_details(request_result.administrator_details);

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

      setTimeout(() => {
        navigate(`/#/admin_panel/${redirect}`);
      }, 3000);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_administrator_details();
      document.title = "Administrator Details - Quantania Admin Panel";
    } else {
      navigate(`/admin_panel/login`);
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

      <div className="container-xl px-4 mt-4">
        <div className="row">
          <div className="col-xl-12">
            <div className="card mb-4">
              <div className="card-header text-dark d-flex justify-content-between align-items-center">
                <div>Administrator details</div>
                <div>
                  <a
                    href={`#/admin_panel/${redirect}`}
                    style={{ textDecoration: "none" }}
                  >
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ color: "white" }}
                    >
                      Back to {redirect} page
                    </button>
                  </a>
                </div>
              </div>
              <div className="card-body">
                <div
                  className="administrator_image"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <a
                    href={
                      administrator_details.administrator_image.image_url
                        ? administrator_details.administrator_image.image_url
                        : "/administrator_image_preview.png"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={
                        administrator_details.administrator_image.image_url
                          ? administrator_details.administrator_image.image_url
                          : "/administrator_image_preview.png"
                      }
                      className="rounded-circle"
                      style={{ width: "10rem", margin: "2rem 0" }}
                      alt="administrator_image"
                    />
                  </a>
                </div>
                <form>
                  <div className="mb-3">
                    <div className="row gx-3 mb-3">
                      <div className="col-md-6">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputUsername"
                        >
                          Id
                        </label>
                        <input
                          className="form-control"
                          id="inputUsername"
                          type="text"
                          value={administrator_details._id}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputUsername"
                        >
                          Username
                        </label>
                        <input
                          className="form-control"
                          id="inputUsername"
                          type="text"
                          value={administrator_details.username}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label
                        className="small mb-1 text-dark"
                        htmlFor="inputFirstName"
                      >
                        Email id
                      </label>
                      <input
                        className="form-control"
                        id="inputFirstName"
                        type="email"
                        value={administrator_details.email_id}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        className="small mb-1 text-dark"
                        htmlFor="inputLastName"
                      >
                        Mobile number
                      </label>
                      <input
                        className="form-control"
                        id="inputLastName"
                        type="number"
                        value={administrator_details.mobile_number}
                        readOnly
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdministratorDetails;
