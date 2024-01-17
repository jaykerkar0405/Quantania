import React from "react";
import { useEffect, useState } from "react";
import "../../assets/css/admin_account.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../spinner/Spinner";

const AdminAccount = () => {
  let navigate = useNavigate();
  const [admin_details, set_admin_details] = useState();

  const fetch_admin_details = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/administrator_details/authentication_token`;
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
    set_admin_details(request_result.administrator_details);

    if (request_result.result.success) {
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
  };

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_admin_details();
      document.title = "View Account - Quantania Admin Panel";
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

      {admin_details ? (
        <div className="container-xl px-4 mt-4">
          <div className="row">
            <div className="col-xl-12">
              <div className="card mb-4">
                <div className="card-header text-dark">
                  Administrator account details
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
                        admin_details.administrator_image.image_url
                          ? admin_details.administrator_image.image_url
                          : "/administrator_image_preview.png"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          admin_details.administrator_image.image_url
                            ? admin_details.administrator_image.image_url
                            : "/administrator_image_preview.png"
                        }
                        className="rounded-circle"
                        style={{ width: "10rem", margin: "2rem 0" }}
                        alt="administrator_image"
                      />
                    </a>
                  </div>
                  <form>
                    <div className="row gx-3 mb-3">
                      <div className="col-md-6 mb-3">
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
                          value={admin_details.username}
                          readOnly
                        />
                      </div>
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
                          value={admin_details.email_id}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row gx-3 mb-3">
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
                          value={admin_details.mobile_number}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputFirstName"
                        >
                          Registered on
                        </label>
                        <input
                          className="form-control"
                          id="inputFirstName"
                          type="test"
                          value={admin_details.time_stamp}
                          readOnly
                        />
                      </div>
                    </div>
                    <a
                      href="#/admin_panel/admin_account/update"
                      style={{ textDecoration: "none" }}
                    >
                      <button className="btn btn-primary" type="button">
                        Change account details or password
                      </button>
                    </a>
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

export default AdminAccount;
