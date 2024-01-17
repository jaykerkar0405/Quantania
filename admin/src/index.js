import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HashRouter } from "react-router-dom";
import Spinner from "./components/spinner/Spinner";
import CategoryState from "./contexts/category/CategoryState";
import OrderState from "./contexts/order/OrderState";
import CustomerState from "./contexts/customer/CustomerState";
import AdministratorState from "./contexts/administrator/AdministratorState";
import ContactState from "./contexts/contact/ContactState";
import ProductState from "./contexts/product/ProductState";
import BannerState from "./contexts/banner/BannerState";

ReactDOM.render(
  <BannerState>
    <ProductState>
      <ContactState>
        <AdministratorState>
          <CustomerState>
            <OrderState>
              <CategoryState>
                <Suspense fallback={<Spinner />}>
                  <HashRouter>
                    <App />
                  </HashRouter>
                </Suspense>
              </CategoryState>
            </OrderState>
          </CustomerState>
        </AdministratorState>
      </ContactState>
    </ProductState>
  </BannerState>,
  document.getElementById("root")
);
