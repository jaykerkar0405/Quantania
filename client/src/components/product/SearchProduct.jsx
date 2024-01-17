import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams, Link, useNavigate } from "react-router-dom";
import ComponentLoader from "../../layouts/loader/ComponentLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartState } from "../../context/cart/CartContext";
import { WishlistState } from "../../context/wishlist/WishlistContext";
import PageLoader from "../../layouts/loader/PageLoader";
import "../../assets/css/cart.scss";

const SearchProduct = ({ set_progress }) => {
  let { keyword } = useParams();

  const [product, set_product] = useState([]);
  const [result, set_result] = useState({});
  const [loading, set_loading] = useState(true);
  const [total_result, set_total_result] = useState(0);
  const [current_page, set_current_page] = useState(1);
  const navigate = useNavigate();

  const fetch_product = async () => {
    set_progress(25);

    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/fetch_product/customer?keyword=${keyword}&page=1`;
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
    set_product(response.product);
    set_total_result(response.total_result);
    set_result(response.result);
    set_loading(false);
    set_progress(100);
  };

  const fetch_more_product = async () => {
    set_progress(25);

    const api_url = `${
      process.env.REACT_APP_SERVER_SIDE_URL
    }/api/product/fetch_product/customer?keyword=${keyword}&page=${
      current_page + 1
    }`;
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
    set_product(product.concat(response.product));
    set_total_result(response.total_result);
    set_result(response.result);
    set_current_page(current_page + 1);
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
      document.title = `${keyword} || Search Products || Quantania - An efficient computer programs and application source code provider`;
      fetch_product();
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, [keyword]);

  const {
    state: { cart },
    CartDispatch,
  } = CartState();

  const {
    state: { wishlist },
    WishlistDispatch,
  } = WishlistState();

  return (
    <>
      <ToastContainer />

      {loading ? (
        <PageLoader />
      ) : (
        <main class="main">
          <div class="page-header text-center">
            <div class="container">
              <h1 class="page-title">
                Explore a wide variety of products
                <span>Cost effective products</span>
              </h1>
            </div>
          </div>

          <nav aria-label="breadcrumb" class="breadcrumb-nav mb-2">
            <div class="container">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li class="breadcrumb-item active">
                  <Link to="/product">Products</Link>
                </li>
                <li class="breadcrumb-item active">
                  <a href="javascript:void(0)">Search Products</a>
                </li>
              </ol>
            </div>
          </nav>

          <div class="page-content">
            {product.length === 0 ? (
              <div style={{ marginTop: "-15rem" }}>
                <p class="title">Oh no !!</p>
                <p class="subtitle">
                  No products found for your search , <br /> try entering a
                  different search value.
                </p>
                <div align="center">
                  <Link to={"/"} class="btn-back">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={product.length}
                next={fetch_more_product}
                hasMore={product.length !== total_result}
                loader={<ComponentLoader />}
              >
                <div class="container">
                  <div className="toolbox">
                    <div className="toolbox-left"></div>
                    <div class="toolbox-center">
                      <div class="toolbox-info">
                        Showing{" "}
                        <span>
                          {product.length} of {total_result}
                        </span>{" "}
                        products
                      </div>
                    </div>
                    <div className="toolbox-right"></div>
                  </div>
                  <div class="products">
                    <div class="row">
                      {product.length > 0 &&
                        product.map((element) => {
                          const current_time = new Date();
                          const time_stamp = new Date(element.time_stamp);

                          return (
                            <div className="col-6 col-md-4 col-lg-4 col-xl-3">
                              <div className="product">
                                <figure className="product-media">
                                  {current_time - time_stamp <= 631963908 ? (
                                    <span className="product-label label-new">
                                      New
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                  <Link
                                    to={`/product/product_details?product_id=${element._id}`}
                                  >
                                    <img
                                      src={element.product_image.image_url}
                                      alt="product_image"
                                      className="product-image"
                                    />
                                  </Link>

                                  <div className="product-action action-icon-top">
                                    {cart.some(
                                      (member) => member._id === element._id
                                    ) ? (
                                      <a
                                        href="javascript:void(0)"
                                        className="btn-product btn-cart"
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
                                        href="javascript:void(0)"
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

                                    {wishlist.some(
                                      (member) => member._id === element._id
                                    ) ? (
                                      <a
                                        href="javascript:void(0)"
                                        className="btn-product btn-wishlist"
                                        title="Remove from wishlist"
                                        onClick={() => {
                                          WishlistDispatch({
                                            type: "REMOVE_FROM_WISHLIST",
                                            payload: element,
                                          });
                                        }}
                                      >
                                        <span>Remove 🠖 wishlist</span>
                                      </a>
                                    ) : (
                                      <a
                                        href="javascript:void(0)"
                                        className="btn-product btn-wishlist"
                                        title="Add to wishlist"
                                        onClick={() => {
                                          WishlistDispatch({
                                            type: "ADD_TO_WISHLIST",
                                            payload: element,
                                          });
                                        }}
                                      >
                                        <span>Add 🠖 wishlist</span>
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
                                      to={`/product/product_details?product_id=${element._id}`}
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
              </InfiniteScroll>
            )}
          </div>
        </main>
      )}
    </>
  );
};

export default SearchProduct;
