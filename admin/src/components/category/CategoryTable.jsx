import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import context from "../../contexts/category/CategoryContext";
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
import CategoryTableItem from "./CategoryTableItem";
import NoRecords from "../error/NoRecords";

const CategoryTable = (props) => {
  let navigate = useNavigate();
  let id = 0;
  const category_context = useContext(context);
  const {
    category,
    request_result,
    fetch_category,
    add_category,
    update_category,
    delete_category,
  } = category_context;

  const [category_data, set_category_data] = useState({
    id: "",
    category_name: "",
    category_status: "",
    category_image: "",
  });
  const [request_result_data, set_request_result_data] = useState({});
  const [category_image, set_category_image] = useState("/image_preview.jpg");
  const [category_image_preview, set_category_image_preview] =
    useState("/image_preview.jpg");
  const [loading, set_loading] = useState(true);
  const [search_query, set_search_query] = useState("");
  const [duplicate_category_data, set_duplicate_category_data] = useState(" ");

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_category();
      document.title = "Category Panel - Quantania Admin Panel";
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
    let filter_category = category.filter((element) => {
      if (element._id === search_query) {
        return element;
      } else if (element.category_name === search_query) {
        return element;
      } else if (element.category_status === search_query) {
        return element;
      } else {
        return element;
      }
    });

    if (filter_category) {
      set_duplicate_category_data(filter_category);
    }
    // eslint-disable-next-line
  }, [search_query]);

  const add_category_data = () => {
    add_category_modal.current.click();
  };

  const update_category_data = (updated_category) => {
    update_category_modal.current.click();
    set_category_data(updated_category);
  };

  const delete_category_data = (deleted_category) => {
    delete_category_modal.current.click();
    set_category_data(deleted_category);
  };

  const add_category_modal = useRef(null);
  const add_category_modal_close = useRef(null);
  const add_modal_reset_button = useRef(null);

  const update_category_modal = useRef(null);
  const update_category_modal_close = useRef(null);

  const delete_category_modal = useRef(null);
  const delete_category_modal_close = useRef(null);

  const submit_category_add = (event) => {
    event.preventDefault();
    if (category_data.category_name.length >= 5) {
      add_category(category_data.category_name, category_image);
      set_request_result_data(request_result);
      set_category_image_preview("/image_preview.jpg");
      add_modal_reset_button.current.click();
      category_data.length = 0;
      add_category_modal_close.current.click();
    } else {
      if (
        category_data.category_name.length === 0 ||
        category_data.category_name.length < 5
      ) {
        toast.error(
          "Please enter a valid category name of minimum 5 characters",
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

  const submit_category_update = (event) => {
    event.preventDefault();
    update_category(
      category_data._id,
      category_data.category_name,
      category_data.category_status,
      category_image
    );
    update_category_modal.current.click();
    set_request_result_data(request_result);
    set_category_image_preview("/image_preview.jpg");
  };

  const submit_category_delete = (event) => {
    event.preventDefault();
    delete_category(category_data._id);
    delete_category_modal_close.current.click();
    set_request_result_data(request_result);
  };

  const setValue = (event) => {
    if (event.target.name === "category_image") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          set_category_image(reader.result);
          set_category_image_preview(reader.result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      set_category_data({
        ...category_data,
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

      {/* Add category modal */}
      <button
        ref={add_category_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#add_category_modal"
        style={{ display: "none" }}
      ></button>
      <div
        className="modal fade"
        id="add_category_modal"
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
                Add category
              </h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Category name
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    className="form-control"
                    id="category_name"
                    placeholder="Enter category name"
                    onChange={setValue}
                    autoComplete="off"
                  />
                </div>
                <div className="mb-3 mt-3">
                  <label for="formFile" className="form-label">
                    Category image
                  </label>
                  <img
                    src={category_image_preview}
                    alt=""
                    style={{ margin: "5px 5rem", width: "5rem" }}
                  />
                  <input
                    className="form-control"
                    type="file"
                    name="category_image"
                    accept="image/*"
                    onChange={setValue}
                    id="category_image"
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
                ref={add_category_modal_close}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                onClick={submit_category_add}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update category modal */}
      <button
        ref={update_category_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#update_category_modal"
        style={{ display: "none" }}
      ></button>
      <div
        className="modal fade"
        id="update_category_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="update_category_modal"
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
                Edit category
              </h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Category name
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    className="form-control"
                    id="category_name"
                    value={category_data.category_name}
                    onChange={setValue}
                    autoComplete="off"
                  />
                </div>
                <div className="mb-3 mt-3">
                  <label for="formFile" className="form-label">
                    Category image
                  </label>
                  <img
                    src={category_image_preview}
                    alt=""
                    style={{ margin: "5px 5rem", width: "5rem" }}
                  />
                  <input
                    className="form-control"
                    type="file"
                    name="category_image"
                    accept="image/*"
                    onChange={setValue}
                    id="category_image"
                  />
                </div>
                <div className="input-group mt-4 mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Category status
                    </label>
                  </div>
                  <select
                    className="custom-select"
                    name="category_status"
                    id="category_status"
                    onChange={setValue}
                    style={{ width: "20rem", padding: "0rem 1rem" }}
                  >
                    <option
                      value="active"
                      selected={
                        category_data.category_status === "active"
                          ? false
                          : true
                      }
                    >
                      Active
                    </option>
                    <option
                      value="inactive"
                      selected={
                        category_data.category_status === "active"
                          ? false
                          : true
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
                ref={update_category_modal_close}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                onClick={submit_category_update}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete category modal */}
      <button
        ref={delete_category_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#delete_category_modal"
        style={{ display: "none" }}
      ></button>
      <div id="delete_category_modal" className="modal fade">
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
                Do you really want to delete the "{category_data.category_name}"
                category ? <br /> This process cannot be undone.
              </p>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={delete_category_modal_close}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={submit_category_delete}
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
          placeholder="Search category"
          aria-label="Search category"
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
          add_category_data();
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
          fetch_category();
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
                    Category name
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Category image
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Category product
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
              {category.length === 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {duplicate_category_data.length === 0 && search_query.length > 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {category && search_query.length === 0
                ? category &&
                  category.map((element) => {
                    id++;
                    return (
                      <CategoryTableItem
                        key={element._id}
                        add_category_data={add_category_data}
                        update_category_data={update_category_data}
                        delete_category_data={delete_category_data}
                        category_data={element}
                        preview_image={set_category_image_preview}
                        id={id}
                      />
                    );
                  })
                : duplicate_category_data.map((element) => {
                    id++;
                    return (
                      <CategoryTableItem
                        key={element._id}
                        add_category_data={add_category_data}
                        update_category_data={update_category_data}
                        delete_category_data={delete_category_data}
                        category_data={element}
                        preview_image={set_category_image_preview}
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

export default CategoryTable;
