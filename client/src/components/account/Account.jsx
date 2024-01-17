import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AccountDetails from "../account_details/AccountDetails";
import ChangeAccountDetails from "../account_details/ChangeAccountDetails";
import Downloads from "../downloads/Downloads";
import Orders from "../orders/Orders";
import ChangePassword from "../password/ChangePassword";

const Account = ({ set_progress }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      document.write =
        "My Account ||  Quantania - An efficient computer programs and application source code provider";
    } else {
      navigate(`/authentication/login`);
    }

    // eslint-disable-next-line
  }, []);
  return (
    <main class="main">
      <div class="page-header text-center">
        <div class="container">
          <h1 class="page-title">
            My Account<span>View placed orders & manage your profile</span>
          </h1>
        </div>
      </div>

      <nav aria-label="breadcrumb" class="breadcrumb-nav mb-3">
        <div class="container">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to={"/"}>Home</Link>
            </li>
            <li class="breadcrumb-item active " aria-current="page">
              <Link to="/account">My Account</Link>
            </li>
            {location.pathname === "/account/orders" && (
              <li class="breadcrumb-item active" aria-current="page">
                <Link
                  to="/account/orders"
                  style={{ color: "hsl(250,69%,61%)" }}
                >
                  Orders
                </Link>
              </li>
            )}
            {location.pathname === "/account/downloads" && (
              <li class="breadcrumb-item active" aria-current="page">
                <Link
                  to="/account/downloads"
                  style={{ color: "hsl(250,69%,61%)" }}
                >
                  Downloads
                </Link>
              </li>
            )}
            {location.pathname === "/account/account_details" && (
              <li class="breadcrumb-item active" aria-current="page">
                <Link
                  to="/account/account_details"
                  style={{ color: "hsl(250,69%,61%)" }}
                >
                  Accout Details
                </Link>
              </li>
            )}
            {location.pathname === "/account/change_password" && (
              <li class="breadcrumb-item active" aria-current="page">
                <Link
                  to="/account/change_password"
                  style={{ color: "hsl(250,69%,61%)" }}
                >
                  Change Password
                </Link>
              </li>
            )}
          </ol>
        </div>
      </nav>

      <div class="page-content">
        <div class="dashboard">
          <div class="container">
            <div class="row">
              <aside class="col-md-4 col-lg-3">
                <ul
                  class="nav nav-dashboard flex-column mb-3 mb-md-0"
                  role="tablist"
                >
                  <li class="nav-item">
                    <Link
                      class={`nav-link ${
                        location.pathname === "/account/orders" ? "active" : ""
                      }`}
                      id="tab-orders-link"
                      data-toggle="tab"
                      to="/account/orders"
                      role="tab"
                      aria-controls="tab-orders"
                      aria-selected="false"
                    >
                      My Orders
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link
                      class={`nav-link ${
                        location.pathname === "/account/downloads"
                          ? "active"
                          : ""
                      }`}
                      id="tab-downloads-link"
                      data-toggle="tab"
                      to="/account/downloads"
                      role="tab"
                      aria-controls="tab-downloads"
                      aria-selected="false"
                    >
                      My Downloads
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link
                      class={`nav-link ${
                        location.pathname === "/account/account_details"
                          ? "active"
                          : ""
                      }`}
                      id="tab-account-link"
                      data-toggle="tab"
                      to="/account/account_details"
                      role="tab"
                      aria-controls="tab-account"
                      aria-selected="false"
                    >
                      Account Details
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link
                      class={`nav-link ${
                        location.pathname === "/account/change_password"
                          ? "active"
                          : ""
                      }`}
                      id="tab-account-link"
                      data-toggle="tab"
                      to="/account/change_password"
                      role="tab"
                      aria-controls="tab-account"
                      aria-selected="false"
                    >
                      Change Password
                    </Link>
                  </li>
                </ul>
              </aside>

              <div class="col-md-8 col-lg-9">
                <div class="tab-content">
                  {location.pathname === "/account" ? (
                    <div className="text-white">
                      <span className="font-weight-bold">
                        Hello dear customer
                      </span>
                      ,
                      <br />
                      From your account dashboard, you can easily check & view
                      your recent orders, manage your profile and download the
                      projects pruchased by you from the downloads section.
                    </div>
                  ) : (
                    ""
                  )}
                  {location.pathname === "/account/orders" ? (
                    <Orders set_progress={set_progress} />
                  ) : (
                    ""
                  )}
                  {location.pathname === "/account/downloads" ? (
                    <Downloads set_progress={set_progress} />
                  ) : (
                    ""
                  )}
                  {location.pathname === "/account/account_details" ? (
                    <AccountDetails set_progress={set_progress} />
                  ) : (
                    ""
                  )}
                  {location.pathname === "/account/change_account_details" ? (
                    <ChangeAccountDetails set_progress={set_progress} />
                  ) : (
                    ""
                  )}
                  {location.pathname === "/account/change_password" ? (
                    <ChangePassword set_progress={set_progress} />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Account;
