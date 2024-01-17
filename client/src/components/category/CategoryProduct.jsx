import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfiniteScroll from "react-infinite-scroll-component";
import ComponentLoader from "../../layouts/loader/ComponentLoader";
import PageLoader from "../../layouts/loader/PageLoader";
import "../../assets/css/cart.scss";

const CategoryProduct = ({ set_progress }) => {
  const [category_product, set_category_product] = useState([
    {
      product_category: {
        category_name: "",
      },
      product_image: {
        image_url: "",
      },
    },
  ]);
  const [result, set_result] = useState({});
  const [loading, set_loading] = useState(true);
  const [total_result, set_total_result] = useState(0);
  const [current_page, set_current_page] = useState(1);

  let navigate = useNavigate();
  let search_string = window.location.href;
  let replaced_searched_string = search_string.replace("/#/", "/");
  let url = new URL(replaced_searched_string);
  let search_params = url.searchParams;
  let category_id = search_params.get("category_id");
  if (!search_params || !category_id) {
    navigate("/");
  }

  const fetch_category_product = async () => {
    set_progress(25);

    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/category_product/customer/${category_id}?page=1`;
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
    set_category_product(response.category_product);
    set_total_result(response.total_result);
    set_result(response.result);
    set_loading(false);
    set_progress(100);
  };

  const fetch_more_category_product = async () => {
    set_progress(25);

    const api_url = `${
      process.env.REACT_APP_SERVER_SIDE_URL
    }/api/category/category_product/customer/${category_id}?page=${
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
    set_category_product(category_product.concat(response.category_product));
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
      document.title =
        category_product[0].product_category.category_name ||
        "Not Found" +
          " || Categories ||  Quantania - An efficient computer programs and application source code provider";
      fetch_category_product();
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);
  return (
    <>
      <ToastContainer />

      {loading ? (
        <PageLoader />
      ) : category_product.length === 0 ? (
        <div style={{ marginTop: "-15rem", height: "30rem" }}>
          <p class="title">Oh no !!</p>
          <p class="subtitle">
            No products added to this category yet , <br /> try exploring a
            different category.
          </p>
          <div align="center">
            <Link to={"/"} class="btn-back">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <main class="main">
          <div class="page-header text-center">
            <div class="container">
              <h1 class="page-title">
                Browse the variety of products
                <span>
                  View products related to{" "}
                  {category_product[0].product_category.category_name}
                </span>
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
                  <Link to="/category">Categories</Link>
                </li>
                <li class="breadcrumb-item active">
                  <Link
                    to={`/category_product?category_id=${category_product[0].product_category.category_id}`}
                  >
                    {category_product[0].product_category.category_name}
                  </Link>
                </li>
              </ol>
            </div>
          </nav>

          <div class="page-content">
            <InfiniteScroll
              dataLength={category_product.length}
              next={fetch_more_category_product}
              hasMore={category_product.length !== total_result}
              loader={<ComponentLoader />}
            >
              <div class="container">
                <div className="toolbox">
                  <div className="toolbox-left"></div>
                  <div class="toolbox-center">
                    <div class="toolbox-info">
                      Showing{" "}
                      <span>
                        {category_product.length} of {total_result}
                      </span>{" "}
                      products
                    </div>
                  </div>
                  <div className="toolbox-right"></div>
                </div>
                <div class="products">
                  <div class="row">
                    {category_product.length > 0 &&
                      category_product.map((element) => {
                        const current_time = new Date();
                        const time_stamp = new Date(element.time_stamp);

                        return (
                          <div class="col-6 col-md-4 col-lg-4 col-xl-3">
                            <div class="product">
                              <figure class="product-media">
                                {current_time - time_stamp <= 631963908 ? (
                                  <span class="product-label label-new">
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
                                    alt="category_product_image"
                                    class="product-image"
                                  />
                                </Link>

                                <div class="product-action action-icon-top">
                                  <Link
                                    to={`/product/product_details?product_id=${element._id}`}
                                    class="btn-product btn-quickview"
                                    title="Quick view"
                                  >
                                    <span>Quick view</span>
                                  </Link>
                                </div>
                              </figure>

                              <div class="product-body">
                                <h3 class="product-title">
                                  <Link
                                    to={`/product/product_details?product_id=${element._id}`}
                                  >
                                    {element.product_name}
                                  </Link>
                                </h3>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </InfiniteScroll>
          </div>
        </main>
      )}
    </>
  );
};

export default CategoryProduct;
