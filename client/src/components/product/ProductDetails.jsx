import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartState } from "../../context/cart/CartContext";
import { WishlistState } from "../../context/wishlist/WishlistContext";
import { ComparisonState } from "../../context/comparison/CompareContext";
import PageLoader from "../../layouts/loader/PageLoader";
import { Helmet } from "react-helmet";

const ProductDetails = ({ set_progress }) => {
  const [product, set_product] = useState({
    product_category: {
      category_id: "",
      category_name: "",
    },
    product_details: "",
    product_developer: "",
    product_name: "",
    product_price: "",
    product_image: {
      image_url: "",
    },
  });
  const [result, set_result] = useState({});
  const [loading, set_loading] = useState(true);

  let navigate = useNavigate();
  let search_string = window.location.href;
  let replaced_searched_string = search_string.replace("/#/", "/");
  let url = new URL(replaced_searched_string);
  let search_params = url.searchParams;
  let product_id = search_params.get("product_id");
  if (!search_params || !product_id) {
    navigate("/");
  }

  const fetch_product_details = async () => {
    set_progress(25);

    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/product_details/customer/${product_id}`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
    });

    set_progress(50);
    const response = await request.json();
    set_progress(75);
    if (response.product_details) {
      set_product(response.product_details);
      document.title = `${response.product_details.product_name} || Products || Quantania - An efficient computer programs and application source code provider`;
    } else {
      navigate("/not_found");
    }
    set_result(response.result);
    set_loading(false);
    set_progress(100);
  };

  useEffect(() => {
    if (result.error) {
      toast.error(result.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    // eslint-disable-next-line
  }, [result]);

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      fetch_product_details();
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  const {
    state: { cart },
    CartDispatch,
  } = CartState();

  const {
    state: { wishlist },
    WishlistDispatch,
  } = WishlistState();

  const {
    state: { comparison },
    ComparisonDispatch,
  } = ComparisonState();

  const description = product.product_details
    .split("•")
    .filter((element) => element);
  return (
    <>
      <ToastContainer />

      <Helmet>
        <meta
          property="og:url"
          content={`${process.env.REACT_APP_CLIENT_SIDE_URL}/product/product_details?product_id=${product._id}`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${product.product_name} || Products || Quantania - An efficient computer programs and application source code provider`}
        />
        <meta
          property="og:description"
          content={`${product.product_details}`}
        />
        <meta property="og:image" content={product.product_image.image_url} />
      </Helmet>

      {loading ? (
        <PageLoader />
      ) : (
        <main class="main">
          <nav aria-label="breadcrumb" class="breadcrumb-nav border-0 mb-0">
            <div class="container d-flex align-items-center">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li class="breadcrumb-item">
                  <Link to="/product">Products</Link>
                </li>
                <li class="breadcrumb-item">
                  <Link
                    to={`/product.product_details?product_id=${product._id}`}
                  >
                    {product.product_name.slice(0, 20)}...
                  </Link>
                </li>
              </ol>
            </div>
          </nav>

          <div class="page-content">
            <div class="container">
              <div class="product-details-top">
                <div class="row">
                  <div class="col-md-6">
                    <div class="product-gallery product-gallery-vertical">
                      <div class="row">
                        <figure class="product-main-image">
                          <a
                            href={product.product_image.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              id="product-zoom"
                              src={product.product_image.image_url}
                              data-zoom-image={product.product_image.image_url}
                              alt="product_image"
                            />
                          </a>
                        </figure>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="product-details">
                      <h1 class="product-title">{product.product_name}</h1>

                      <div class="product-price">
                        <span className="new-price">
                          Rs {product.product_price}
                        </span>
                        <span className="old-price">
                          Was{" "}
                          <span style={{ color: "#9d1a1a" }}>
                            Rs {product.product_mrp}
                          </span>
                        </span>
                      </div>

                      <div class="product-content">
                        <span style={{ color: "white" }}>
                          Developer :{" "}
                          <span style={{ color: "gray" }}>
                            {product.product_developer}
                          </span>
                        </span>
                      </div>

                      <div class="product-details-action">
                        {cart.some((member) => member._id === product._id) ? (
                          <a
                            href="javascript:void(0)"
                            class="btn btn-danger"
                            style={{
                              backgroundColor: "red",
                              color: "white",
                            }}
                            title="Remove from cart"
                            onClick={() => {
                              CartDispatch({
                                type: "REMOVE_FROM_CART",
                                payload: product,
                              });
                            }}
                          >
                            <span>Remove from cart</span>
                          </a>
                        ) : (
                          <a
                            href="javascript:void(0)"
                            class="btn btn-primary"
                            title="Add to cart"
                            onClick={() => {
                              CartDispatch({
                                type: "ADD_TO_CART",
                                payload: product,
                              });
                            }}
                          >
                            <span>Add to cart</span>
                          </a>
                        )}

                        <div class="details-action-wrapper">
                          {wishlist.some(
                            (member) => member._id === product._id
                          ) ? (
                            <a
                              href="javascript:void(0)"
                              class="btn-product"
                              title="Remove from wishlist"
                              onClick={() => {
                                WishlistDispatch({
                                  type: "REMOVE_FROM_WISHLIST",
                                  payload: product,
                                });
                              }}
                            >
                              <i
                                className="icon-heart mr-2"
                                style={{ color: "red" }}
                              ></i>
                              <span style={{ color: "white" }}>
                                Remove → wishlist
                              </span>
                            </a>
                          ) : (
                            <a
                              href="javascript:void(0)"
                              class="btn-product"
                              title="Add to wishlist"
                              onClick={() => {
                                WishlistDispatch({
                                  type: "ADD_TO_WISHLIST",
                                  payload: product,
                                });
                              }}
                            >
                              <i
                                className="icon-heart mr-2"
                                style={{ color: "gray" }}
                              ></i>
                              <span style={{ color: "white" }}>
                                Add → wishlist
                              </span>
                            </a>
                          )}

                          {comparison.length < 3 &&
                          comparison.some(
                            (member) => member._id === product._id
                          ) ? (
                            <a
                              href="javascript:void(0)"
                              class="btn-product btn-compare"
                              title="Add to compare"
                              onClick={() => {
                                ComparisonDispatch({
                                  type: "REMOVE_FROM_COMPARE",
                                  payload: product,
                                });
                              }}
                            >
                              <span style={{ color: "white" }}>
                                Remove → compare
                              </span>
                            </a>
                          ) : (
                            <a
                              href="javascript:void(0)"
                              class="btn-product btn-compare"
                              title="Add to compare"
                              onClick={() => {
                                ComparisonDispatch({
                                  type: "ADD_TO_COMPARE",
                                  payload: product,
                                });
                              }}
                            >
                              <span style={{ color: "white" }}>
                                Add → compare
                              </span>
                            </a>
                          )}
                        </div>
                      </div>

                      <div class="product-details-footer">
                        <div class="product-cat">
                          <span>Category : </span>
                          <Link
                            to={`/category/category_product?category_id=${product.product_category.category_id}`}
                          >
                            {product.product_category.category_name}
                          </Link>
                        </div>

                        <div class="social-icons social-icons-sm">
                          <span class="social-label">Share:</span>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                              width: "14rem",
                            }}
                          >
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.REACT_APP_CLIENT_SIDE_URL}`}
                              className="social-icon"
                              target="_blank"
                              title="Facebook"
                            >
                              <i className="icon-facebook-f"></i>
                            </a>
                            <a
                              href="http://www.twitter.com/Quantania"
                              className="social-icon"
                              target="_blank"
                              title="Twitter"
                            >
                              <i className="icon-twitter"></i>
                            </a>
                            <a
                              href="http://www.instagram.com/Quantania"
                              className="social-icon"
                              target="_blank"
                              title="Instagram"
                            >
                              <i className="icon-instagram"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="product-details-tab">
                <ul class="nav nav-pills justify-content-center" role="tablist">
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      id="product-desc-link"
                      data-toggle="tab"
                      href="#product-desc-tab"
                      role="tab"
                      aria-controls="product-desc-tab"
                      aria-selected="true"
                    >
                      Description
                    </a>
                  </li>
                </ul>
                <div class="tab-content">
                  <div
                    class="tab-pane fade show active"
                    id="product-desc-tab"
                    role="tabpanel"
                    aria-labelledby="product-desc-link"
                  >
                    <div class="product-desc-content">
                      {description.map((element) => {
                        return (
                          <>
                            <li
                              style={{
                                textDecoration: "circle",
                                color: "white",
                                margin: "1rem 0",
                              }}
                            >
                              {element}
                            </li>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default ProductDetails;
