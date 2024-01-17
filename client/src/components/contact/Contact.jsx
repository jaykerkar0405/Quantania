import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../../layouts/loader/PageLoader";

const Contact = ({ set_progress }) => {
  const [customer, set_customer] = useState({
    username: "",
    email_id: "",
  });

  const [contact_entry, set_contact_entry] = useState({
    subject: "",
    message: "",
  });

  const [loading, set_loading] = useState(true);
  const [disabled, set_disabled] = useState(false);

  const form_reset_button = useRef(null);
  const navigate = useNavigate();

  const fetch_customer_details = async () => {
    set_progress(25);

    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/customer/customer_details`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
    });
    set_progress(50);
    const request_result = await request.json();
    set_progress(75);
    set_customer(request_result.customer_details);
    set_progress(100);
    set_loading(false);

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

  const add_contact_entry = async () => {
    set_progress(25);
    set_disabled(true);

    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/contact/add_contact_entry`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
      body: JSON.stringify({
        username: customer.username,
        email_id: customer.email_id,
        subject: contact_entry.subject,
        message: contact_entry.message,
      }),
    });
    set_progress(50);
    const request_result = await request.json();
    set_progress(75);
    set_progress(100);
    set_disabled(false);

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
    } else {
      form_reset_button.current.click();
      toast.success(request_result.result.success, {
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
  };

  const set_value = (event) => {
    set_contact_entry({
      ...contact_entry,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      document.title =
        "Contact Us ||  Quantania - An efficient computer programs and application source code provider";
      fetch_customer_details();
    } else {
      navigate("/");
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />

      {loading ? (
        <PageLoader />
      ) : (
        <main class="main">
          <nav aria-label="breadcrumb" class="breadcrumb-nav border-0 mb-0">
            <div class="container">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li class="breadcrumb-item">
                  <Link to="/contact">Contact</Link>
                </li>
              </ol>
            </div>
          </nav>

          <div class="container">
            <div class="page-header page-header-big text-center">
              <h1 class="page-title text-white">
                Contact us
                <span class="text-white">keep in touch with us</span>
              </h1>
            </div>
          </div>

          <div class="page-content pb-0">
            <div class="container">
              <div class="row">
                <div class="col-lg-6 mb-2 mb-lg-0">
                  <h2 class="title mb-1">Contact Information</h2>
                  <p class="mb-3">
                    We are an upcoming software programs and solutions provider
                    at your ease and we have error free and easy to integrate
                    program structures.
                  </p>
                  <div class="row">
                    <div class="col-sm-7">
                      <div class="contact-info">
                        <h3>The Quantania</h3>

                        <ul class="contact-list">
                          <li>
                            <i class="icon-map-marker"></i>
                            Dombivli, Mumbai - India
                          </li>
                          <li>
                            <i class="icon-envelope"></i>
                            <a
                              href={`mailto:${process.env.REACT_APP_EMAIL_ADDRESS}`}
                            >
                              {process.env.REACT_APP_EMAIL_ADDRESS}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <h2 class="title mb-1">Got Any Questions?</h2>
                  <p class="mb-2">
                    Use the form below to get in touch with the team
                  </p>

                  <form class="contact-form mb-3">
                    <div class="row">
                      <div class="col-sm-6">
                        <label for="cname" class="sr-only">
                          Username
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="cname"
                          name="username"
                          placeholder="Username *"
                          value={customer.username}
                          autoComplete="off"
                          required
                          style={{
                            backgroundColor: "hsl(250,29%,16%)",
                            color: "hsl(250,8%,75%)",
                            border: "none",
                          }}
                        />
                      </div>

                      <div class="col-sm-6">
                        <label for="cemail" class="sr-only">
                          Email id
                        </label>
                        <input
                          type="email"
                          class="form-control"
                          id="cemail"
                          name="email_id"
                          placeholder="Email id *"
                          value={customer.email_id}
                          autoComplete="off"
                          required
                          style={{
                            backgroundColor: "hsl(250,29%,16%)",
                            color: "hsl(250,8%,75%)",
                            border: "none",
                          }}
                        />
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-sm-12">
                        <label for="cname" class="sr-only">
                          Subject
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="cname"
                          name="subject"
                          placeholder="Subject *"
                          onChange={set_value}
                          autoComplete="off"
                          required
                          style={{
                            backgroundColor: "hsl(250,29%,16%)",
                            color: "hsl(250,8%,75%)",
                            border: "none",
                          }}
                        />
                        <smal class="form-text">
                          Minimum length of subject should be 10 characters
                        </smal>
                      </div>
                    </div>

                    <label for="cmessage" class="sr-only">
                      Message
                    </label>
                    <textarea
                      class="form-control"
                      cols="30"
                      rows="4"
                      id="cmessage"
                      name="message"
                      autoComplete="off"
                      onChange={set_value}
                      required
                      placeholder="Message *"
                      style={{
                        backgroundColor: "hsl(250,29%,16%)",
                        color: "hsl(250,8%,75%)",
                        border: "none",
                      }}
                    ></textarea>
                    <smal class="form-text">
                      Minimum length message should be 20 characters
                    </smal>

                    <input
                      type="reset"
                      ref={form_reset_button}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      class="btn btn-outline-primary-2 btn-minwidth-sm"
                      disabled={disabled ? true : false}
                      onClick={add_contact_entry}
                    >
                      <span>SUBMIT</span>
                      <i class="icon-long-arrow-right"></i>
                    </button>
                  </form>
                </div>
              </div>

              <hr class="mt-4 mb-5" />
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Contact;
