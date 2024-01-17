import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import context from "../../contexts/customer/CustomerContext";
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
import CustomerTableItem from "./CustomerTableItem";

const CustomerTable = () => {
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

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_administrator();

      if (request_result.success) {
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

      if (request_result.error) {
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
    } else {
      navigate(`/admin_panel/login`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (request_result.success) {
      toast.success(request_result.success, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      update_administrator_modal_close.current.click();
    } else {
      if (request_result.error) {
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
    }
  };

  const submit_administrator_delete = (event) => {
    event.preventDefault();
    delete_administrator(administrator_data._id);
    delete_administrator_modal_close.current.click();

    if (request_result.success) {
      toast.success(request_result.success, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      if (request_result.error) {
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
    }
  };

  const setValue = (event) => {
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
          <div className="modal-content" style={{ marginLeft: "9rem" }} style={{ margin: "0 9rem" }}>
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
                    Username: {administrator_data.username}
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Email id: {administrator_data.email_id}
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Mobile number: {administrator_data.mobile_number}
                  </label>
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
                    onChange={setValue}
                  >
                    <option
                      value="active"
                      {...(administrator_data.status === "active"
                        ? "selected"
                        : "")}
                    >
                      Active
                    </option>
                    <option
                      value="inactive"
                      {...(administrator_data.status === "inactive"
                        ? "selected"
                        : "")}
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
          <div className="modal-content" style={{ marginLeft: "9rem" }} style={{ margin: "0 9rem" }}>
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
              <Typography color="textDark" variant="h6"></Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {administrator.length === 0 && "No administrator found"}
          {administrator.map((element) => {
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
  );
};

export default CustomerTable;
