import React from "react";
import "../../assets/css/spinner.css";

const PageLoader = () => {
  return (
    <div className="fallback-spinner">
      <div className="loading component-loader">
        <div className="effect-1 effects"></div>
        <div className="effect-2 effects"></div>
        <div className="effect-3 effects"></div>
      </div>
    </div>
  );
};

export default PageLoader;
