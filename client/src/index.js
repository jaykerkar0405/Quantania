import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import CartContext from "./context/cart/CartContext";
import ComparisonContext from "./context/comparison/CompareContext";
import WishlistContext from "./context/wishlist/WishlistContext";

ReactDOM.render(
  <React.StrictMode>
    <CartContext>
      <WishlistContext>
        <ComparisonContext>
          <App />
        </ComparisonContext>
      </WishlistContext>
    </CartContext>
  </React.StrictMode>,
  document.getElementById("root")
);
