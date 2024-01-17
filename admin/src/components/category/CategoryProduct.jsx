import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoRecords from "../error/NoRecords";
import Spinner from "../spinner/Spinner";
import { Chip } from "@material-ui/core";

const CategoryProduct = () => {
  let navigate = useNavigate();
  const [category_product, set_category_product] = useState();
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

  const fetch_category_product = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/category_product/administrator/${category_id}`;
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
    set_category_product(request_result.category_product);
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
      fetch_category_product();
      document.title = "Category Product - Quantania Admin Panel";
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
                  <div className="text-bold" style={{ fontWeight: "bold" }}>
                    Category Product
                  </div>
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
                <section style={{ backgroundColor: "#eee" }}>
                  <div className="text-center container py-5">
                    <div className="row">
                      {category_product.length === 0 && (
                        <div style={{ marginRight: "-62rem" }}>
                          <NoRecords />
                        </div>
                      )}
                      {category_product.map((element) => {
                        return (
                          <div className="col-lg-4 col-md-12 mb-4">
                            <div className="card">
                              <div
                                className="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                                data-mdb-ripple-color="light"
                              >
                                <a
                                  href={element.product_image.image_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={element.product_image.image_url}
                                    className="w-50"
                                    style={{ marginTop: "2rem" }}
                                    alt="product_image"
                                  />
                                </a>
                                <div className="mask">
                                  <div className="d-flex justify-content-between align-items-end h-100">
                                    <h5>
                                      <span className="badge bg-primary ms-2">
                                        {Math.round(
                                          ((element.product_mrp -
                                            element.product_price) /
                                            element.product_mrp) *
                                            100
                                        )}
                                        % Discount
                                      </span>
                                    </h5>
                                    <Chip
                                      sx={{
                                        pl: "4px",
                                        pr: "4px",
                                        backgroundColor:
                                          element.status === "active"
                                            ? "success.main"
                                            : "error.main",
                                        color: "#fff",
                                      }}
                                      size="small"
                                      label={
                                        element.status === "active"
                                          ? "Active"
                                          : "Inactive"
                                      }
                                      style={{
                                        marginBottom: "0.5rem",
                                        marginRight: "1rem",
                                        height: "2rem",
                                        width: "6rem",
                                        fontSize: "1rem",
                                      }}
                                    ></Chip>
                                  </div>
                                </div>
                                <div className="hover-overlay">
                                  <div
                                    className="mask"
                                    style={{
                                      backgroundColor:
                                        "rgba(251, 251, 251, 0.15)",
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="card-body">
                                <a
                                  href={`#/admin_panel/product_details?product_id=${element._id}&redirect=category`}
                                  className="text-reset"
                                  style={{ textDecoration: "none" }}
                                >
                                  <h5 className="card-title mb-3">
                                    {element.product_name}
                                  </h5>
                                </a>
                                <a
                                  href={`#/admin_panel/administrator_details?administrator_id=${element.product_registrar}&redirect=category`}
                                  className="text-reset"
                                  style={{ textDecoration: "none" }}
                                >
                                  Registered by:{" "}
                                  <p>{element.product_registrar}</p>
                                </a>
                                <h6 className="mb-3">
                                  <s>Rs {element.product_mrp}</s>
                                  <strong className="ms-2 text-success">
                                    Rs {element.product_price}
                                  </strong>
                                </h6>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryProduct;
