import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import PageLoader from "./layouts/loader/PageLoader";
import ReactGA from "react-ga";

const Home = lazy(() => import("./components/home/Home"));
const Header = lazy(() => import("./layouts/header/Header"));
const Footer = lazy(() => import("./layouts/footer/Footer"));
const Login = lazy(() => import("./components/authentication/Login"));
const Category = lazy(() => import("./components/category/Category"));
const NewlyAdded = lazy(() => import("./components/category/NewlyAdded"));
const Product = lazy(() => import("./components/product/Product"));
const NewArrivals = lazy(() => import("./components/product/NewArrivals"));
const Account = lazy(() => import("./components/account/Account"));
const Cart = lazy(() => import("./components/cart/Cart"));
const Wishlist = lazy(() => import("./components/wishlist/Wishlist"));
const Comparison = lazy(() => import("./components/comparison/Comparison"));
const About = lazy(() => import("./components/about/About"));
const Contact = lazy(() => import("./components/contact/Contact"));
const OrderDetails = lazy(() => import("./components/orders/OrderDetails"));
const SearchProduct = lazy(() => import("./components/product/SearchProduct"));
const PageNotFound = lazy(() => import("./components/404_error/PageNotFound"));

const TermsConditions = lazy(() =>
  import("./components/terms_conditions/TermsConditions")
);
const PrivacyPolicy = lazy(() =>
  import("./components/privacy_policy/PrivacyPolicy")
);
const OrderConfirmation = lazy(() =>
  import("./components/order_confirmation/OrderConfirmation")
);
const ProductDetails = lazy(() =>
  import("./components/product/ProductDetails")
);
const CategoryProduct = lazy(() =>
  import("./components/category/CategoryProduct")
);
const FeaturedProduct = lazy(() =>
  import("./components/product/FeaturedProduct")
);
const EmailVerification = lazy(() =>
  import("./components/authentication/EmailVerification")
);
const Registration = lazy(() =>
  import("./components/authentication/Registration")
);

// Google Analytics Configuration
const TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
ReactGA.initialize(TRACKING_ID);

function App() {
  const [progress, set_progress] = useState(0);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Router>
        <LoadingBar color="#f11946" progress={progress} height={3} />
        <Header />
        <Routes>
          <Route
            path="/"
            exact
            element={<Home set_progress={set_progress} />}
          />
          <Route
            path="/authentication/login"
            exact
            element={<Login set_progress={set_progress} />}
          />
          <Route
            path="/authentication/registration"
            exact
            element={<Registration set_progress={set_progress} />}
          />
          <Route
            path="/authentication/email_verification"
            exact
            element={<EmailVerification set_progress={set_progress} />}
          />
          <Route
            path="/category"
            exact
            element={<Category set_progress={set_progress} />}
          />
          <Route
            path="/category/newly_added"
            exact
            element={<NewlyAdded set_progress={set_progress} />}
          />
          <Route
            path="/category/category_product"
            exact
            element={<CategoryProduct set_progress={set_progress} />}
          />
          <Route
            path="/product"
            exact
            element={<Product set_progress={set_progress} />}
          />
          <Route
            path="/product/new_arrivals"
            exact
            element={<NewArrivals set_progress={set_progress} />}
          />
          <Route
            path="/product/featured_product"
            exact
            element={<FeaturedProduct set_progress={set_progress} />}
          />
          <Route
            path="/product/product_details"
            exact
            element={<ProductDetails set_progress={set_progress} />}
          />
          <Route
            path="/account"
            exact
            element={<Account set_progress={set_progress} />}
          />
          <Route
            path="/account/orders"
            exact
            element={<Account set_progress={set_progress} />}
          />
          <Route
            path="/account/downloads"
            exact
            element={<Account set_progress={set_progress} />}
          />
          <Route
            path="/account/account_details"
            exact
            element={<Account set_progress={set_progress} />}
          />
          <Route
            path="/account/change_password"
            exact
            element={<Account set_progress={set_progress} />}
          />
          <Route
            path="/account/change_account_details"
            exact
            element={<Account set_progress={set_progress} />}
          />
          <Route
            path="/orders/order_details"
            exact
            element={<OrderDetails set_progress={set_progress} />}
          />
          <Route
            path="/cart"
            exact
            element={<Cart set_progress={set_progress} />}
          />
          <Route
            path="/wishlist"
            exact
            element={<Wishlist set_progress={set_progress} />}
          />
          <Route
            path="/compare_product"
            exact
            element={<Comparison set_progress={set_progress} />}
          />
          <Route
            path="/contact"
            exact
            element={<Contact set_progress={set_progress} />}
          />
          <Route path="/about" exact element={<About />} />
          <Route
            path="/shopping_cart/order_confirmation"
            exact
            element={<OrderConfirmation />}
          />
          <Route
            path="/product/search/:keyword"
            exact
            element={<SearchProduct set_progress={set_progress} />}
          />
          <Route path="/privacy_policy" exact element={<PrivacyPolicy />} />
          <Route path="/terms_conditions" exact element={<TermsConditions />} />
          <Route path="*" exact element={<PageNotFound />} />
        </Routes>
        <Footer />
      </Router>
    </Suspense>
  );
}

export default App;
