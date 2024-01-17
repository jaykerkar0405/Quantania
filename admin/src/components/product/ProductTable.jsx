import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import context from "../../contexts/product/ProductContext";
import {
  AddToPhotosOutlined,
  FeaturedVideoOutlined,
  RefreshOutlined,
} from "@material-ui/icons/";
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
import ProductTableItem from "./ProductTableItem";
import NoRecords from "../error/NoRecords";
import Spinner from "../spinner/Spinner";

const ProductTable = (props) => {
  let navigate = useNavigate();
  let sr_no = 0;
  const product_context = useContext(context);
  let {
    product,
    request_result,
    fetch_product,
    add_product,
    update_product,
    delete_product,
  } = product_context;
  const initial_state = {
    product_name: "",
    product_category: "",
    product_details: "",
    product_mrp: "",
    product_price: "",
    product_developer: "",
    product_image: "",
    status: "",
  };
  const [product_data, set_product_data] = useState(initial_state);
  const [duplicate_product_data, set_duplicate_product_data] = useState(" ");
  const [category, set_category] = useState();
  const [request_result_data, set_request_result_data] = useState({});
  const [product_image, set_product_image] = useState("/image_preview.jpg");
  const [product_image_preview, set_product_image_preview] =
    useState("/image_preview.jpg");
  const [loading, set_loading] = useState(true);
  const [search_query, set_search_query] = useState("");

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_product();
      document.title = "Product Panel - Quantania Admin Panel";
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
    //eslint-disable-next-line
  }, [request_result]);

  useEffect(() => {
    let filter_product = product.filter((element) => {
      if (element._id === search_query) {
        return element;
      } else if (element.product_name === search_query) {
        return element;
      } else if (element.product_category.category_name === search_query) {
        return element;
      } else if (element.product_developer === search_query) {
        return element;
      } else if (element.product_registrar === search_query) {
        return element;
      } else if (element.product_mrp === parseInt(search_query)) {
        return element;
      } else if (element.product_price === parseInt(search_query)) {
        return element;
      } else if (element.status === search_query) {
        return element;
      } else {
        return element;
      }
    });

    if (filter_product) {
      set_duplicate_product_data(filter_product);
    }
    // eslint-disable-next-line
  }, [search_query]);

  const add_product_data = async () => {
    const request = await fetch(
      `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/fetch_category/administrator`,
      {
        method: "GET",
        headers: {
          administrator_authentication_token: localStorage.getItem(
            "administrator_authentication_token"
          ),
          "Content-Type": "application/json",
        },
      }
    );
    let data = await request.json();
    data = data.category.filter((category_details) => {
      return category_details.category_status !== "inactive";
    });
    set_category(data);
    add_product_modal.current.click();
    set_request_result_data(request_result);
  };

  const update_product_data = async (updated_product) => {
    const request = await fetch(
      `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/fetch_category`,
      {
        method: "GET",
        headers: {
          administrator_authentication_token: localStorage.getItem(
            "administrator_authentication_token"
          ),
          "Content-Type": "application/json",
        },
      }
    );
    let data = await request.json();
    data = data.category.filter((category_details) => {
      return category_details.category_status !== "inactive";
    });
    set_category(data);
    update_product_modal.current.click();
    set_product_data(updated_product);
    set_request_result_data(request_result);
  };

  const delete_product_data = (deleted_product) => {
    delete_product_modal.current.click();
    set_product_data(deleted_product);
    set_request_result_data(request_result);
  };

  const add_product_modal = useRef(null);
  const add_product_modal_close = useRef(null);
  const add_modal_reset_button = useRef(null);

  const update_product_modal = useRef(null);
  const update_product_modal_close = useRef(null);

  const delete_product_modal = useRef(null);
  const delete_product_modal_close = useRef(null);

  const submit_product_add = (event) => {
    event.preventDefault();
    set_loading(true);
    add_product(product_data, product_image);
    add_product_modal_close.current.click();
    add_modal_reset_button.current.click();
    set_request_result_data(request_result);
    set_product_image_preview("/image_preview.jpg");
    set_loading(false);
    set_product_data(initial_state);
  };

  const submit_product_update = (event) => {
    event.preventDefault();
    set_loading(true);
    update_product(product_data._id, product_data, product_image);
    update_product_modal.current.click();
    set_product_image_preview("/image_preview.jpg");
    set_loading(false);
    set_product_data(initial_state);
  };

  const submit_product_delete = (event) => {
    event.preventDefault();
    delete_product(product_data._id);
    delete_product_modal_close.current.click();
  };

  const set_value = (event) => {
    if (event.target.name === "product_image") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          set_product_image(reader.result);
          set_product_image_preview(reader.result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      set_product_data({
        ...product_data,
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

      {/* Add product modal */}
      <button
        ref={add_product_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#add_product_modal"
        style={{ display: "none" }}
      ></button>
      <div
        className="modal fade"
        id="add_product_modal"
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
                Add product
              </h5>
            </div>
            <div className="modal-body">
              <form encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product name
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    className="form-control"
                    id="product_name"
                    placeholder="Enter product name"
                    onChange={set_value}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product category
                  </label>
                  <select
                    className="form-select"
                    name="product_category"
                    id="product_category"
                    onChange={set_value}
                  >
                    <option selected>Select product category</option>
                    {category &&
                      category.map((element) => {
                        return (
                          <option
                            value={`${element._id},${element.category_name}`}
                          >
                            {element.category_name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product mrp
                  </label>
                  <input
                    type="number"
                    name="product_mrp"
                    className="form-control"
                    id="product_mrp"
                    placeholder="Enter product mrp"
                    onChange={set_value}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product price
                  </label>
                  <input
                    type="number"
                    name="product_price"
                    className="form-control"
                    id="product_price"
                    placeholder="Enter product price"
                    onChange={set_value}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product developer
                  </label>
                  <input
                    type="text"
                    name="product_developer"
                    className="form-control"
                    id="product_developer"
                    placeholder="Enter product developer"
                    onChange={set_value}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product details
                  </label>
                  <textarea
                    name="product_details"
                    id="product_details"
                    rows="4"
                    className="form-control"
                    placeholder="Enter product details"
                    onChange={set_value}
                    autoComplete="off"
                  ></textarea>
                </div>
                <div className="mb-3 mt-3">
                  <label for="formFile" className="form-label">
                    Product image
                  </label>
                  <img
                    src={product_image_preview}
                    alt=""
                    style={{ margin: "5px 5rem", width: "5rem" }}
                  />
                  <input
                    className="form-control"
                    type="file"
                    name="product_image"
                    accept="image/*"
                    onChange={set_value}
                    id="product_image"
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
                ref={add_product_modal_close}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                onClick={submit_product_add}
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update product modal */}
      <button
        ref={update_product_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#update_product_modal"
        style={{ display: "none" }}
      ></button>
      <div
        className="modal fade"
        id="update_product_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="update_product_modal"
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
                id="update_product_modal"
              >
                Edit product
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
                    value={product_data._id}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product name
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    className="form-control"
                    id="product_name"
                    placeholder="Enter product name"
                    onChange={set_value}
                    value={product_data.product_name}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product category
                  </label>
                  <select
                    className="form-select"
                    name="product_category"
                    id="product_category"
                    onChange={set_value}
                  >
                    <option selected>Select product category</option>
                    {category &&
                      category.map((element) => {
                        return (
                          <option
                            value={`${element._id},${element.category_name}`}
                            selected={`${
                              product_data.product_category.category_id ===
                              element._id
                            }`}
                          >
                            {element.category_name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product mrp
                  </label>
                  <input
                    type="text"
                    name="product_mrp"
                    className="form-control"
                    id="product_mrp"
                    placeholder="Enter product mrp"
                    onChange={set_value}
                    value={product_data.product_mrp}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product price
                  </label>
                  <input
                    type="text"
                    name="product_price"
                    className="form-control"
                    id="product_price"
                    placeholder="Enter product price"
                    onChange={set_value}
                    value={product_data.product_price}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product developer
                  </label>
                  <input
                    type="text"
                    name="product_developer"
                    className="form-control"
                    id="product_developer"
                    placeholder="Enter product developer"
                    onChange={set_value}
                    value={product_data.product_developer}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Product details
                  </label>
                  <textarea
                    name="product_details"
                    id="product_details"
                    rows="4"
                    className="form-control"
                    placeholder="Enter product details"
                    onChange={set_value}
                    value={product_data.product_details}
                    autoComplete="off"
                  ></textarea>
                </div>

                <div className="mb-3 mt-3">
                  <label for="formFile" className="form-label">
                    Product image
                  </label>
                  <img
                    src={product_image_preview}
                    alt=""
                    style={{ margin: "5px 5rem", width: "5rem" }}
                  />
                  <input
                    className="form-control"
                    type="file"
                    name="product_image"
                    accept="image/*"
                    onChange={set_value}
                    id="product_image"
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
                    name="status"
                    id="status"
                    onChange={set_value}
                    style={{ width: "20rem", padding: "0rem 1rem" }}
                  >
                    <option
                      value="active"
                      selected={product_data.status === "active" ? false : true}
                    >
                      Active
                    </option>
                    <option
                      value="inactive"
                      selected={product_data.status === "active" ? false : true}
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
                ref={update_product_modal_close}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                onClick={submit_product_update}
                disabled={loading}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete product modal */}
      <button
        ref={delete_product_modal}
        type="button"
        className="hidden"
        data-bs-toggle="modal"
        data-bs-target="#delete_product_modal"
        style={{ display: "none" }}
      ></button>
      <div id="delete_product_modal" className="modal fade">
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
                Do you really want to delete the "{product_data.product_name}"
                product ? <br /> This process cannot be undone.
              </p>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={delete_product_modal_close}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={submit_product_delete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="input-group md-form form-sm form-1 pl-0"
        style={{ top: "-2rem", left: "45rem", width: "22%" }}
      >
        <input
          class="form-control"
          type="text"
          placeholder="Search product"
          aria-label="Search product"
          name="search"
          onChange={(event) => {
            set_search_query(event.target.value);
          }}
          autoComplete="off"
        />
      </div>

      <a href={`#/admin_panel/featured_product?redirect=product`}>
        <FeaturedVideoOutlined
          color="secondary"
          style={{
            cursor: "pointer",
            position: "absolute",
            top: "8.5rem",
            right: "11rem",
          }}
        />
      </a>

      <AddToPhotosOutlined
        color="secondary"
        style={{
          cursor: "pointer",
          position: "absolute",
          top: "8.5rem",
          right: "8rem",
        }}
        onClick={() => {
          add_product_data();
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
          fetch_product();
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
                    Product name
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Product image
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Product category
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Product price
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography color="textDark" variant="h6">
                    Featured
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
              {product.length === 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {duplicate_product_data.length === 0 && search_query.length > 0 && (
                <div style={{ marginRight: "-62rem" }}>
                  <NoRecords />
                </div>
              )}
              {product && search_query.length === 0
                ? product.map((element) => {
                    sr_no++;
                    return (
                      <ProductTableItem
                        key={element._id}
                        add_product_data={add_product_data}
                        update_product_data={update_product_data}
                        delete_product_data={delete_product_data}
                        preview_image={set_product_image_preview}
                        product_data={element}
                        sr_no={sr_no}
                      />
                    );
                  })
                : duplicate_product_data.map((element) => {
                    sr_no++;
                    return (
                      <ProductTableItem
                        key={element._id}
                        add_product_data={add_product_data}
                        update_product_data={update_product_data}
                        delete_product_data={delete_product_data}
                        preview_image={set_product_image_preview}
                        product_data={element}
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

export default ProductTable;
