import React from "react";
import SlideCard from "./SlideCard";

const SliderHome = ({ banner }) => {
  return (
    <>
      <section
        className="homeSlide contentWidth"
        style={{ backgroundColor: "rgb(50, 40, 54" }}
      >
        <div className="container">
          <SlideCard banner={banner} />
        </div>
      </section>
    </>
  );
};

export default SliderHome;
