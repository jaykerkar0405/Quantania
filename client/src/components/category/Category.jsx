import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfiniteScroll from "react-infinite-scroll-component";
import ComponentLoader from "../../layouts/loader/ComponentLoader";
import PageLoader from "../../layouts/loader/PageLoader";

const Category = ({ set_progress }) => {
  const [category, set_category] = useState([]);
  const [result, set_result] = useState({});
  const [loading, set_loading] = useState(true);
  const [total_result, set_total_result] = useState(0);
  const [current_page, set_current_page] = useState(1);
  const navigate = useNavigate();

  const fetch_category = async () => {
    set_progress(25);

    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/fetch_category/customer?page=1`;
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
    set_category(response.category);
    set_total_result(response.total_result);
    set_result(response.result);
    set_loading(false);
    set_progress(100);
  };

  const fetch_more_category = async () => {
    set_progress(25);

    const api_url = `${
      process.env.REACT_APP_SERVER_SIDE_URL
    }/api/category/fetch_category/customer?page=${current_page + 1}`;
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
    set_category(category.concat(response.category));
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
        "Categories ||  Quantania - An efficient computer programs and application source code provider";
      fetch_category();
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
      ) : (
        <main class="main">
          <div class="page-header text-center">
            <div class="container">
              <h1 class="page-title">
                Deep dive into our categories
                <span>Explore the collections</span>
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
              </ol>
            </div>
          </nav>

          <div class="page-content">
            <InfiniteScroll
              dataLength={category.length}
              next={fetch_more_category}
              hasMore={category.length !== total_result}
              loader={<ComponentLoader />}
            >
              <div class="container">
                <div className="toolbox">
                  <div className="toolbox-left"></div>
                  <div class="toolbox-center">
                    <div class="toolbox-info">
                      Showing{" "}
                      <span>
                        {category.length} of {total_result}
                      </span>{" "}
                      categories
                    </div>
                  </div>
                  <div className="toolbox-right"></div>
                </div>
                <div class="products">
                  <div class="row">
                    {category.length > 0 &&
                      category.map((element) => {
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
                                  to={`/category/category_product?category_id=${element._id}`}
                                >
                                  <img
                                    src={element.category_image.image_url}
                                    alt="category_image"
                                    class="product-image"
                                  />
                                </Link>

                                <div class="product-action action-icon-top">
                                  <Link
                                    to={`/category/category_product?category_id=${element._id}`}
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
                                    to={`/category/category_product?category_id=${element._id}`}
                                  >
                                    {element.category_name}
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

export default Category;
