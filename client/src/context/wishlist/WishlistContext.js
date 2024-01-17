import { useContext, createContext, useReducer } from "react";
import { WishlistReducer } from "./WishlistReducer";

const Wishlist = createContext();

const WishlistContext = ({ children }) => {
  const [state, WishlistDispatch] = useReducer(WishlistReducer, {
    wishlist: [],
  });

  return (
    <Wishlist.Provider value={{ state, WishlistDispatch }}>
      {children}
    </Wishlist.Provider>
  );
};

export const WishlistState = () => {
  return useContext(Wishlist);
};

export default WishlistContext;
