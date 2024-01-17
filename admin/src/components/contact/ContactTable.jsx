import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import context from "../../contexts/contact/ContactContext";
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
import ContactTableItem from "./ContactTableItem";
import NoRecords from "../error/NoRecords";

const ContactTable = () => {
  let navigate = useNavigate();
  let sr_no = 0;
  const contact_context = useContext(context);
  const {
    contact_entry,
    request_result,
    fetch_contact_entry,
    resolve_contact_entry,
    delete_contact_entry,
  } = contact_context;

  let initial_state = {
    sr_no: "",
    username: "",
    email_id: "",
    subject: "",
    message: "",
    solution: "",
    status: "",
  };

  const [contact_entry_data, set_contact_entry_data] = useState(initial_state);

  const [request_result_data, set_request_result_data] = useState({});
  const [loading, set_loading] = useState(true);
  const [search_query, set_search_query] = useState("");
  const [duplicate_contact_data, set_duplicate_contact_data] = useState(" ");

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_contact_entry();
      document.title = "Contact Panel - Quantania Admin Panel";
      set_request_result_data(request_result);
      set_loading(false);
    } else {
      navigate(`/admin_panel/login`);
    }
    //eslint-disable-next-line
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
    let filter_contact_entry = contact_entry.filter((element) => {
      if (element._id === search_query) {
        return element;
      } else if (element.username === search_query) {
        return element;
      } else if (element.email_id === search_query) {
        return element;
      } else {
        return element;
      }
    });

    if (filter_contact_entry) {
      set_duplicate_contact_data(filter_contact_entry);
    }
    // eslint-disable-next-line
  }, [search_query]);

  const resolve_contact_entry_data = (resolved_contact_entry) => {
    resolve_contact_entry_modal.current.click();
    set_contact_entry_data(resolved_contact_entry);
  };

  const delete_contact_entry_data = (deleted_contact_entry) => {
    delete_contact_entry_modal.current.click();
    set_contact_entry_data(deleted_contact_entry);
  };

  const resolve_contact_entry_modal = useRef(null);
  const resolve_contact_entry_modal_close = useRef(null);

  const delete_contact_entry_modal = useRef(null);
  const delete_contact_entry_modal_close = useRef(null);

  const submit_contact_entry_resolve = (event) => {
    event.preventDefault();
    resolve_contact_entry(contact_entry_data._id, contact_entry_data.solution);
    resolve_contact_entry_modal_close.current.click();
    set_contact_entry_data(initial_state);
    set_request_result_data(request_result);
  };

  const submit_contact_entry_delete = (event) => {
    event.preventDefault();
    delete_contact_entry(contact_entry_data._id);
    delete_contact_entry_modal_close.current.click();
    set_request_result_data(request_result);
  };

  const set_value = (event) => {
    set_contact_entry_data({
      ...contact_entry_data,
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

      {/* Resolve contact entry modal */}
      <button
        ref={resolve_contact_entry_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#resolve_contact_entry_modal"
        style={{ display: "none" }}
      ></button>
      <div
        className="modal fade"
        id="resolve_contact_entry_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="resolve_contact_entry_modal"
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
                id="resolve_contact_entry_modal"
              >
                Resolve contact entry
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
                    value={contact_entry_data._id}
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
                    value={contact_entry_data.username}
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
                    value={contact_entry_data.email_id}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={contact_entry_data.subject}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Solution
                  </label>
                  <textarea
                    name="solution"
                    id="solution"
                    rows="4"
                    className="form-control"
                    placeholder="Enter the solution for resolving the contact entry"
                    onChange={set_value}
                    value={contact_entry_data.solution}
                    autoComplete="off"
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={resolve_contact_entry_modal_close}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                onClick={submit_contact_entry_resolve}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete contact entry modal */}
      <button
        ref={delete_contact_entry_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#delete_contact_entry_modal"
        style={{ display: "none" }}
      ></button>
      <div id="delete_contact_entry_modal" className="modal fade">
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
                Do you really want to delete the "{contact_entry_data._id}"
                contact entry ? <br /> This process cannot be undone.
              </p>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={delete_contact_entry_modal_close}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={submit_contact_entry_delete}
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
          placeholder="Search contact entry"
          aria-label="Search contact entry"
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
          fetch_contact_entry();
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
                    Email id
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Subject
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Message
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
              {contact_entry.length === 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {duplicate_contact_data.length === 0 && search_query.length > 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {contact_entry && search_query.length === 0
                ? contact_entry.map((element) => {
                    sr_no++;
                    return (
                      <ContactTableItem
                        key={element._id}
                        resolve_contact_entry_data={resolve_contact_entry_data}
                        delete_contact_entry_data={delete_contact_entry_data}
                        contact_entry_data={element}
                        sr_no={sr_no}
                      />
                    );
                  })
                : duplicate_contact_data.map((element) => {
                    sr_no++;
                    return (
                      <ContactTableItem
                        key={element._id}
                        resolve_contact_entry_data={resolve_contact_entry_data}
                        delete_contact_entry_data={delete_contact_entry_data}
                        contact_entry_data={element}
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

export default ContactTable;
