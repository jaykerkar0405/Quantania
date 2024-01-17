import React, { useState, useEffect } from "react";
import "../../assets/css/orders.scss";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfiniteScroll from "react-infinite-scroll-component";
import ComponentLoader from "../../layouts/loader/ComponentLoader";
import PageLoader from "../../layouts/loader/PageLoader";
import "../../assets/css/cart.scss";

const Orders = ({ set_progress }) => {
  const [order, set_order] = useState([]);
  const [result, set_result] = useState({});
  const [loading, set_loading] = useState(true);
  const [total_result, set_total_result] = useState(0);
  const [current_page, set_current_page] = useState(1);
  const navigate = useNavigate();

  const fetch_order_entry = async () => {
    set_progress(25);
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/order/fetch_order_entry/customer?page=1`;

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
    set_order(response.fetch_order_entry);
    set_total_result(response.total_results);
    set_result(response.result);
    set_loading(false);
    set_progress(100);
  };

  const fetch_more_order_entry = async () => {
    set_progress(25);
    const api_url = `${
      process.env.REACT_APP_SERVER_SIDE_URL
    }/api/order/fetch_order_entry/customer?page=${current_page + 1}`;

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
    set_order(order.concat(response.fetch_order_entry));
    set_total_result(response.total_result);
    set_result(response.result);
    set_current_page(current_page + 1);
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
      document.title =
        "My Orders ||  Quantania - An efficient computer programs and application source code provider";
      fetch_order_entry();
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />

      <div
        class="tab-pane fade active show"
        id="tab-orders"
        role="tabpanel"
        aria-labelledby="tab-orders-link"
      >
        {loading ? (
          <PageLoader />
        ) : order.length === 0 ? (
          <div style={{ marginTop: "-20rem" }}>
            <p class="title">Oh no !!</p>
            <p class="subtitle">
              You have not placed any order , <br /> take a view on our products
              now !!.
            </p>
            <div align="center">
              <Link to={"/"} class="btn-back">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div class="table-container">
            <table class="responsive-table">
              <thead class="responsive-table__head">
                <tr class="responsive-table__row">
                  <th
                    class="responsive-table__head__title responsive-table__head__title--order_id"
                    data-title="Order Id"
                  >
                    Order Id
                  </th>
                  <th
                    class="responsive-table__head__title responsive-table__head__title--order_price"
                    data-title="Order Price"
                  >
                    Order Price
                  </th>
                  <th
                    class="responsive-table__head__title responsive-table__head__title--payment_status"
                    data-title="Order Payment Status"
                  >
                    Payment Status
                  </th>
                  <th
                    class="responsive-table__head__title responsive-table__head__title--placed_on"
                    data-title="Placed On"
                  >
                    Placed On
                  </th>
                  <th class="responsive-table__head__title responsive-table__head__title--action"></th>
                </tr>
              </thead>

              <InfiniteScroll
                dataLength={order.length}
                next={fetch_more_order_entry}
                hasMore={order.length !== total_result}
                loader={<ComponentLoader />}
                style={{ overflow: "none" }}
              >
                <tbody class="responsive-table__body">
                  {order.length > 0 &&
                    order.map((element, key) => {
                      return (
                        <tr class="responsive-table__row" key={key}>
                          <td
                            class="responsive-table__body__text responsive-table__body__text--order_id"
                            data-title="Order Id"
                          >
                            {element._id}
                          </td>
                          <td
                            class="responsive-table__body__text responsive-table__body__text--order_price"
                            data-title="Order Price"
                          >
                            Rs {element.order_price}
                          </td>
                          <td
                            class="responsive-table__body__text responsive-table__body__text--payment_status"
                            data-title="Payment Status"
                          >
                            <span
                              class={`status-indicator status-indicator--${
                                element.payment_status === "active"
                                  ? "active"
                                  : "new"
                              }`}
                            ></span>
                            {element.payment_status === "active"
                              ? "Completed"
                              : "Pending"}
                          </td>
                          <td
                            class="responsive-table__body__text responsive-table__body__text--placed_on"
                            data-title="Placed On"
                          >
                            {element.time_stamp}
                          </td>
                          {element.payment_status === "active" ? (
                            <td class="responsive-table__body__text responsive-table__body__text--action">
                              <button
                                class="btn btn-success"
                                style={{ minWidth: "155px" }}
                                onClick={() => {
                                  navigate("/orders/order_details", {
                                    state: {
                                      order_details: element,
                                    },
                                  });
                                }}
                              >
                                View details
                                <i className="icon-redirect"></i>
                              </button>
                            </td>
                          ) : (
                            ""
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </InfiniteScroll>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
