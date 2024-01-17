import React from "react";
import { Chip, Box, Typography, TableCell, TableRow } from "@material-ui/core";

const BannerTableItem = (props) => {
  // eslint-disable-next-line
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    banner_data,
    update_banner_data,
    delete_banner_data,
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
                href={`#/admin_panel/banner_details?banner_id=${banner_data._id}&redirect=banner`}
                style={{ textDecoration: "none" }}
              >
                {banner_data._id}
              </a>
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {banner_data.banner_title.length < 20
            ? banner_data.banner_title
            : `${banner_data.banner_title.slice(0, 20)}...`}
        </Typography>
      </TableCell>

      <TableCell>
        <a
          href={banner_data.banner_image.image_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={banner_data.banner_image.image_url}
            style={{ margin: "0 1.5rem", width: "3rem" }}
            alt="banner_image"
          />
        </a>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {banner_data.button_text.length < 20
            ? banner_data.button_text
            : `${banner_data.button_text.slice(0, 20)}...`}
        </Typography>
      </TableCell>

      <TableCell>
        <Chip
          sx={{
            pl: "4px",
            pr: "4px",
            backgroundColor:
              banner_data.banner_status === "active"
                ? "success.main"
                : "error.main",
            color: "#fff",
          }}
          size="small"
          label={banner_data.banner_status === "active" ? "Active" : "Inactive"}
        ></Chip>
      </TableCell>

      <TableCell>
        <i
          className="fa-solid fa-pen-to-square"
          onClick={() => {
            update_banner_data(banner_data);
            preview_image(banner_data.banner_image.image_url);
            handleClose();
          }}
          style={{ cursor: "pointer", color: "blue" }}
        ></i>
        <i
          className="fa-solid fa-trash"
          style={{ marginLeft: "1rem", cursor: "pointer", color: "red" }}
          onClick={() => {
            delete_banner_data(banner_data);
            handleClose();
          }}
        ></i>
      </TableCell>
    </TableRow>
  );
};

export default BannerTableItem;
