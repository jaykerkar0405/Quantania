import React from "react";
import { useEffect, useState } from "react";
import "../../assets/css/product_details.css";
import { useNavigate } from "react-router-dom";
import { Chip } from "@material-ui/core";
import { ArrowBackOutlined } from "@material-ui/icons";
import Spinner from "../spinner/Spinner";

const Product_details = () => {
  let navigate = useNavigate();
  const [product_details, set_product_details] = useState();

  let search_string = window.location.href;
  let replaced_searched_string = search_string.replace("/#/", "/");
  let url = new URL(replaced_searched_string);
  let search_params = url.searchParams;
  let product_id = search_params.get("product_id");
  let redirect = search_params.get("redirect");
  if (!redirect || !search_params) {
    navigate("/#/admin_panel/dashboard");
  }
  if (!product_id) {
    navigate(`/#/admin_panel/${redirect}`);
  }

  const fetch_product_details = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/product_details/administrator/${product_id}`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: localStorage.getItem(
          "administrator_authentication_token"
        ),
      },
    });
    const request_result = await request.json();
    set_product_details(request_result.product_details);

    if (request_result.result.error) {
      navigate(`/#/admin_panel/${redirect}`);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_product_details();
      document.title = "Product Details - Quantania Admin Panel";
    } else {
      navigate(`/admin_panel/login`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      {product_details ? (
        <div className="row">
          <div className="col-md-5">
            <a
              href={`#/admin_panel/${redirect}`}
              className="mb-3"
              style={{ color: "gray", margin: "0 2.4rem" }}
            >
              <ArrowBackOutlined />
            </a>
            <div className="project-info-box mt-0">
              <h5 className="text-dark">Product Details</h5>
              <p className="mb-0">{product_details.product_details}</p>
            </div>

            <div className="project-info-box">
              <p>
                <b className="text-dark">Name:</b>{" "}
                {product_details.product_name}
              </p>
              <p>
                <b className="text-dark">Mrp: </b>Rs{" "}
                {product_details.product_mrp}
              </p>
              <p>
                <b className="text-dark">Price: </b>Rs
                {product_details.product_price}
              </p>
              <p>
                <b className="text-dark">Developer:</b>{" "}
                {product_details.product_developer}
              </p>
              <p>
                <b className="text-dark">Status:</b>{" "}
                <Chip
                  sx={{
                    pl: "4px",
                    pr: "4px",
                    backgroundColor:
                      product_details.status === "active"
                        ? "success.main"
                        : "error.main",
                    color: "#fff",
                  }}
                  size="small"
                  label={
                    product_details.status === "active" ? "Active" : "Inactive"
                  }
                ></Chip>
              </p>
            </div>
          </div>

          <div className="col-md-7">
            <img
              src={product_details.product_image.image_url}
              className="rounded"
              alt="product_image"
              style={{ width: "25rem", margin: "0px 10rem" }}
            />
            <div className="project-info-box">
              <p>
                <b className="text-dark">Category:</b>{" "}
                <a
                  href={`#/admin_panel/category_details?category_id=${product_details.product_category.category_id}&redirect=product`}
                  style={{ textDecoration: "none" }}
                >
                  {product_details.product_category.category_name}
                </a>
              </p>
              <p>
                <b className="text-dark">Registrar:</b>{" "}
                <a
                  href={`#/admin_panel/administrator_details?administrator_id=${product_details.product_registrar}&redirect=product`}
                  style={{ textDecoration: "none" }}
                >
                  {product_details.product_registrar}
                </a>
              </p>
              <p>
                <b className="text-dark">Updater:</b>{" "}
                <a
                  href={`#/admin_panel/administrator_details?administrator_id=${product_details.product_updater}&redirect=product`}
                  style={{ textDecoration: "none" }}
                >
                  {product_details.product_updater}
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Product_details;
