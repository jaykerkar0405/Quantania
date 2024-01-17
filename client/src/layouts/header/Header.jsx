import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartState } from "../../context/cart/CartContext";
import { WishlistState } from "../../context/wishlist/WishlistContext";
import { ComparisonState } from "../../context/comparison/CompareContext";

import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/css/skins/skin-demo-4.css";
import "../../assets/css/demos/demo-4.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const root = document.getElementById("root");

  const [category, set_category] = useState({
    _id: "",
    category_name: "",
  });
  const [result, set_result] = useState({});
  const [loading, set_loading] = useState(true);
  const [search, set_search] = useState("");
  const [menu, set_menu] = useState(false);

  useEffect(() => {
    if (menu) {
      root.classList.add("mmenu-active");
    } else {
      root.classList.remove("mmenu-active");
    }
  }, [menu]);

  const {
    state: { cart },
    CartDispatch,
  } = CartState();

  const {
    state: { wishlist },
  } = WishlistState();

  const {
    state: { comparison },
  } = ComparisonState();

  const cart_price = cart.reduce((accumulator, object) => {
    return accumulator + object.product_price;
  }, 0);

  const fetch_category = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/category/fetch_category/customer`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        customer_authentication_token: localStorage.getItem(
          "customer_authentication_token"
        ),
      },
    });

    const response = await request.json();
    set_category(response.category);
    set_result(response.result);
    set_loading(false);
  };

  const logout = () => {
    localStorage.removeItem("customer_authentication_token");
    navigate("/authentication/login");
  };

  useEffect(() => {
    if (result.error) {
      toast.error(result.error, {
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
  }, [result]);

  useEffect(() => {
    if (localStorage.getItem("customer_authentication_token")) {
      fetch_category();
      set_menu(false);
    }

    // eslint-disable-next-line
  }, []);

  const search_product = () => {
    if (search.length > 0) {
      navigate(`/product/search/${search}`);
    } else {
      toast.error("Please enter a valid search value", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="page-wrapper">
        <header className="header header-intro-clearance header-4">
          <div className="header-top">
            <div className="container" style={{ height: "5rem" }}>
              <div className="header-left">
                <a href={`mailto:${process.env.REACT_APP_EMAIL_ADDRESS}`}>
                  <i className="icon-envelope"></i>Mail :{" "}
                  {process.env.REACT_APP_EMAIL_ADDRESS}
                </a>
              </div>

              <div className="header-right">
                <ul className="top-menu">
                  <li>
                    <ul>
                      {localStorage.getItem("customer_authentication_token") ? (
                        <>
                          <li>
                            <Link
                              to="/account"
                              style={{
                                color: "white",
                              }}
                            >
                              My account
                            </Link>
                          </li>
                          <li>
                            <a
                              href="javascript:void(0)"
                              onClick={logout}
                              style={{
                                color: "white",
                              }}
                            >
                              Logout
                            </a>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link
                              to="/authentication/login"
                              style={{
                                color: "white",
                              }}
                            >
                              Sign In
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/authentication/registration"
                              style={{
                                color: "white",
                              }}
                            >
                              Sign Up
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="header-middle">
            <div className="container">
              <div className="header-left">
                <button
                  className="mobile-menu-toggler menu-active "
                  onClick={() => {
                    let target_value = menu ? false : true;
                    set_menu(target_value);
                  }}
                >
                  <span className="sr-only">Toggle mobile menu</span>
                  <i className="icon-bars" style={{ color: "white" }}></i>
                </button>

                <Link to="/" className="logo">
                  <img
                    src="/logo.png"
                    alt="quantania_logo"
                    width="100"
                    height="20"
                  />
                </Link>
              </div>

              <div className="header-center">
                <div className="header-search header-search-extended header-search-visible d-none d-lg-block">
                  <i className="icon-search"></i>
                  <form>
                    <div className="header-search-wrapper search-wrapper-wide">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={search_product}
                      >
                        <i className="icon-search"></i>
                      </button>
                      <input
                        type="search"
                        className="form-control"
                        name="search"
                        id="search"
                        value={search}
                        placeholder="Search product ..."
                        onChange={(event) => {
                          event.preventDefault();
                          set_search(event.target.value);
                        }}
                        autoComplete="off"
                        style={{
                          backgroundColor: "rgb(24, 26, 27)",
                          color: "white",
                        }}
                      />
                    </div>
                  </form>
                </div>
              </div>

              <div className="header-right">
                <div className="wishlist">
                  <Link to="/compare_product" title="Compare product">
                    <div className="icon">
                      <i className="icon-random"></i>
                      <span className="wishlist-count badge">
                        {comparison.length}
                      </span>
                    </div>
                    <p>Compare</p>
                  </Link>
                </div>

                <div className="wishlist">
                  <Link to="/wishlist" title="Wishlist product">
                    <div className="icon">
                      <i className="icon-heart-o"></i>
                      <span className="wishlist-count badge">
                        {wishlist.length}
                      </span>
                    </div>
                    <p>Wishlist</p>
                  </Link>
                </div>

                <div className="dropdown cart-dropdown">
                  <a
                    href="javascript:void(0)"
                    className="dropdown-toggle"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-display="static"
                    title="Shopping cart"
                  >
                    <div className="icon">
                      <i className="icon-shopping-cart"></i>
                      <span className="cart-count">{cart.length}</span>
                    </div>
                    <p>Cart</p>
                  </a>

                  <div className="dropdown-menu dropdown-menu-right">
                    <div className="dropdown-cart-products">
                      {cart.length > 0 &&
                        cart.map((element) => {
                          return (
                            <div className="product">
                              <div className="product-cart-details">
                                <h4 className="product-title">
                                  <Link
                                    to={`/product/product_details?product_id=${element._id}`}
                                    target="_blank"
                                  >
                                    {element.product_name}
                                  </Link>
                                </h4>

                                <span className="cart-product-info">
                                  Rs {element.product_price}
                                </span>
                              </div>

                              <figure className="product-image-container">
                                <Link
                                  to={`/product/product_details?product_id=${element._id}`}
                                  className="product-image"
                                  target="_blank"
                                >
                                  <img
                                    src={element.product_image.image_url}
                                    alt="product_image"
                                  />
                                </Link>
                              </figure>
                              <a
                                href="javascript:void(0)"
                                className="btn-remove"
                                title="Remove product"
                                onClick={() => {
                                  CartDispatch({
                                    type: "REMOVE_FROM_CART",
                                    payload: element,
                                  });
                                }}
                              >
                                <i
                                  className="icon-close"
                                  style={{ color: "red" }}
                                ></i>
                              </a>
                            </div>
                          );
                        })}
                    </div>

                    {cart.length > 0 ? (
                      <>
                        <div className="dropdown-cart-total">
                          <span>Total</span>

                          <span className="cart-total-price">
                            Rs {cart_price}
                          </span>
                        </div>

                        <div className="dropdown-cart-action">
                          <Link
                            to="/cart"
                            className="btn"
                            style={{
                              backgroundColor: "hsl(250,69%,61%)",
                              color: "white",
                            }}
                          >
                            Proceed To Checkout
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          color: "white",
                        }}
                      >
                        <i
                          className="icon-shopping-cart"
                          style={{ fontSize: "6rem" }}
                        ></i>
                        <span style={{ fontSize: "1.5rem" }}>
                          No products addded to cart
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="header-bottom sticky-header">
            <div className="container">
              <div className="header-left">
                <div className="dropdown category-dropdown">
                  <Link
                    to="/category"
                    className="dropdown-toggle"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-display="static"
                    title="Explore categories"
                  >
                    Explore categories <i className="icon-angle-down"></i>
                  </Link>

                  <div className="dropdown-menu">
                    <nav className="side-nav">
                      <ul className="menu-vertical sf-arrows">
                        {category.length === 0 && (
                          <li className="item-lead">
                            <a href="javacript:void(0)">
                              No category has been added yet
                            </a>
                          </li>
                        )}

                        {category.length > 0 &&
                          category.map((element) => {
                            return (
                              <li className="item-lead" key={element._id}>
                                <Link
                                  to={`/category/category_product?category_id=${element._id}`}
                                >
                                  {element.category_name}
                                </Link>
                              </li>
                            );
                          })}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>

              <div className="header-center">
                <nav className="main-nav">
                  <ul className="menu sf-arrows">
                    <li className={location.pathname === "/" ? "active" : ""}>
                      <Link to="/" title="Home">
                        Home
                      </Link>
                    </li>

                    <li
                      className={
                        location.pathname === "/product" ? "active" : ""
                      }
                    >
                      <Link
                        to="/product"
                        className="sf-with-ul"
                        title="Product"
                      >
                        Product
                      </Link>
                      <ul>
                        <li>
                          <Link to="/product">View all products</Link>
                        </li>
                        <li>
                          <Link to="/product/new_arrivals">New arrivals</Link>
                        </li>
                        <li>
                          <Link to="/product/featured_product">
                            Featured products
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li
                      className={
                        location.pathname === "/category" ? "active" : ""
                      }
                    >
                      <Link
                        to="/category"
                        className="sf-with-ul"
                        title="Category"
                      >
                        Category
                      </Link>

                      <ul>
                        <li>
                          <Link to="/category">View all categories</Link>
                        </li>
                        <li>
                          <Link to="/category/newly_added">Newly added</Link>
                        </li>
                      </ul>
                    </li>

                    <li
                      className={location.pathname === "/about" ? "active" : ""}
                    >
                      <Link to="/about" title="About">
                        About
                      </Link>
                    </li>

                    <li
                      className={
                        location.pathname === "/contact" ? "active" : ""
                      }
                    >
                      <Link to="/contact" title="Contact">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="header-right">
                <i
                  className="la la-lightbulb-o"
                  style={{ color: "hsl(250,69%,61%" }}
                ></i>
                <p>
                  Great deals
                  <span className="highlight">&nbsp; on leading brands</span>
                </p>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="mobile-menu-overlay"></div>

      <div className="mobile-menu-container mobile-menu-dark">
        <div className="mobile-menu-wrapper">
          <span
            className="mobile-menu-close"
            onClick={() => {
              let target_value = menu ? false : true;
              set_menu(target_value);
            }}
          >
            <i className="icon-close"></i>
          </span>

          <form className="mobile-search">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <input
              type="search"
              className="form-control"
              name="search"
              id="mobile-search"
              placeholder="Search product..."
              value={search}
              onChange={(event) => {
                event.preventDefault();
                set_search(event.target.value);
              }}
              style={{
                color: "white",
              }}
              autoComplete="off"
              required
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={search_product}
            >
              <i className="icon-search"></i>
            </button>
          </form>

          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="mobile-menu-tab"
              role="tabpanel"
              aria-labelledby="mobile-menu-link"
            >
              <nav className="mobile-nav">
                <ul className="mobile-menu">
                  <li
                    className={`${location.pathname === "/" ? "active" : ""}`}
                  >
                    <Link to="/">Home</Link>
                  </li>
                  <li
                    className={`${
                      location.pathname === "/product" ? "active" : ""
                    }`}
                  >
                    <Link to="/product">Products</Link>
                  </li>
                  <li
                    className={`${
                      location.pathname === "/category" ? "active" : ""
                    }`}
                  >
                    <Link to="/category">Categories</Link>
                  </li>
                  <li
                    className={`${
                      location.pathname === "/about" ? "active" : ""
                    }`}
                  >
                    <Link to="/about">About</Link>
                  </li>
                  <li
                    className={`${
                      location.pathname === "/contact" ? "active" : ""
                    }`}
                  >
                    <Link to="/contact">Contact</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="social-icons">
            <a
              href="http://www.facebook.com/Quantania"
              className="social-icon"
              target="_blank"
              title="Facebook"
            >
              <i className="icon-facebook-f"></i>
            </a>
            <a
              href="http://www.twitter.com/Quantania"
              className="social-icon"
              target="_blank"
              title="Twitter"
            >
              <i className="icon-twitter"></i>
            </a>
            <a
              href="http://www.instagram.com/Quantania"
              className="social-icon"
              target="_blank"
              title="Instagram"
            >
              <i className="icon-instagram"></i>
            </a>
            <a
              href="https://github.com/Jay-Kerkar"
              className="social-icon"
              target="_blank"
              title="GitHub"
            >
              <i className="icon-github"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
