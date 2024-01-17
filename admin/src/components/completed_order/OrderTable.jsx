import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import context from "../../contexts/order/OrderContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RefreshOutlined } from "@material-ui/icons/";
import Spinner from "../spinner/Spinner";

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import OrderTableItem from "./OrderTableItem";
import NoRecords from "../error/NoRecords";

const OrderTable = (props) => {
  let navigate = useNavigate();
  let sr_no = 0;
  const order_context = useContext(context);
  const {
    order_entry,
    request_result,
    fetch_order_entry,
    update_order_entry,
    delete_order_entry,
  } = order_context;

  const [order_entry_data, set_order_entry_data] = useState({
    id: "",
    customer: "",
    product: "",
    order_price: "",
    payment_information: "",
    payment_status: "",
    order_status: "",
  });
  const [request_result_data, set_request_result_data] = useState({});
  const [loading, set_loading] = useState(true);
  const [search_query, set_search_query] = useState("");
  const [duplicate_order_data, set_duplicate_order_data] = useState(" ");

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_order_entry();
      document.title = "Order Panel - Quantania Admin Panel";
      set_request_result_data(request_result);
      set_loading(false);
    } else {
      navigate(`/admin_panel/login`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    set_loading(false);
    if (request_result_data.success) {
      toast.success(request_result.success, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (request_result_data.error) {
      toast.error(request_result.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    //eslint-disable-next-line
  }, [request_result]);

  useEffect(() => {
    let filter_order = order_entry.filter((element) => {
      if (element._id === search_query) {
        return element;
      } else if (element.product === search_query) {
        return element;
      } else if (element.customer === search_query) {
        return element;
      } else if (element.order_price === parseInt(search_query)) {
        return element;
      }
    });

    if (filter_order) {
      set_duplicate_order_data(filter_order);
    }
  }, [search_query]);

  const update_order_entry_data = (updated_order_entry) => {
    update_order_entry_modal.current.click();
    set_order_entry_data(updated_order_entry);
  };

  const delete_order_entry_data = (deleted_order_entry) => {
    delete_order_entry_modal.current.click();
    set_order_entry_data(deleted_order_entry);
  };

  const update_order_entry_modal = useRef(null);
  const update_order_entry_modal_close = useRef(null);

  const delete_order_entry_modal = useRef(null);
  const delete_order_entry_modal_close = useRef(null);

  const submit_order_entry_update = (event) => {
    event.preventDefault();
    update_order_entry(order_entry_data._id, "active");
    update_order_entry_modal.current.click();
    set_request_result_data(request_result);
  };

  const submit_order_entry_delete = (event) => {
    event.preventDefault();
    delete_order_entry(order_entry_data._id);
    delete_order_entry_modal_close.current.click();
    set_request_result_data(request_result);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Update order entry modal */}
      <button
        ref={update_order_entry_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#update_order_entry_modal"
        style={{ display: "none" }}
      ></button>
      <div
        className="modal fade"
        id="update_order_entry_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="update_order_entry_modal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ marginTop: "10rem" }}
        >
          <div className="modal-content" style={{ marginLeft: "9rem" }}>
            <div className="modal-header">
              <h5
                className="modal-title text-black font-bold"
                id="update_category_modal"
              >
                Edit order entry
              </h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Id
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={order_entry_data._id}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Customer
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={order_entry_data.customer}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Payment status
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={"Completed"}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Order status
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={"Completed"}
                    readOnly
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={update_order_entry_modal_close}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                onClick={submit_order_entry_update}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete order entry modal */}
      <button
        ref={delete_order_entry_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#delete_order_entry_modal"
        style={{ display: "none" }}
      ></button>
      <div id="delete_order_entry_modal" className="modal fade">
        <div
          className="modal-dialog modal-confirm"
          style={{ marginTop: "10rem" }}
        >
          <div className="modal-content" style={{ marginLeft: "9rem" }}>
            <div className="modal-header flex-column">
              <h4 className="modal-title w-100">Are you sure ?</h4>
            </div>
            <div className="modal-body">
              <p>
                Do you really want to delete the "{order_entry_data._id}" order
                entry ? <br /> This process cannot be undone.
              </p>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={delete_order_entry_modal_close}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={submit_order_entry_delete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="input-group md-form form-sm form-1 pl-0"
        style={{ top: "-2rem", left: "48rem", width: "22%" }}
      >
        <input
          class="form-control"
          type="text"
          placeholder="Search order"
          aria-label="Search order"
          name="search"
          onChange={(event) => {
            set_search_query(event.target.value);
          }}
          autoComplete="off"
        />
      </div>

      <RefreshOutlined
        style={{
          cursor: "pointer",
          position: "absolute",
          top: "8.5rem",
          right: "8rem",
        }}
        onClick={() => {
          set_loading(true);
          fetch_order_entry();
        }}
      />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table
            aria-label="simple table"
            sx={{
              mt: 3,
              whiteSpace: "nowrap",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Sr. No
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Id
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Customer
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Product
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Order price
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Payment status
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order_entry.length === 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {duplicate_order_data.length === 0 && search_query.length > 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {order_entry && search_query.length === 0
                ? order_entry.map((element) => {
                    sr_no++;
                    return (
                      <OrderTableItem
                        key={element._id}
                        update_order_entry_data={update_order_entry_data}
                        delete_order_entry_data={delete_order_entry_data}
                        order_entry_data={element}
                        sr_no={sr_no}
                      />
                    );
                  })
                : duplicate_order_data.map((element) => {
                    sr_no++;
                    return (
                      <OrderTableItem
                        key={element._id}
                        update_order_entry_data={update_order_entry_data}
                        delete_order_entry_data={delete_order_entry_data}
                        order_entry_data={element}
                        sr_no={sr_no}
                      />
                    );
                  })}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};

export default OrderTable;
