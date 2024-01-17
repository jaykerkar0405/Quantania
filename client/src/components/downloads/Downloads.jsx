import React, { useState, useEffect } from "react";
import "../../assets/css/downloads.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfiniteScroll from "react-infinite-scroll-component";
import ComponentLoader from "../../layouts/loader/ComponentLoader";
import PageLoader from "../../layouts/loader/PageLoader";
import "../../assets/css/cart.scss";
import { Link, useNavigate } from "react-router-dom";

const Downloads = ({ set_progress }) => {
  const [download, set_download] = useState();
  const [result, set_result] = useState({});
  const [loading, set_loading] = useState(true);
  const [total_result, set_total_result] = useState({});
  const [current_page, set_current_page] = useState(1);
  const navigate = useNavigate();

  const fetch_download_entry = async () => {
    set_progress(25);
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/order/fetch_download_entry?page=1`;

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
    set_download(response.fetch_download_entry);
    set_total_result(response.total_result);
    set_result(response.result);
    set_loading(false);
    set_progress(100);
  };

  const fetch_more_download_entry = async () => {
    set_progress(25);
    const api_url = `${
      process.env.REACT_APP_SERVER_SIDE_URL
    }/api/order/fetch_download_entry?page=${current_page + 1}`;

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
    set_download(download.concat(response.fetch_download_entry));
    set_total_result(response.total_results);
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
        "My Downloads ||  Quantania - An efficient computer programs and application source code provider";
      fetch_download_entry();
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);

  const download_content = (element) => {
    for (let index = 0; index < element.download_link.length; index++) {
      window.open(element.download_link[index]);
    }
  };
  return (
    <>
      <ToastContainer />

      <div
        class="tab-pane fade active show"
        id="tab-downloads"
        role="tabpanel"
        aria-labelledby="tab-downloads-link"
      >
        {loading ? (
          <PageLoader />
        ) : download.length === 0 ? (
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
                  <th class="responsive-table__head__title responsive-table__head__title--order">
                    Order Id
                  </th>
                  <th class="responsive-table__head__title responsive-table__head__title--order_price">
                    Order Price
                  </th>
                  <th class="responsive-table__head__title responsive-table__head__title--placed_on">
                    Placed On
                  </th>
                  <th class="responsive-table__head__title responsive-table__head__title--action"></th>
                </tr>
              </thead>
              <InfiniteScroll
                dataLength={download.length}
                next={fetch_more_download_entry}
                hasMore={
                  total_result === undefined
                    ? false
                    : download.length !== total_result
                }
                loader={<ComponentLoader />}
                style={{ overflow: "hidden" }}
              >
                <tbody class="responsive-table__body">
                  {download.length > 0 &&
                    download.map((element) => {
                      return (
                        <tr class="responsive-table__row">
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
                            class="responsive-table__body__text responsive-table__body__text--placed_on"
                            data-title="Placed On"
                          >
                            {element.time_stamp}
                          </td>
                          <td class="responsive-table__body__text responsive-table__body__text--action">
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                download_content(element);
                              }}
                            >
                              <i className="icon-arrow-down"></i>
                            </button>
                          </td>
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

export default Downloads;
