import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartState } from "../../context/cart/CartContext";
import { WishlistState } from "../../context/wishlist/WishlistContext";
import "../../assets/css/cart.scss";

const Wishlist = () => {
  const navigate = useNavigate();

  const {
    state: { wishlist },
    WishlistDispatch,
  } = WishlistState();

  const {
    state: { cart },
    CartDispatch,
  } = CartState();

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      document.title =
        "Wishlist ||  Quantania - An efficient computer programs and application source code provider";
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <main class="main">
      <div class="page-header text-center">
        <div class="container">
          <h1 class="page-title">Wishlist</h1>
        </div>
      </div>

      <nav aria-label="breadcrumb" class="breadcrumb-nav">
        <div class="container">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              <Link to="/wishlist">Wishlist</Link>
            </li>
          </ol>
        </div>
      </nav>

      <div class="page-content">
        <div class="cart">
          <div class="container">
            {wishlist.length === 0 ? (
              <div style={{ marginTop: "-15rem" }}>
                <p class="title">Oh no !!</p>
                <p class="subtitle">
                  You have no products added to the wishlist , <br /> explore a
                  wide variety of products.
                </p>
                <div align="center">
                  <Link to={"/"} class="btn-back">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div class="row">
                <div class="col-lg-12">
                  <table class="table table-cart table-mobile">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Mrp</th>
                        <th>Price</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {wishlist.length > 0 &&
                        wishlist.map((element) => {
                          return (
                            <tr>
                              <td class="product-col">
                                <div class="product">
                                  <figure class="product-media">
                                    <Link
                                      to={`/product/product_details?product_id=${element._id}`}
                                    >
                                      <img
                                        src={element.product_image.image_url}
                                        alt="product_image"
                                      />
                                    </Link>
                                  </figure>

                                  <h3 class="product-title">
                                    <Link
                                      to={`/product/product_details?product_id=${element._id}`}
                                    >
                                      {element.product_name}
                                    </Link>
                                  </h3>
                                </div>
                              </td>
                              <td class="price-col">
                                Rs {element.product_mrp}
                              </td>
                              <td class="total-col">
                                Rs {element.product_price}
                              </td>

                              <td class="action-col">
                                {cart.some(
                                  (member) => member._id === element._id
                                ) ? (
                                  <button
                                    class="btn btn-block btn-outline-danger"
                                    onClick={() => {
                                      CartDispatch({
                                        type: "REMOVE_FROM_CART",
                                        payload: element,
                                      });
                                    }}
                                  >
                                    <i class="icon-cart-minus"></i>Remove from
                                    cart
                                  </button>
                                ) : (
                                  <button
                                    class="btn btn-block btn-outline-primary-2"
                                    onClick={() => {
                                      CartDispatch({
                                        type: "ADD_TO_CART",
                                        payload: element,
                                      });
                                    }}
                                  >
                                    <i class="icon-cart-plus"></i>Add to Cart
                                  </button>
                                )}
                              </td>
                              <td class="remove-col">
                                <button
                                  class="btn-remove"
                                  onClick={() => {
                                    WishlistDispatch({
                                      type: "REMOVE_FROM_WISHLIST",
                                      payload: element,
                                    });
                                  }}
                                >
                                  <i class="icon-close"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Wishlist;
