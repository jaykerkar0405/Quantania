import React from "react";
import { useEffect, useState } from "react";
import "../../assets/css/category_details.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../spinner/Spinner";

const CategoryDetails = () => {
  let navigate = useNavigate();
  const [category_details, set_category_details] = useState({
    category_image: {
      image_url: "/image_preview.jpg",
    },
  });
  const [loading, set_loading] = useState(true);

  let search_string = window.location.href;
  let replaced_searched_string = search_string.replace("/#/", "/");
  let url = new URL(replaced_searched_string);
  let search_params = url.searchParams;
  let category_id = search_params.get("category_id");
  let redirect = search_params.get("redirect");
  if (!redirect || !search_params) {
    navigate("/#/admin_panel/dashboard");
  }
  if (!category_id) {
    navigate(`/#/admin_panel/${redirect}`);
  }

  const fetch_category_details = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/category_details/${category_id}`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const request_result = await request.json();
    set_category_details(request_result.category_details);
    set_loading(false);

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
      fetch_category_details();
      document.title = "Category Details - Quantania Admin Panel";
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

      {loading ? (
        <Spinner />
      ) : (
        <div className="container-xl px-4 mt-4">
          <div className="row">
            <div className="col-xl-12">
              <div className="card mb-4">
                <div className="card-header text-dark d-flex justify-content-between align-items-center">
                  <div style={{ fontWeight: "bold" }}>Category details</div>
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
                    className="category_image"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <a
                      href={category_details.category_image.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={category_details.category_image.image_url}
                        className="rounded-circle"
                        style={{ width: "10rem", margin: "2rem 0" }}
                        alt="category_image"
                      />
                    </a>
                  </div>
                  <form>
                    <div className="row gx-3 mt-3">
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
                          value={category_details._id}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputUsername"
                        >
                          Name
                        </label>
                        <input
                          className="form-control"
                          id="inputUsername"
                          type="text"
                          value={category_details.category_name}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row gx-3 mt-3">
                      <div className="col-md-6">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputFirstName"
                        >
                          Status
                        </label>
                        <input
                          className="form-control"
                          id="inputFirstName"
                          type="text"
                          value={
                            category_details.category_status === "active"
                              ? "Active"
                              : "Inactive"
                          }
                          readOnly
                        />
                      </div>

                      <div className="col-md-6">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputUsername"
                        >
                          Registered On
                        </label>
                        <input
                          className="form-control"
                          id="inputUsername"
                          type="text"
                          value={category_details.time_stamp}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row gx-3 mt-3">
                      <div className="col-md-6">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputFirstName"
                        >
                          Registrar
                        </label>
                        <input
                          className="form-control"
                          id="inputFirstName"
                          type="text"
                          value={category_details.category_registrar}
                          readOnly
                        />
                      </div>

                      <div className="col-md-6">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputUsername"
                        >
                          Updater
                        </label>
                        <input
                          className="form-control"
                          id="inputUsername"
                          type="text"
                          value={category_details.category_updater}
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
      )}
    </>
  );
};

export default CategoryDetails;
