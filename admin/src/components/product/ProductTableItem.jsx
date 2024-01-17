import React, { useState, useEffect } from "react";
import { Chip, Box, Typography, TableCell, TableRow } from "@material-ui/core";

const ProductTableItem = (props) => {
  // eslint-disable-next-line
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    product_data,
    update_product_data,
    delete_product_data,
    sr_no,
    preview_image,
  } = props;

  const [featured_product, set_featured_product] = useState();

  const update_featured_product = async () => {
    // const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/product/update_featured_product/${product_data._id}`;
    // const request = await fetch(api_url, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     administrator_authentication_token: localStorage.getItem(
    //       "administrator_authentication_token"
    //     ),
    //   },
    //   body: JSON.stringify({
    //     featured_product: featured_product,
    //   }),
    // });
    // const request_result = await request.json();
    // if (request_result.error) {
    //   toast.error(request_result.error, {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // }
  };

  useEffect(() => {
    update_featured_product();
  }, [featured_product]);

  return (
    <>
      <TableRow>
        <TableCell>
          <Typography
            color="textSecondary"
            sx={{
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            {sr_no}
          </Typography>
        </TableCell>

        <TableCell>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                color="textSecondary"
                variant="h6"
                sx={{
                  fontWeight: "600",
                }}
              >
                <a
                  href={`#/admin_panel/product_details?product_id=${product_data._id}&redirect=product`}
                  style={{ textDecoration: "none" }}
                >
                  {product_data._id}
                </a>
              </Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Typography color="textSecondary" variant="h6">
            {product_data.product_name.slice(0, 15)}
          </Typography>
        </TableCell>

        <TableCell>
          <a
            href={product_data.product_image.image_url}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <img
              src={product_data.product_image.image_url}
              alt=""
              style={{ margin: "0 1.5rem", width: "3rem" }}
            />
          </a>
        </TableCell>

        <TableCell>
          <Typography color="textSecondary" variant="h6">
            <a
              href={`#/admin_panel/category_details?category_id=${product_data.product_category.category_id}&redirect=product`}
              style={{ textDecoration: "none" }}
            >
              {product_data.product_category.category_name.slice(0, 15)}
            </a>
          </Typography>
        </TableCell>

        <TableCell>
          <Typography color="textSecondary" variant="h6">
            {product_data.product_price}
          </Typography>
        </TableCell>

        <TableCell>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="featured_product"
              role="switch"
              value={featured_product}
              checked={product_data.featured_product ? true : false}
              onChange={(event) => {
                set_featured_product(event.target.checked);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        </TableCell>

        <TableCell>
          <Chip
            sx={{
              pl: "4px",
              pr: "4px",
              backgroundColor:
                product_data.status === "active"
                  ? "success.main"
                  : "error.main",
              color: "#fff",
            }}
            size="small"
            label={product_data.status === "active" ? "Active" : "Inactive"}
          ></Chip>
        </TableCell>

        <TableCell>
          <i
            className="fa-solid fa-pen-to-square"
            onClick={() => {
              update_product_data(product_data);
              preview_image(product_data.product_image.image_url);
              handleClose();
            }}
            style={{ cursor: "pointer", color: "blue" }}
          ></i>
          <i
            className="fa-solid fa-trash"
            style={{ marginLeft: "1rem", cursor: "pointer", color: "red" }}
            onClick={() => {
              delete_product_data(product_data);
              handleClose();
            }}
          ></i>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProductTableItem;
