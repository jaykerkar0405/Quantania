import React from "react";
import { Chip, Box, Typography, TableCell, TableRow } from "@material-ui/core";

const CategoryTableItem = (props) => {
  // eslint-disable-next-line
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    category_data,
    update_category_data,
    delete_category_data,
    id,
    preview_image,
  } = props;
  return (
    <TableRow>
      <TableCell>
        <Typography
          color="textSecondary"
          sx={{
            fontSize: "15px",
            fontWeight: "500",
          }}
        >
          {id}
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
                href={`#/admin_panel/category_details?category_id=${category_data._id}&redirect=category`}
                style={{ textDecoration: "none" }}
              >
                {category_data._id}
              </a>
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {category_data.category_name}
        </Typography>
      </TableCell>

      <TableCell>
        <a
          href={category_data.category_image.image_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={category_data.category_image.image_url}
            style={{ margin: "0 1.5rem", width: "3rem" }}
            alt="category_image"
          />
        </a>
      </TableCell>

      <TableCell>
        <a
          href={`#/admin_panel/category_product?category_id=${category_data._id}&redirect=category`}
          rel="noopener noreferrer"
        >
          <button target="_blank" className="btn btn-primary">
            View product
          </button>
        </a>
      </TableCell>

      <TableCell>
        <Chip
          sx={{
            pl: "4px",
            pr: "4px",
            backgroundColor:
              category_data.category_status === "active"
                ? "success.main"
                : "error.main",
            color: "#fff",
          }}
          size="small"
          label={
            category_data.category_status === "active" ? "Active" : "Inactive"
          }
        ></Chip>
      </TableCell>

      <TableCell>
        <i
          className="fa-solid fa-pen-to-square"
          onClick={() => {
            update_category_data(category_data);
            preview_image(category_data.category_image.image_url);
            handleClose();
          }}
          style={{ cursor: "pointer", color: "blue" }}
        ></i>
        <i
          className="fa-solid fa-trash"
          style={{ marginLeft: "1rem", cursor: "pointer", color: "red" }}
          onClick={() => {
            delete_category_data(category_data);
            handleClose();
          }}
        ></i>
      </TableCell>
    </TableRow>
  );
};

export default CategoryTableItem;
