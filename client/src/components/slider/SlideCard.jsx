import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const SlideCard = ({ banner }) => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    appendDots: (dots) => {
      return <ul style={{ margin: "0px" }}>{dots}</ul>;
    },
  };
  return (
    <>
      <Slider {...settings}>
        {banner.map((value, index) => {
          return (
            <>
              <div
                className="box d_flex top"
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: "40rem",
                }}
                key={index}
              >
                <div className="left">
                  <h1 style={{ color: "white" }}>{value.banner_title}</h1>
                  <Link
                    to={value.button_link}
                    className="btn"
                    style={{
                      backgroundColor: "hsl(250,69%,61%)",
                      color: "white",
                    }}
                  >
                    {value.button_text}
                  </Link>
                </div>
                <div className="right">
                  <img src={value.banner_image.image_url} alt="banner_image" />
                </div>
              </div>
            </>
          );
        })}
      </Slider>
    </>
  );
};

export default SlideCard;
