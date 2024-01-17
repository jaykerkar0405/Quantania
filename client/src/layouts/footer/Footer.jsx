import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="footer-middle">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-lg-3">
                <div className="widget widget-about">
                  <h4>
                    <Link to="/" style={{ color: "hsl(250,69%,60%)" }}>
                      Quantania
                    </Link>
                  </h4>
                  <p>
                    We are an efficient computer programs and application source
                    code provider
                  </p>

                  <div className="widget-call">
                    <i className="icon-envelope"></i>
                    Stucked in a query? Mail us
                    <a href={`mailto:${process.env.REACT_APP_EMAIL_ADDRESS}`}>
                      {process.env.REACT_APP_EMAIL_ADDRESS}
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="widget">
                  <h4 className="widget-title">Customer Service</h4>

                  <ul className="widget-list">
                    <li>
                      <Link to="/privacy_policy">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/about">About</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact Us</Link>
                    </li>
                    <li>
                      <Link to="/terms_conditions">Terms & Conditions</Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="widget">
                  <h4 className="widget-title">My Account</h4>

                  <ul className="widget-list">
                    {localStorage.getItem("customer_authentication_token") ? (
                      <li>
                        <Link to="/account">Account</Link>
                      </li>
                    ) : (
                      <>
                        <li>
                          <Link to="/authentication/login">Sign In</Link>
                        </li>{" "}
                        <li>
                          <Link to="/authentication/registration">Sign Up</Link>
                        </li>
                      </>
                    )}

                    <li>
                      <Link to="/cart">View Cart</Link>
                    </li>
                    <li>
                      <Link to="/wishlist">My Wishlist</Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3">
                <div className="widget widget-about">
                  <p style={{ width: "100%" }}>
                    Follow us on our social handles
                  </p>

                  <div
                    className="widget-call"
                    style={{ maxWidth: "255px", height: "5rem" }}
                  >
                    <a
                      href="https://github.com/Jay-Kerkar"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i
                        className="icon-github"
                        style={{ color: "hsl(250,69%,60%)" }}
                      ></i>
                    </a>

                    <a
                      href="http://www.facebook.com/Quantania"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i
                        className="icon-facebook"
                        style={{ color: "hsl(250,69%,60%)", margin: "0 6rem" }}
                      ></i>
                    </a>

                    <a
                      href="http://www.instagram.com/Quantania"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i
                        className="icon-instagram"
                        style={{ color: "hsl(250,69%,60%)", margin: "0 12rem" }}
                      ></i>
                    </a>

                    <a
                      href="http://www.twitter.com/Quantania"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i
                        className="icon-twitter"
                        style={{ color: "hsl(250,69%,60%)", margin: "0 18rem" }}
                      ></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <p className="footer-copyright">
              Copyright © {year} <Link to={"/"}>Quantania and Team</Link>.
            </p>
            <figure className="footer-payments">
              <img
                src="/payment_banner.png"
                alt="payment_methods"
                width="272"
                height="20"
              />
            </figure>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
