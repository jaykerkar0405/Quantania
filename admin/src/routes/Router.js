import { lazy } from "react";
import { Navigate } from "react-router-dom";

const AdminPanel = lazy(() => import("../layouts/admin/AdminPanel"));
const Dashboard = lazy(() => import("../components/dashboard/Dashboard"));
const Category = lazy(() => import("../components/category/Category"));
const Order = lazy(() => import("../components/order/Order"));
const Contact = lazy(() => import("../components/contact/Contact"));
const Product = lazy(() => import("../components/product/Product"));
const Banner = lazy(() => import("../components/banner/Banner"));
const BannerDetails = lazy(() => import("../components/banner/BannerDetails"));
const ForgotPassword = lazy(() =>
  import("../components/forgot_password/ForgotPassword")
);
const FeaturedProduct = lazy(() =>
  import("../components/product/FeaturedProduct")
);
const CategoryProduct = lazy(() =>
  import("../components/category/CategoryProduct")
);
const Administrator = lazy(() =>
  import("../components/administrator/Administrator")
);
const Login = lazy(() => import("../components/authentication/Login"));
const EmailVerification = lazy(() =>
  import("../components/authentication/EmailVerification")
);
const Registration = lazy(() =>
  import("../components/authentication/Registration")
);
const AdminAccountView = lazy(() =>
  import("../components/admin_account/AdminAccountView")
);
const AdminAccountUpdate = lazy(() =>
  import("../components/admin_account/AdminAccountUpdate")
);
const AdministratorDetails = lazy(() =>
  import("../components/administrator/AdministratorDetails")
);
const CategoryDetails = lazy(() =>
  import("../components/category/CategoryDetails")
);
const ProductDetails = lazy(() =>
  import("../components/product/ProductDetails")
);
const OrderDetails = lazy(() => import("../components/order/OrderDetails"));
const Error = lazy(() => import("../components/error/Error"));

const Routes = [
  {
    path: "/",
    element: <AdminPanel />,
    children: [
      { path: "/", element: <Navigate to="admin_panel/dashboard" /> },
      { path: "admin_panel/dashboard", exact: true, element: <Dashboard /> },
      { path: "admin_panel/category", element: <Category /> },
      { path: "admin_panel/contact", element: <Contact /> },
      { path: "admin_panel/administrator", element: <Administrator /> },
      { path: "admin_panel/product", element: <Product /> },
      { path: "admin_panel/order", element: <Order /> },
      { path: "admin_panel/admin_account/view", element: <AdminAccountView /> },
      { path: "admin_panel/category_details", element: <CategoryDetails /> },
      { path: "admin_panel/product_details", element: <ProductDetails /> },
      { path: "admin_panel/order_details", element: <OrderDetails /> },
      { path: "admin_panel/category_product", element: <CategoryProduct /> },
      { path: "admin_panel/featured_product", element: <FeaturedProduct /> },
      { path: "admin_panel/banner", element: <Banner /> },
      { path: "admin_panel/banner_details", element: <BannerDetails /> },
      {
        path: "admin_panel/administrator_details",
        element: <AdministratorDetails />,
      },
      {
        path: "admin_panel/admin_account/update",
        element: <AdminAccountUpdate />,
      },
    ],
  },
  { path: "admin_panel/login", element: <Login /> },
  { path: "admin_panel/forgot_password", element: <ForgotPassword /> },
  {
    path: "admin_panel/registration",
    element: <Registration />,
  },
  {
    path: "admin_panel/email_verification",
    element: <EmailVerification />,
  },
  {
    path: "*",
    element: <Error />,
  },
];

export default Routes;
