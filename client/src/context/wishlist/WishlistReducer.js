export const WishlistReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      return {
        ...state,
        wishlist: [...state.wishlist, { ...action.payload }],
      };
    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter(
          (element) => element._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};
