import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/page_not_found.css";

const PageNotFound = () => {
  return (
    <section class="page_404">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 ">
            <div class="col-sm-10 col-sm-offset-1  text-center">
              <div class="four_zero_four_bg">
                <h1 class="text-center" style={{ color: "black" }}>
                  404
                </h1>
              </div>

              <div class="contant_box_404">
                <h3 class="h2" style={{ color: "black" }}>
                  Look like you're lost
                </h3>

                <p style={{ color: "black" }}>
                  the page you are looking for not avaible!
                </p>

                <Link to="/" class="link_404">
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
