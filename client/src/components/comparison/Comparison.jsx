import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ComparisonState } from "../../context/comparison/CompareContext";
import { CartState } from "../../context/cart/CartContext";
import "../../assets/css/comparison.css";
import "../../assets/css/cart.scss";

const Comparison = () => {
  const navigate = useNavigate();

  const {
    state: { comparison },
    ComparisonDispatch,
  } = ComparisonState();

  const {
    state: { cart },
    CartDispatch,
  } = CartState();

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      document.write =
        "Compare Products ||  Quantania - An efficient computer programs and application source code provider";
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <main className="main">
      <div class="page-header text-center">
        <div class="container">
          <h1 class="page-title">Compare Products</h1>
        </div>
      </div>

      <nav aria-label="breadcrumb" class="breadcrumb-nav">
        <div class="container">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              <Link to="/compare_product">Compare Products</Link>
            </li>
          </ol>
        </div>
      </nav>

      {comparison.length > 0 ? (
        <div class="container pb-5 mb-2">
          <div class="comparison-table">
            <table class="table table-bordered">
              <thead class="bg-secondary">
                <tr>
                  <td class="align-middle">Products</td>

                  {comparison.length > 0 &&
                    comparison.map((element) => {
                      return (
                        <td>
                          <div class="comparison-item">
                            <span
                              class="remove-item"
                              onClick={() => {
                                ComparisonDispatch({
                                  type: "REMOVE_FROM_COMPARE",
                                  payload: element,
                                });
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-x"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </span>
                            <Link
                              class="comparison-item-thumb"
                              to={`/product/product_details?product_id=${element._id}`}
                            >
                              <img
                                src={element.product_image.image_url}
                                alt="product_image"
                              />
                            </Link>
                            <Link
                              class="comparison-item-title"
                              to={`/product/product_details?product_id=${element._id}`}
                            >
                              {element.product_name}
                            </Link>
                            {cart.some(
                              (member) => member._id === element._id
                            ) ? (
                              <button
                                class="btn btn-pill btn-outline-danger btn-sm"
                                type="button"
                                data-toggle="toast"
                                data-target="#cart-toast"
                                title="Remove from cart"
                                onClick={() => {
                                  CartDispatch({
                                    type: "REMOVE_FROM_CART",
                                    payload: element,
                                  });
                                }}
                              >
                                Remove from cart
                              </button>
                            ) : (
                              <button
                                class="btn btn-pill btn-outline-primary btn-sm"
                                type="button"
                                data-toggle="toast"
                                data-target="#cart-toast"
                                title="Add to cart"
                                onClick={() => {
                                  CartDispatch({
                                    type: "ADD_TO_CART",
                                    payload: element,
                                  });
                                }}
                              >
                                Add to cart
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                </tr>
              </thead>

              <tbody id="compare-product" data-filter="target">
                <tr class="bg-secondary">
                  <th class="text-uppercase">Name</th>
                  {comparison.length > 0 &&
                    comparison.map((element) => {
                      return (
                        <td>
                          <span class="text-dark font-weight-semibold">
                            {element.product_name}
                          </span>
                        </td>
                      );
                    })}
                </tr>
                <tr>
                  <th>Category</th>
                  {comparison.length > 0 &&
                    comparison.map((element) => {
                      return (
                        <Link
                          to={`/category/category_product?category_id=${element.product_category.category_id}`}
                        >
                          <td>{element.product_category.category_name}</td>
                        </Link>
                      );
                    })}
                </tr>
                <tr>
                  <th>Price</th>
                  {comparison.length > 0 &&
                    comparison.map((element) => {
                      return <td>Rs {element.product_price}</td>;
                    })}
                </tr>
                <tr>
                  <th>Mrp</th>
                  {comparison.length > 0 &&
                    comparison.map((element) => {
                      return <td>Rs {element.product_mrp}</td>;
                    })}
                </tr>
                <tr>
                  <th>Developer</th>
                  {comparison.length > 0 &&
                    comparison.map((element) => {
                      return <td>{element.product_developer}</td>;
                    })}
                </tr>
                <tr>
                  <th>Featured</th>
                  {comparison.length > 0 &&
                    comparison.map((element) => {
                      return <td>{element.featured_product ? "Yes" : "No"}</td>;
                    })}
                </tr>
                <tr>
                  <th>Description</th>
                  {comparison.length > 0 &&
                    comparison.map((element) => {
                      return <td>{element.product_details}</td>;
                    })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "-15rem", height: "30rem" }}>
          <p class="title">Oh no !!</p>
          <p class="subtitle">
            You have no products added to the compare , <br /> explore a wide
            variety of products.
          </p>
          <div align="center">
            <Link to={"/"} class="btn-back">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default Comparison;
