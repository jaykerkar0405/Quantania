import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartState } from "../../context/cart/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../../layouts/loader/PageLoader";
import "../../assets/css/cart.scss";

const Cart = ({ set_progress }) => {
  let customer;

  const {
    state: { cart },
    CartDispatch,
  } = CartState();

  const cart_price = cart.reduce((accumulator, object) => {
    return accumulator + object.product_price;
  }, 0);

  let product = [];

  let total_price = (
    cart_price +
    0.01 * cart_price +
    0.02 * cart_price
  ).toFixed(2);

  let order_id = "";
  let navigate = useNavigate();

  for (let index = 0; index < cart.length; index++) {
    product.push(cart[index]._id);
  }

  const [loading, set_loading] = useState(false);

  const fetch_customer_details = async () => {
    set_progress(30);
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/customer_details`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
    });

    const request_result = await request.json();
    customer = request_result.customer_details;

    if (request_result.result.error) {
      set_loading(false);
      toast.error(request_result.result.error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      set_progress(40);
      initiate_payment();
    }
  };

  const initiate_payment = () => {
    set_loading(true);
    set_progress(50);
    const script = document.createElement("script");
    script.src = process.env.REACT_APP_RAZORPAY_PAYMENT_PAGE;

    script.onerror = () => {
      set_loading(false);
      toast.error("Razorpay SDK failed to load", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    script.onload = async () => {
      try {
        set_loading(true);

        const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/payment/razorpay_create_payment`;
        const request = await fetch(api_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_price: Math.trunc(total_price * 100),
          }),
        });
        const { currency, id } = await request.json();
        set_progress(60);

        const razorpay_key_id_api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/payment/razorpay_key_id`;
        const razorpay_key_id_request = await fetch(razorpay_key_id_api_url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { razorpay_key_id } = await razorpay_key_id_request.json();
        set_progress(70);

        const options = {
          key: razorpay_key_id,
          image: "/logo.png",
          amount: Math.trunc(total_price * 100),
          escape: false,
          currency: currency,
          name: "Paying To Quantania For Retail Purchase",
          descrption:
            "An efficient computer programs and application source code provider",
          order_id: id,
          handler: async function (response) {
            const razorpay_payment_api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/payment/razorpay_payment`;
            const razorpay_payment_request = await fetch(
              razorpay_payment_api_url,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_price: Math.trunc(total_price * 100),
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  razorpay_payment_status: true,
                  order_id: order_id,
                  customer_email_id: customer.email_id,
                }),
              }
            );
            set_progress(80);
            const razorpay_payment_response =
              await razorpay_payment_request.json();
            set_progress(90);
            if (razorpay_payment_response.result) {
              set_progress(100);
              navigate("/shopping_cart/order_confirmation", {
                state: {
                  order_details: cart,
                },
              });
              CartDispatch({
                type: "CLEAR_CART",
              });
            }
          },
          perfill: {
            name: customer.username,
            email: customer.email_id,
            contact: customer.mobile_number,
          },
        };

        set_loading(false);
        const payment_object = new window.Razorpay(options);
        payment_object.on("payment.failed", async function (response) {
          const razorpay_payment_api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/payment/razorpay_payment`;
          await fetch(razorpay_payment_api_url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_price: Math.trunc(total_price * 100),
              razorpay_payment_id: response.error.metadata.payment_id,
              razorpay_order_id: response.error.metadata.order_id,
              razorpay_payment_status: false,
              razorpay_signature: response.error.reason,
              order_id: order_id,
            }),
          });
          set_progress(100);
          payment_object.close();
          toast.error("Transaction failed, please try again after sometime", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
        payment_object.open();
      } catch (error) {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        set_loading(false);
      }
    };

    document.body.appendChild(script);
  };

  const place_order = async () => {
    set_loading(true);
    set_progress(10);
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/order/add_order_entry`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
      body: JSON.stringify({
        product: product,
        order_price: total_price,
        payment_status: "inactive",
        order_status: "inactive",
        payment_information: {
          razorpay_payment_status: " ",
          razorpay_order_price: " ",
          razorpay_order_id: " ",
          razorpay_payment_id: " ",
          razorpay_signature: " ",
        },
      }),
    });

    let response = await request.json();

    if (response.result.success) {
      set_progress(20);
      order_id = response.add_order_entry._id;
      fetch_customer_details();
    } else {
      set_loading(false);
      toast.error(
        "Failed to place the order, please try again after sometime",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      document.title =
        "Shopping Cart ||  Quantania - An efficient computer programs and application source code provider";
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
              <h1 class="page-title">Shopping Cart</h1>
            </div>
          </div>

          <nav aria-label="breadcrumb" class="breadcrumb-nav">
            <div class="container">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  <Link to="/cart">Shopping cart</Link>
                </li>
              </ol>
            </div>
          </nav>

          <div class="page-content">
            <div class="cart">
              <div class="container">
                {cart.length === 0 ? (
                  <div style={{ marginTop: "-15rem" }}>
                    <p class="title">Oh no !!</p>
                    <p class="subtitle">
                      You have no products added to the cart , <br /> explore a
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
                    <div class="col-lg-9">
                      <table class="table table-cart table-mobile">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Mrp</th>
                            <th>Price</th>
                            <th></th>
                          </tr>
                        </thead>

                        <tbody>
                          {cart.length > 0 &&
                            cart.map((element) => {
                              return (
                                <tr>
                                  <td class="product-col">
                                    <div class="product">
                                      <figure class="product-media">
                                        <Link
                                          to={`/product/product_details?product_id=${element._id}`}
                                        >
                                          <img
                                            src={
                                              element.product_image.image_url
                                            }
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
                                        <br />
                                        <small>
                                          Developer :{" "}
                                          {element.product_developer}
                                        </small>
                                      </h3>
                                    </div>
                                  </td>

                                  <td class="price-col">
                                    <Link
                                      to={`/category/category_product?category_id=${element.product_category.category_id}`}
                                    >
                                      {element.product_category.category_name}
                                    </Link>
                                  </td>
                                  <td class="price-col">
                                    Rs {element.product_mrp}
                                  </td>
                                  <td class="total-col">
                                    Rs {element.product_price}
                                  </td>

                                  <td class="remove-col">
                                    <button
                                      class="btn-remove"
                                      onClick={() => {
                                        CartDispatch({
                                          type: "REMOVE_FROM_CART",
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

                    <aside class="col-lg-3">
                      <div class="summary summary-cart">
                        <h3 class="summary-title">Cart Total</h3>

                        <table class="table table-summary">
                          <tbody>
                            <tr class="summary-subtotal">
                              <td>Subtotal : </td>
                              <td>Rs {cart_price}</td>
                            </tr>
                            <tr class="summary-subtotal">
                              <td>Tax (GST) : </td>
                              <td>Rs {(0.01 * cart_price).toFixed(2)}</td>
                            </tr>
                            <tr class="summary-subtotal">
                              <td>Payment Gateway : </td>
                              <td>Rs {(0.02 * cart_price).toFixed(2)}</td>
                            </tr>

                            <tr class="summary-total">
                              <td>Total : </td>
                              <td>Rs {total_price}</td>
                            </tr>
                          </tbody>
                        </table>

                        <a
                          // eslint-disable-next-line
                          href="javascript:void(0)"
                          class="btn btn-success btn-order btn-block"
                          onClick={place_order}
                          disabled={loading}
                        >
                          PROCEED TO PAY
                        </a>
                      </div>

                      <Link
                        to="/"
                        class="btn btn-outline-dark-2 btn-block mb-3"
                      >
                        <span>CONTINUE SHOPPING</span>
                        <i class="icon-refresh"></i>
                      </Link>
                    </aside>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Cart;
