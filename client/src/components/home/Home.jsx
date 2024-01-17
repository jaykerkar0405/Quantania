import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderHome from "../slider/Slider";
import { CartState } from "../../context/cart/CartContext";
import { WishlistState } from "../../context/wishlist/WishlistContext";
import { ComparisonState } from "../../context/comparison/CompareContext";
import PageLoader from "../../layouts/loader/PageLoader";

const Home = ({ set_progress }) => {
  const [category, set_category] = useState({
    _id: "",
    category_name: "",
    category_image: {
      image_url: "",
    },
  });
  const [banner, set_banner] = useState({
    _id: "",
    banner_title: "",
    button_text: "",
    button_link: "",
    banner_image: {
      image_url: "",
    },
  });
  const [new_arrivals, set_new_arrivals] = useState({
    _id: "",
    product_name: "",
    product_mrp: "",
    product_price: "",
    product_image: {
      image_url: "",
    },
    product_category: {
      category_id: "",
      category_name: "",
    },
  });
  const [featured_product, set_featured_product] = useState({
    _id: "",
    product_name: "",
    product_mrp: "",
    product_price: "",
    product_image: {
      image_url: "",
    },
    product_category: {
      category_id: "",
      category_name: "",
    },
  });
  const [result, set_result] = useState({});
  const [category_loading, set_category_loading] = useState(true);
  const [bannner_loading, set_banner_loading] = useState(true);
  const [new_arrivals_loading, set_new_arrivals_loading] = useState(true);
  const [featured_products_loading, set_featured_products_loading] =
    useState(true);
  const navigate = useNavigate();

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

  const fetch_category = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/fetch_category/customer?limit=6`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
    });

    const response = await request.json();
    set_category(response.category);
    set_result(response.result);
    set_progress(25);
    set_category_loading(false);
  };

  const fetch_banner = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/banner/fetch_banner/customer`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
    });

    const response = await request.json();
    set_banner(response.banner);
    set_result(response.result);
    set_progress(50);
    set_banner_loading(false);
  };

  const fetch_new_arrivals = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/fetch_new_arrivals?limit=8`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
    });

    const response = await request.json();
    set_new_arrivals(response.new_arrivals);
    set_result(response.result);
    set_progress(75);
    set_new_arrivals_loading(false);
  };

  const fetch_featured_product = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/fetch_featured_product/customer?limit=8`;

    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
    });

    const response = await request.json();
    set_featured_product(response.featured_product);
    set_result(response.result);
    set_progress(100);
    set_featured_products_loading(false);
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
      document.title =
        "Home || Quantania - An efficient computer programs and application source code provider";
      fetch_category();
      fetch_banner();
      fetch_new_arrivals();
      fetch_featured_product();
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />

      {category_loading ||
      bannner_loading ||
      new_arrivals_loading ||
      featured_products_loading ? (
        <PageLoader />
      ) : (
        <main className="main">
          {banner.length > 0 && (
            <div className="intro-slider-container mb-5">
              <SliderHome banner={banner} />
            </div>
          )}

          {category.length > 0 && (
            <div className="container" id="category">
              <h2 className="title text-center mb-4" style={{ color: "white" }}>
                Explore Popular Categories
              </h2>

              <div className="cat-blocks-container">
                <div className="row">
                  {category.map((element) => {
                    return (
                      <div className="col-6 col-sm-4 col-lg-2">
                        <Link
                          to={`/category/category_product?category_id=${element._id}`}
                          className="cat-block"
                        >
                          <figure>
                            <span>
                              <img
                                src={element.category_image.image_url}
                                alt="category_image"
                              />
                            </span>
                          </figure>

                          <h3
                            className="cat-block-title"
                            style={{ color: "white" }}
                          >
                            {element.category_name}
                          </h3>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="mb-4"></div>

          {banner.length > 0 && (
            <div className="container">
              <div className="row justify-content-center">
                {banner.slice(0, 3).map((element) => {
                  return (
                    <div className="col-md-6 col-lg-4">
                      <div className="banner banner-overlay banner-overlay-light">
                        <a
                          href={element.banner_image.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={element.banner_image.image_url}
                            alt="banner_image"
                          />
                        </a>

                        <div className="banner-content">
                          <h3 className="banner-title">
                            <a // eslint-disable-next-line
                              href="javascript:void(0)"
                            >
                              <strong>{element.banner_title}</strong>
                            </a>
                          </h3>
                          <a
                            href={element.button_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="banner-link"
                          >
                            {element.button_text}
                            <i className="icon-long-arrow-right"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-3"></div>

          {new_arrivals.length > 0 && (
            <div className="container new-arrivals" id="new-arrivals">
              <div className="heading heading-flex mb-3">
                <div className="heading-left">
                  <h2 className="title">New Arrivals</h2>
                </div>

                <div className="heading-right">
                  <Link to="/product/new_arrivals" className="title-link">
                    View All Newly Arrived Products{" "}
                    <i className="icon-long-arrow-right"></i>
                  </Link>
                </div>
              </div>

              <div className="products">
                <div className="row justify-content-center">
                  {new_arrivals.map((element) => {
                    return (
                      <div className="col-6 col-md-4 col-lg-3">
                        <div className="product product-2">
                          <figure className="product-media">
                            <Link
                              to={`product/product_details?product_id=${element._id}`}
                            >
                              <img
                                src={element.product_image.image_url}
                                alt="product_image"
                                className="product-image"
                              />
                            </Link>

                            <div className="product-action-vertical">
                              {wishlist.some(
                                (member) => member._id === element._id
                              ) ? (
                                <i
                                  className="btn-product-icon icon-heart"
                                  title="Remove from wishlist"
                                  style={{ cursor: "pointer", color: "red" }}
                                  onClick={() => {
                                    WishlistDispatch({
                                      type: "REMOVE_FROM_WISHLIST",
                                      payload: element,
                                    });
                                  }}
                                ></i>
                              ) : (
                                <i
                                  className="btn-product-icon icon-heart"
                                  title="Add to wishlist"
                                  style={{ cursor: "pointer", color: "gray" }}
                                  onClick={() => {
                                    WishlistDispatch({
                                      type: "ADD_TO_WISHLIST",
                                      payload: element,
                                    });
                                  }}
                                ></i>
                              )}
                            </div>

                            <div className="product-action">
                              {cart.some(
                                (member) => member._id === element._id
                              ) ? (
                                <a
                                  // eslint-disable-next-line
                                  href="javascript:void(0)"
                                  className="btn-product btn-cart"
                                  sztyle={{ display: "block" }}
                                  title="Remove from cart"
                                  onClick={() => {
                                    CartDispatch({
                                      type: "REMOVE_FROM_CART",
                                      payload: element,
                                    });
                                  }}
                                >
                                  <span>Remove 🠖 cart</span>
                                </a>
                              ) : (
                                <a
                                  href="javacript:void(0)"
                                  className="btn-product btn-cart"
                                  title="Add to cart"
                                  onClick={() => {
                                    CartDispatch({
                                      type: "ADD_TO_CART",
                                      payload: element,
                                    });
                                  }}
                                >
                                  <span>Add 🠖 cart</span>
                                </a>
                              )}

                              {comparison.length < 3 &&
                              comparison.some(
                                (member) => member._id === element._id
                              ) ? (
                                <a
                                  // eslint-disable-next-line
                                  href="javascript:void(0)"
                                  className="btn-product btn-compare"
                                  title="Add to compare"
                                  onClick={() => {
                                    ComparisonDispatch({
                                      type: "REMOVE_FROM_COMPARE",
                                      payload: element,
                                    });
                                  }}
                                >
                                  <span>Remove 🠖 compare</span>
                                </a>
                              ) : (
                                <a
                                  // eslint-disable-next-line
                                  href="javascript:void(0)"
                                  className="btn-product btn-compare"
                                  title="Add to compare"
                                  onClick={() => {
                                    ComparisonDispatch({
                                      type: "ADD_TO_COMPARE",
                                      payload: element,
                                    });
                                  }}
                                >
                                  <span>Add 🠖 compare</span>
                                </a>
                              )}
                            </div>
                          </figure>

                          <div className="product-body">
                            <div className="product-cat">
                              <Link
                                to={`/category/category_product?category_id=${element.product_category.category_id}`}
                              >
                                {element.product_category.category_name}
                              </Link>
                            </div>
                            <h3 className="product-title">
                              <Link
                                to={`product/product_details?product_id=${element._id}`}
                              >
                                {element.product_name}
                              </Link>
                            </h3>
                            <div className="product-price">
                              <span className="new-price">
                                Rs {element.product_price}
                              </span>
                              <span className="old-price">
                                Was{" "}
                                <span style={{ color: "#9d1a1a" }}>
                                  Rs {element.product_mrp}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6"></div>

          {featured_product.length > 0 && (
            <div className="container for-you" id="featured-product">
              <div className="heading heading-flex mb-3">
                <div className="heading-left">
                  <h2 className="title">Featured Products</h2>
                </div>

                <div className="heading-right">
                  <Link to="/product/featured_product" className="title-link">
                    View All Featured Products{" "}
                    <i className="icon-long-arrow-right"></i>
                  </Link>
                </div>
              </div>

              <div className="products">
                <div className="row justify-content-center">
                  {featured_product.map((element) => {
                    return (
                      <div className="col-6 col-md-4 col-lg-3">
                        <div className="product product-2">
                          <figure className="product-media">
                            <Link
                              to={`product/product_details?product_id=${element._id}`}
                            >
                              <img
                                src={element.product_image.image_url}
                                alt="product_image"
                                className="product-image"
                              />
                            </Link>

                            <div className="product-action-vertical">
                              {wishlist.some(
                                (member) => member._id === element._id
                              ) ? (
                                <i
                                  className="btn-product-icon icon-heart"
                                  title="Remove from wishlist"
                                  style={{ cursor: "pointer", color: "red" }}
                                  onClick={() => {
                                    WishlistDispatch({
                                      type: "REMOVE_FROM_WISHLIST",
                                      payload: element,
                                    });
                                  }}
                                ></i>
                              ) : (
                                <i
                                  className="btn-product-icon icon-heart"
                                  title="Add to wishlist"
                                  style={{ cursor: "pointer", color: "gray" }}
                                  onClick={() => {
                                    WishlistDispatch({
                                      type: "ADD_TO_WISHLIST",
                                      payload: element,
                                    });
                                  }}
                                ></i>
                              )}
                            </div>

                            <div className="product-action">
                              {cart.some(
                                (member) => member._id === element._id
                              ) ? (
                                <a
                                  // eslint-disable-next-line
                                  href="javascript:void(0)"
                                  className="btn-product btn-cart"
                                  sztyle={{ display: "block" }}
                                  title="Remove from cart"
                                  onClick={() => {
                                    CartDispatch({
                                      type: "REMOVE_FROM_CART",
                                      payload: element,
                                    });
                                  }}
                                >
                                  <span>Remove 🠖 cart</span>
                                </a>
                              ) : (
                                <a
                                  href="javacript:void(0)"
                                  className="btn-product btn-cart"
                                  title="Add to cart"
                                  onClick={() => {
                                    CartDispatch({
                                      type: "ADD_TO_CART",
                                      payload: element,
                                    });
                                  }}
                                >
                                  <span>Add 🠖 cart</span>
                                </a>
                              )}

                              {comparison.length < 3 &&
                              comparison.some(
                                (member) => member._id === element._id
                              ) ? (
                                <a
                                  // eslint-disable-next-line
                                  href="javascript:void(0)"
                                  className="btn-product btn-compare"
                                  title="Add to compare"
                                  onClick={() => {
                                    ComparisonDispatch({
                                      type: "REMOVE_FROM_COMPARE",
                                      payload: element,
                                    });
                                  }}
                                >
                                  <span>Remove 🠖 compare</span>
                                </a>
                              ) : (
                                <a
                                  // eslint-disable-next-line
                                  href="javascript:void(0)"
                                  className="btn-product btn-compare"
                                  title="Add to compare"
                                  onClick={() => {
                                    ComparisonDispatch({
                                      type: "ADD_TO_COMPARE",
                                      payload: element,
                                    });
                                  }}
                                >
                                  <span>Add 🠖 compare</span>
                                </a>
                              )}
                            </div>
                          </figure>

                          <div className="product-body">
                            <div className="product-cat">
                              <Link
                                to={`/category/category_product?category_id=${element.product_category.category_id}`}
                              >
                                {element.product_category.category_name}
                              </Link>
                            </div>
                            <h3 className="product-title">
                              <Link
                                to={`product/product_details?product_id=${element._id}`}
                              >
                                {element.product_name}
                              </Link>
                            </h3>
                            <div className="product-price">
                              <span className="new-price">
                                Rs {element.product_price}
                              </span>
                              <span className="old-price">
                                Was{" "}
                                <span style={{ color: "#9d1a1a" }}>
                                  Rs {element.product_mrp}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="mb-4"></div>

          <div className="container">
            <hr className="mb-0" />
          </div>

          <div className="icon-boxes-container bg-transparent">
            <div className="container">
              <div className="row">
                <div className="col-sm-6 col-lg-3">
                  <div className="icon-box icon-box-side">
                    <span className="icon-box-icon">
                      <i className="icon-rocket"></i>
                    </span>
                    <div className="icon-box-content">
                      <h3 className="icon-box-title">Hassle free payments</h3>
                      <p>Easy payment methods</p>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                  <div className="icon-box icon-box-side">
                    <span className="icon-box-icon">
                      <i className="icon-rotate-left"></i>
                    </span>

                    <div className="icon-box-content">
                      <h3 className="icon-box-title">User friendly ordering</h3>
                      <p>Simple ordering process</p>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                  <div className="icon-box icon-box-side">
                    <span className="icon-box-icon">
                      <i className="icon-info-circle"></i>
                    </span>

                    <div className="icon-box-content">
                      <h3 className="icon-box-title">Feel free to contact</h3>
                      <p>Ask our experts</p>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                  <div className="icon-box icon-box-side">
                    <span className="icon-box-icon">
                      <i className="icon-life-ring"></i>
                    </span>

                    <div className="icon-box-content">
                      <h3 className="icon-box-title">Tell about us</h3>
                      <p>To your friends and family</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <hr className="mb-0" />
            </div>
          </div>

          <div className="mb-4"></div>
        </main>
      )}
    </>
  );
};

export default Home;
