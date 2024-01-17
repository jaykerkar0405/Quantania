import React from "react";
import { useEffect, useState } from "react";
import "../../assets/css/banner_details.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../spinner/Spinner";

const BannerDetails = () => {
  let navigate = useNavigate();
  const [banner_details, set_banner_details] = useState({
    banner_image: {
      image_url: "/image_preview.jpg",
    },
  });
  const [loading, set_loading] = useState(true);

  let search_string = window.location.href;
  let replaced_searched_string = search_string.replace("/#/", "/");
  let url = new URL(replaced_searched_string);
  let search_params = url.searchParams;
  let banner_id = search_params.get("banner_id");
  let redirect = search_params.get("redirect");
  if (!redirect || !search_params) {
    navigate("/#/admin_panel/dashboard");
  }
  if (!banner_id) {
    navigate(`/#/admin_panel/${redirect}`);
  }

  const fetch_banner_details = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/banner/banner_details/${banner_id}`;
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
    set_banner_details(request_result.banner_details);
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
      fetch_banner_details();
      document.title = "Banner Details - Quantania Admin Panel";
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
                  <div style={{ fontWeight: "bold" }}>Banner details</div>
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
                  <div class="blog-single gray-bg">
                    <div class="container">
                      <div class="row align-items-start">
                        <div class="col-lg-12 m-15px-tb">
                          <article class="article">
                            <div
                              className="banner_image"
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <a
                                href={
                                  banner_details.banner_image.image_url
                                    ? banner_details.banner_image.image_url
                                    : "/administrator_image_preview.png"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={
                                    banner_details.banner_image.image_url
                                      ? banner_details.banner_image.image_url
                                      : "/administrator_image_preview.png"
                                  }
                                  className="rounded-circle"
                                  style={{ width: "10rem", margin: "2rem 0" }}
                                  alt="banner_image"
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
                                    Banner title
                                  </label>
                                  <input
                                    className="form-control"
                                    id="inputUsername"
                                    type="text"
                                    value={banner_details.banner_title}
                                    readOnly
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label
                                    className="small mb-1 text-dark"
                                    htmlFor="inputFirstName"
                                  >
                                    Button text
                                  </label>
                                  <input
                                    className="form-control"
                                    id="inputFirstName"
                                    type="text"
                                    value={banner_details.button_text}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="row gx-3 mb-3">
                                <div className="col-md-4">
                                  <label
                                    className="small mb-1 text-dark"
                                    htmlFor="inputLastName"
                                  >
                                    Banner registrar
                                  </label>
                                  <a
                                    href={`#/admin_panel/administrator_details?administrator_id=${banner_details.banner_registrar}&redirect=banner`}
                                    style={{
                                      textDecoration: "none",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input
                                      className="form-control"
                                      id="inputLastName"
                                      type="text"
                                      value={banner_details.banner_registrar}
                                      readOnly
                                      style={{ cursor: "pointer" }}
                                    />
                                  </a>
                                </div>
                                <div className="col-md-4">
                                  <label
                                    className="small mb-1 text-dark"
                                    htmlFor="inputFirstName"
                                  >
                                    Banner updater
                                  </label>

                                  <a
                                    href={
                                      banner_details.banner_updater
                                      ? `#/admin_panel/administrator_details?administrator_id=${banner_details.banner_updater}&redirect=banner`
                                      // eslint-disable-next-line
                                      : `javascript:void(0)`
                                    }
                                    style={{
                                      textDecoration: "none",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input
                                      className="form-control"
                                      id="inputFirstName"
                                      type="test"
                                      value={
                                        banner_details.banner_updater
                                          ? banner_details.banner_updater
                                          : "Banner not updated yet"
                                      }
                                      style={{ cursor: "pointer" }}
                                      readOnly
                                    />
                                  </a>
                                </div>
                                <div className="col-md-4">
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
                                    value={banner_details.time_stamp}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </form>
                          </article>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BannerDetails;
