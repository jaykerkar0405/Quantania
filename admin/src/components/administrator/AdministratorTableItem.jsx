import React from "react";
import { Chip, Box, Typography, TableCell, TableRow } from "@material-ui/core";

const AdministratorTableItem = (props) => {
  // eslint-disable-next-line
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    administrator_data,
    update_administrator_data,
    delete_administrator_data,
    sr_no,
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
                href={`#/admin_panel/administrator_details?administrator_id=${administrator_data._id}&redirect=administrator`}
                style={{ textDecoration: "none" }}
              >
                {administrator_data._id}
              </a>
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {administrator_data.username}
        </Typography>
      </TableCell>

      <TableCell>
        <a
          href={
            administrator_data.administrator_image.image_url
              ? administrator_data.administrator_image.image_url
              : "/administrator_image_preview.png"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={
              administrator_data.administrator_image.image_url
                ? administrator_data.administrator_image.image_url
                : "/administrator_image_preview.png"
            }
            style={{ width: "3rem" }}
            alt="administrator_image"
          />
        </a>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          <a
            href={`mailto:${administrator_data.email_id}`}
            style={{ textDecoration: "none" }}
          >
            {administrator_data.email_id}
          </a>
        </Typography>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          <a
            href={`tel:+91${administrator_data.mobile_number}`}
            style={{ textDecoration: "none" }}
          >
            {administrator_data.mobile_number}
          </a>
        </Typography>
      </TableCell>

      <TableCell>
        <Chip
          sx={{
            pl: "4px",
            pr: "4px",
            backgroundColor:
              administrator_data.status === "active"
                ? "success.main"
                : "error.main",
            color: "#fff",
          }}
          size="small"
          label={administrator_data.status === "active" ? "Active" : "Inactive"}
        ></Chip>
      </TableCell>
      <TableCell>
        <i
          className="fa-solid fa-pen-to-square"
          onClick={() => {
            update_administrator_data(administrator_data);
            handleClose();
          }}
          style={{ cursor: "pointer", color: "blue" }}
        ></i>
        <i
          className="fa-solid fa-trash"
          style={{ marginLeft: "1rem", cursor: "pointer", color: "red" }}
          onClick={() => {
            delete_administrator_data(administrator_data);
            handleClose();
          }}
        ></i>
      </TableCell>
    </TableRow>
  );
};

export default AdministratorTableItem;
