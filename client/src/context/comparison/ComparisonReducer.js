export const ComparisonReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_COMPARE":
      return {
        ...state,
        comparison: [...state.comparison, { ...action.payload }],
      };
    case "REMOVE_FROM_COMPARE":
      return {
        ...state,
        comparison: state.comparison.filter(
          (element) => element._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};
