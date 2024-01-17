import React from "react";
import { useEffect, useState, useRef } from "react";
import "../../assets/css/admin_account.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../spinner/Spinner";

const AdminAccount = () => {
  let navigate = useNavigate();
  const [admin_details, set_admin_details] = useState();
  const [password, set_password] = useState({
    old_password: "",
    new_password: "",
  });
  const [disabled, set_disabled] = useState(false);
  const [administrator_image, set_administrator_image] = useState(
    "/administrator_image_preview.png"
  );
  const [administrator_image_preview, set_administrator_image_preview] =
    useState("/administrator_image_preview.png");

  const fetch_admin_details = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/administrator_details/authentication_token`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({}),
    });
    const request_result = await request.json();
    set_admin_details(request_result.administrator_details);
    if (request_result.administrator_details.administrator_image.image_url) {
      set_administrator_image(
        request_result.administrator_details.administrator_image.image_url
      );
      set_administrator_image_preview(
        request_result.administrator_details.administrator_image.image_url
      );
    }
    if (request_result.result.error) {
      toast.error(request_result.result.error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_admin_details();
      document.title = "Update Account - Quantania Admin Panel";
    } else {
      navigate(`/admin_panel/login`);
    }
    // eslint-disable-next-line
  }, []);

  const set_value = (event) => {
    if (event.target.name === "administrator_image") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          set_administrator_image(reader.result);
          set_administrator_image_preview(reader.result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      set_admin_details({
        ...admin_details,
        [event.target.name]: event.target.value,
      });
    }
  };

  const set_password_value = (event) => {
    set_password({
      ...password,
      [event.target.name]: event.target.value,
    });
  };

  const administrator_image_modal = useRef(null);
  const administrator_image_modal_close = useRef(null);

  const update_admin_details = async () => {
    set_disabled(true);
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/update_administrator`;
    const request = await fetch(api_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
      body: JSON.stringify({
        username: admin_details.username,
        email_id: admin_details.email_id,
        mobile_number: admin_details.mobile_number,
        administrator_image: administrator_image,
      }),
    });
    const request_result = await request.json();

    if (request_result.result.success) {
      set_disabled(false);
      administrator_image_modal_close.current.click();
      navigate("/admin_panel/admin_account/view");
    }

    if (request_result.result.error) {
      set_disabled(false);
      toast.error(request_result.result.error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (request_result.result.errors) {
      set_disabled(false);
      for (
        let index = 0;
        index < request_result.result.errors.length;
        index++
      ) {
        toast.error(request_result.result.errors[index].msg, {
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

    set_admin_details({});
  };

  const change_password_modal = useRef(null);
  const change_password_modal_close = useRef(null);

  const change_password = async () => {
    if (
      password.old_password.length > 0 &&
      password.new_password.length > 0 &&
      password.new_password === password.confirm_new_password
    ) {
      const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/change_password`;
      const request = await fetch(api_url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          administrator_authentication_token: localStorage.getItem(
            "administrator_authentication_token"
          ),
        },
        body: JSON.stringify({
          old_password: password.old_password,
          new_password: password.new_password,
        }),
      });
      const request_result = await request.json();

      if (request_result.result.success) {
        set_disabled(false);
        change_password_modal_close.current.click();
        navigate("/admin_panel/admin_account/view");
      }

      if (request_result.result.error) {
        set_disabled(false);
        toast.error(request_result.result.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      if (request_result.result.errors) {
        set_disabled(false);
        for (
          let index = 0;
          index < request_result.result.errors.length;
          index++
        ) {
          toast.error(request_result.result.errors[index].msg, {
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

      set_password({});
    } else {
      if (password.new_password !== password.confirm_new_password) {
        set_disabled(false);
        toast.error("Please make sure that the passwords are matching", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        set_disabled(false);
        toast.error("Please enter valid details", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const update_administrator_image = () => {
    administrator_image_modal.current.click();
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

      {admin_details ? (
        <>
          <button
            ref={administrator_image_modal}
            type="button"
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#administrator_image_modal"
            style={{ color: "white", display: "none" }}
          ></button>

          <div
            className="modal fade"
            id="administrator_image_modal"
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
                    className="modal-title text-dark font-bold"
                    id="addModalLabel"
                  >
                    Administrator image
                  </h5>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3 mt-3">
                      <label for="formFile" className="form-label text-dark">
                        Upload image
                      </label>
                      <img
                        src={administrator_image_preview}
                        alt=""
                        style={{ margin: "5px 5rem", width: "5rem" }}
                      />
                      <input
                        className="form-control"
                        type="file"
                        name="administrator_image"
                        accept="image/*"
                        onChange={set_value}
                        id="administrator_image"
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={administrator_image_modal_close}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                    onClick={update_admin_details}
                    disabled={disabled}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="change_password_modal"
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
                    className="modal-title text-dark font-bold"
                    id="addModalLabel"
                  >
                    Change password
                  </h5>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label text-dark"
                      >
                        Old password
                      </label>
                      <input
                        type="password"
                        name="old_password"
                        className="form-control text-dark"
                        id="old_password"
                        placeholder="Enter the old password"
                        onChange={set_password_value}
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label text-dark"
                      >
                        New password
                      </label>
                      <input
                        type="password"
                        name="new_password"
                        className="form-control text-dark"
                        id="new_password"
                        placeholder="Enter the new password"
                        onChange={set_password_value}
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="recipient-name"
                        className="col-form-label text-dark"
                      >
                        Confirm new password
                      </label>
                      <input
                        type="password"
                        name="confirm_new_password"
                        className="form-control text-dark"
                        id="confirm_new_password"
                        placeholder="Enter the new password again"
                        onChange={set_password_value}
                        autoComplete="off"
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={change_password_modal_close}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary text-white bg-blue-700 hover:bg-blue-800"
                    onClick={change_password}
                    disabled={disabled}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="container-xl px-4 mt-4">
            <div className="row">
              <div className="col-xl-12">
                <div className="card mb-4">
                  <div className="card-header text-dark  d-flex justify-content-between align-items-center">
                    Change account details
                    <div>
                      <button
                        ref={change_password_modal}
                        type="button"
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#change_password_modal"
                        style={{ color: "white" }}
                      >
                        Change password
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div
                      className="administrator_image"
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <img
                        src={
                          administrator_image
                            ? administrator_image
                            : "/administrator_image_preview.png"
                        }
                        className="rounded-circle"
                        style={{ width: "10rem", margin: "2rem 0" }}
                        alt="administrator_image"
                      />
                      <i
                        className="fa-solid fa-pen-to-square"
                        onClick={() => {
                          update_administrator_image();
                        }}
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          position: "absolute",
                          left: "40rem",
                          top: "10.5rem",
                        }}
                      ></i>
                    </div>
                    <form>
                      <div className="mb-3">
                        <label
                          className="small mb-1 text-dark"
                          htmlFor="inputUsername"
                        >
                          Username
                        </label>
                        <input
                          className="form-control"
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          value={admin_details.username}
                          name="username"
                          onChange={set_value}
                          autoComplete="off"
                        />
                      </div>
                      <div className="row gx-3 mb-3">
                        <div className="col-md-6">
                          <label
                            className="small mb-1 text-dark"
                            htmlFor="inputFirstName"
                          >
                            Email id
                          </label>
                          <input
                            className="form-control"
                            id="email_id"
                            type="email"
                            placeholder="Enter your email id"
                            value={admin_details.email_id}
                            name="email_id"
                            onChange={set_value}
                            autoComplete="off"
                          />
                        </div>
                        <div className="col-md-6">
                          <label
                            className="small mb-1 text-dark"
                            htmlFor="inputLastName"
                          >
                            Mobile number
                          </label>
                          <input
                            className="form-control"
                            id="mobile_number"
                            type="number"
                            placeholder="Enter your mobile number"
                            value={admin_details.mobile_number}
                            name="mobile_number"
                            onChange={set_value}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={update_admin_details}
                        disabled={disabled}
                      >
                        Save changes
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default AdminAccount;
