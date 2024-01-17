import { useContext, createContext, useReducer } from "react";
import { ComparisonReducer } from "./ComparisonReducer";

const Comparison = createContext();

const ComparisonContext = ({ children }) => {
  const [state, ComparisonDispatch] = useReducer(ComparisonReducer, {
    comparison: [],
  });

  return (
    <Comparison.Provider value={{ state, ComparisonDispatch }}>
      {children}
    </Comparison.Provider>
  );
};

export const ComparisonState = () => {
  return useContext(Comparison);
};

export default ComparisonContext;
