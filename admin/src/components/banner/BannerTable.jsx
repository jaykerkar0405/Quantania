import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import context from "../../contexts/banner/BannerContext";
import { AddToPhotosOutlined, RefreshOutlined } from "@material-ui/icons/";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../spinner/Spinner";

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import BannerTableItem from "./BannerTableItem";
import NoRecords from "../error/NoRecords";

const BannerTable = (props) => {
  let navigate = useNavigate();
  let id = 0;
  const banner_context = useContext(context);
  const {
    banner,
    request_result,
    fetch_banner,
    add_banner,
    update_banner,
    delete_banner,
  } = banner_context;

  const [banner_data, set_banner_data] = useState({
    id: "",
    banner_title: "",
    button_text: "",
    button_link: "",
    banner_status: "",
    banner_image: "",
  });

  const [request_result_data, set_request_result_data] = useState({});
  const [banner_image, set_banner_image] = useState("/image_preview.jpg");
  const [banner_image_preview, set_banner_image_preview] =
    useState("/image_preview.jpg");
  const [loading, set_loading] = useState(true);
  const [search_query, set_search_query] = useState("");
  const [duplicate_banner_data, set_duplicate_banner_data] = useState(" ");

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_banner();
      document.title = "Banner Panel - Quantania Admin Panel";
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
    let filter_banner = banner.filter((element) => {
      if (element._id === search_query) {
        return element;
      } else if (element.banner_title === search_query) {
        return element;
      } else if (element.button_text === search_query) {
        return element;
      } else if (element.banner_status === search_query) {
        return element;
      } else {
        return element;
      }
    });

    if (filter_banner) {
      set_duplicate_banner_data(filter_banner);
    }
    // eslint-disable-next-line
  }, [search_query]);

  const add_banner_data = () => {
    add_banner_modal.current.click();
  };

  const update_banner_data = (updated_banner) => {
    update_banner_modal.current.click();
    set_banner_data(updated_banner);
  };

  const delete_banner_data = (deleted_banner) => {
    delete_banner_modal.current.click();
    set_banner_data(deleted_banner);
  };

  const add_banner_modal = useRef(null);
  const add_banner_modal_close = useRef(null);
  const add_modal_reset_button = useRef(null);

  const update_banner_modal = useRef(null);
  const update_banner_modal_close = useRef(null);

  const delete_banner_modal = useRef(null);
  const delete_banner_modal_close = useRef(null);

  const submit_banner_add = (event) => {
    event.preventDefault();
    if (banner_data.banner_title.length >= 5) {
      add_banner(banner_data, banner_image);
      set_request_result_data(request_result);
      set_banner_image_preview("/image_preview.jpg");
      add_modal_reset_button.current.click();
      banner_data.length = 0;
      add_banner_modal_close.current.click();
    } else {
      if (
        banner_data.banner_title.length === 0 ||
        banner_data.banner_title.length < 5
      ) {
        toast.error(
          "Please enter a valid banner title of minimum 5 characters",
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
    }
  };

  const submit_banner_update = (event) => {
    event.preventDefault();
    update_banner(banner_data, banner_image);
    update_banner_modal.current.click();
    set_request_result_data(request_result);
    set_banner_image_preview("/image_preview.jpg");
  };

  const submit_banner_delete = (event) => {
    event.preventDefault();
    delete_banner(banner_data);
    delete_banner_modal_close.current.click();
    set_request_result_data(request_result);
  };

  const set_value = (event) => {
    if (event.target.name === "banner_image") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          set_banner_image(reader.result);
          set_banner_image_preview(reader.result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      set_banner_data({
        ...banner_data,
        [event.target.name]: event.target.value,
      });
    }
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

      {/* Add banner modal */}
      <button
        ref={add_banner_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#add_banner_modal"
        style={{ display: "none" }}
      ></button>
      <div
        className="modal fade"
        id="add_banner_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="addModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          style={{ marginTop: "10rem" }}
          role="document"
        >
          <div className="modal-content" style={{ marginLeft: "9rem" }}>
            <div className="modal-header">
              <h5
                className="modal-title text-black font-bold"
                id="addModalLabel"
              >
                Add banner
              </h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Banner title
                  </label>
                  <input
                    type="text"
                    name="banner_title"
                    className="form-control"
                    id="banner_title"
                    placeholder="Enter banner title"
                    onChange={set_value}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Button text
                  </label>
                  <input
                    type="text"
                    name="button_text"
                    className="form-control"
                    id="button_text"
                    placeholder="Enter button text"
                    onChange={set_value}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Button link
                  </label>
                  <textarea
                    name="button_link"
                    className="form-control"
                    id="button_link"
                    placeholder="Enter button link"
                    onChange={set_value}
                    autoComplete="off"
                    cols={3}
                  />
                </div>
                <div className="mb-3 mt-3">
                  <label for="formFile" className="form-label">
                    Banner image
                  </label>
                  <img
                    src={banner_image_preview}
                    alt=""
                    style={{ margin: "5px 5rem", width: "5rem" }}
                  />
                  <input
                    className="form-control"
                    type="file"
                    name="banner_image"
                    accept="image/*"
                    onChange={set_value}
                    id="banner_image"
                  />
                </div>
                <input
                  type="reset"
                  ref={add_modal_reset_button}
                  style={{ display: "none" }}
                />
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={add_banner_modal_close}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                onClick={submit_banner_add}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update banner modal */}
      <button
        ref={update_banner_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#update_banner_modal"
        style={{ display: "none" }}
      ></button>
      <div
        className="modal fade"
        id="update_banner_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="update_banner_modal"
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
                id="update_banner_modal"
              >
                Edit banner
              </h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Banner title
                  </label>
                  <input
                    type="text"
                    name="banner_title"
                    className="form-control"
                    id="banner_title"
                    value={banner_data.banner_title}
                    onChange={set_value}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Button text
                  </label>
                  <input
                    type="text"
                    name="button_text"
                    className="form-control"
                    id="button_text"
                    value={banner_data.button_text}
                    onChange={set_value}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Button link
                  </label>
                  <textarea
                    name="button_link"
                    className="form-control"
                    id="button_link"
                    value={banner_data.button_link}
                    onChange={set_value}
                    autoComplete="off"
                    cols={3}
                  />
                </div>
                <div className="mb-3 mt-3">
                  <label for="formFile" className="form-label">
                    Banner image
                  </label>
                  <img
                    src={banner_image_preview}
                    alt=""
                    style={{ margin: "5px 5rem", width: "5rem" }}
                  />
                  <input
                    className="form-control"
                    type="file"
                    name="banner_image"
                    accept="image/*"
                    onChange={set_value}
                    id="banner_image"
                  />
                </div>
                <div className="input-group mt-4 mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Banner status
                    </label>
                  </div>
                  <select
                    className="custom-select"
                    name="banner_status"
                    id="banner_status"
                    onChange={set_value}
                    style={{ width: "20rem", padding: "0rem 1rem" }}
                  >
                    <option
                      value="active"
                      selected={
                        banner_data.banner_status === "active" ? false : true
                      }
                    >
                      Active
                    </option>
                    <option
                      value="inactive"
                      selected={
                        banner_data.banner_status === "active" ? false : true
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
                ref={update_banner_modal_close}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                onClick={submit_banner_update}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete banner modal */}
      <button
        ref={delete_banner_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#delete_banner_modal"
        style={{ display: "none" }}
      ></button>
      <div id="delete_banner_modal" className="modal fade">
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
                Do you really want to delete the "{banner_data.banner_title}"
                banner ? <br /> This process cannot be undone.
              </p>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={delete_banner_modal_close}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={submit_banner_delete}
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
          placeholder="Search banner"
          aria-label="Search banner"
          name="search"
          onChange={(event) => {
            set_search_query(event.target.value);
          }}
          autoComplete="off"
        />
      </div>

      <AddToPhotosOutlined
        color="secondary"
        style={{
          cursor: "pointer",
          position: "absolute",
          top: "8.5rem",
          right: "8rem",
        }}
        onClick={() => {
          add_banner_data();
        }}
      />

      <RefreshOutlined
        style={{
          position: "absolute",
          right: "5rem",
          top: "8.5rem",
          cursor: "pointer",
        }}
        onClick={() => {
          set_loading(true);
          fetch_banner();
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
                    Banner title
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Banner image
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Button text
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
              {banner.length === 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {duplicate_banner_data.length === 0 && search_query.length > 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {banner && search_query.length === 0
                ? banner &&
                  banner.map((element) => {
                    id++;
                    return (
                      <BannerTableItem
                        key={element._id}
                        add_banner_data={add_banner_data}
                        update_banner_data={update_banner_data}
                        delete_banner_data={delete_banner_data}
                        banner_data={element}
                        preview_image={set_banner_image_preview}
                        id={id}
                      />
                    );
                  })
                : duplicate_banner_data.map((element) => {
                    id++;
                    return (
                      <BannerTableItem
                        key={element._id}
                        add_banner_data={add_banner_data}
                        update_banner_data={update_banner_data}
                        delete_banner_data={delete_banner_data}
                        banner_data={element}
                        preview_image={set_banner_image_preview}
                        id={id}
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

export default BannerTable;
