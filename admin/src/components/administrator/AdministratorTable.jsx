import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import context from "../../contexts/administrator/AdministratorContext";
import { RefreshOutlined } from "@material-ui/icons/";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import AdministratorTableItem from "./AdministratorTableItem";
import NoRecords from "../error/NoRecords";
import Spinner from "../spinner/Spinner";

const AdministratorTable = () => {
  let navigate = useNavigate();
  let sr_no = 0;
  const administrator_context = useContext(context);
  const {
    administrator,
    request_result,
    fetch_administrator,
    update_administrator,
    delete_administrator,
  } = administrator_context;

  const [administrator_data, set_administrator_data] = useState({
    sr_no: "",
    username: "",
    email_id: "",
    mobile_number: "",
    status: "",
  });
  const [request_result_data, set_request_result_data] = useState({});
  const [loading, set_loading] = useState(true);
  const [search_query, set_search_query] = useState("");
  const [duplicate_administrator_data, set_duplicate_administrator_data] =
    useState(" ");

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      document.title = "Administrator Panel - Quantania Admin Panel";
      fetch_administrator();
      set_request_result_data(request_result);
      set_loading(false);
    } else {
      navigate(`/admin_panel/login`);
    }
    // eslint-disable-next-line
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
    // eslint-disable-next-line
  }, [request_result]);

  useEffect(() => {
    let filter_administrator = administrator.filter((element) => {
      if (element._id === search_query) {
        return element;
      } else if (element.username === search_query) {
        return element;
      } else if (element.email_id === search_query) {
        return element;
      } else if (element.mobile_number === parseInt(search_query)) {
        return element;
      } else if (element.status === search_query) {
        return element;
      } else {
        return element;
      }
    });

    if (filter_administrator) {
      set_duplicate_administrator_data(filter_administrator);
    }
    // eslint-disable-next-line
  }, [search_query]);

  const update_administrator_data = (updated_administrator) => {
    update_administrator_modal.current.click();
    set_administrator_data(updated_administrator);
  };

  const delete_administrator_data = (deleted_administrator) => {
    delete_administrator_modal.current.click();
    set_administrator_data(deleted_administrator);
  };

  const update_administrator_modal = useRef(null);
  const update_administrator_modal_close = useRef(null);

  const delete_administrator_modal = useRef(null);
  const delete_administrator_modal_close = useRef(null);

  const submit_administrator_update = (event) => {
    event.preventDefault();
    update_administrator(
      administrator_data._id,
      administrator_data.administrator_status
    );
    update_administrator_modal_close.current.click();
    set_request_result_data(request_result);
  };

  const submit_administrator_delete = (event) => {
    event.preventDefault();
    delete_administrator(administrator_data._id);
    delete_administrator_modal_close.current.click();
    set_request_result_data(request_result);
  };

  const set_value = (event) => {
    set_administrator_data({
      ...administrator_data,
      [event.target.name]: event.target.value,
    });
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

      {/* Update administrator modal */}
      <button
        ref={update_administrator_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#update_administrator_modal"
        style={{ display: "none" }}
      ></button>
      <div
        className="modal fade"
        id="update_administrator_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="update_administrator_modal"
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
                id="update_administrator_modal"
              >
                Edit administrator
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
                    value={administrator_data._id}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={administrator_data.username}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Email id
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={administrator_data.email_id}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Mobile number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={administrator_data.mobile_number}
                    readOnly
                  />
                </div>
                <div className="input-group mt-4 mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Status
                    </label>
                  </div>
                  <select
                    className="custom-select"
                    name="administrator_status"
                    id="administrator_status"
                    onChange={set_value}
                    style={{ width: "24rem", padding: "0rem 1rem" }}
                  >
                    <option
                      value="active"
                      selected={
                        administrator_data.status === "active" ? false : true
                      }
                    >
                      Active
                    </option>
                    <option
                      selected={
                        administrator_data.status === "active" ? false : true
                      }
                    >
                      Inactive
                    </option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={update_administrator_modal_close}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                onClick={submit_administrator_update}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete administrator modal */}
      <button
        ref={delete_administrator_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#delete_administrator_modal"
        style={{ display: "none" }}
      ></button>
      <div id="delete_administrator_modal" className="modal fade">
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
                Do you really want to delete the "{administrator_data.username}"
                administrator ? <br /> This process cannot be undone.
              </p>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={delete_administrator_modal_close}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={submit_administrator_delete}
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
          placeholder="Search administrator"
          aria-label="Search administrator"
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
          fetch_administrator();
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
                    Username
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Image
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Email id
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Mobile number
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Status
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
              {administrator.length === 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {duplicate_administrator_data.length === 0 &&
                search_query.length > 0 && (
                  <div style={{ marginRight: "-62rem" }}>
                    <NoRecords />
                  </div>
                )}
              {administrator && search_query.length === 0
                ? administrator.map((element) => {
                    sr_no++;
                    return (
                      <AdministratorTableItem
                        key={element._id}
                        update_administrator_data={update_administrator_data}
                        delete_administrator_data={delete_administrator_data}
                        administrator_data={element}
                        sr_no={sr_no}
                      />
                    );
                  })
                : duplicate_administrator_data.map((element) => {
                    sr_no++;
                    return (
                      <AdministratorTableItem
                        key={element._id}
                        update_administrator_data={update_administrator_data}
                        delete_administrator_data={delete_administrator_data}
                        administrator_data={element}
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

export default AdministratorTable;
