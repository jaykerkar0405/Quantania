import React from "react";
import {
  Chip,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Typography,
  TableCell,
  TableRow,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const CustomerTableItem = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
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
              {administrator_data._id}
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
        <Typography color="textSecondary" variant="h6">
          {administrator_data.email_id}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {administrator_data.mobile_number}
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
        <IconButton
          aria-label="menu"
          color="inherit"
          aria-controls="notification-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon width="20" height="20" />
        </IconButton>
        <Menu
          id="notification-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          sx={{
            "& .MuiMenu-paper": {
              width: "200px",
              right: 0,
              top: "70px !important",
            },
          }}
          style={{
            marginLeft: "-3rem",
            marginRight: "-3rem",
            marginTop: "16.5rem",
          }}
        >
          <MenuItem
            onClick={() => {
              update_administrator_data(administrator_data);
              handleClose();
            }}
          >
            Update administrator
          </MenuItem>
          <MenuItem
            onClick={() => {
              delete_administrator_data(administrator_data);
              handleClose();
            }}
          >
            Delete administrator
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

export default CustomerTableItem;
