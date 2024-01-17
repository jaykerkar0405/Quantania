import { useContext, createContext, useReducer } from "react";
import { CartReducer } from "./CartReducer";

const Cart = createContext();

const CartContext = ({ children }) => {
  const [state, CartDispatch] = useReducer(CartReducer, {
    cart: [],
  });

  return (
    <Cart.Provider value={{ state, CartDispatch }}>{children}</Cart.Provider>
  );
};

export const CartState = () => {
  return useContext(Cart);
};

export default CartContext;
