export const CartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, { ...action.payload }],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(
          (element) => element._id !== action.payload._id
        ),
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: (state.cart = []),
      };
    default:
      return state;
  }
};
