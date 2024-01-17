import React from "react";
import { Chip, Box, Typography, TableCell, TableRow } from "@material-ui/core";

const OrderTableItem = (props) => {
  // eslint-disable-next-line
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    order_entry_data,
    update_order_entry_data,
    delete_order_entry_data,
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
                href={`#/admin_panel/order_details?order_id=${order_entry_data._id}&product_id=${order_entry_data.product}&redirect=order`}
                style={{ textDecoration: "none" }}
              >
                {order_entry_data._id}
              </a>
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {order_entry_data.customer}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          <a
            href={`#/admin_panel/product_details?product_id=${order_entry_data.product}&redirect=order`}
            style={{ textDecoration: "none" }}
          >
            {order_entry_data.product}
          </a>
        </Typography>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {order_entry_data.order_price}
        </Typography>
      </TableCell>

      <TableCell>
        <Chip
          sx={{
            pl: "4px",
            pr: "4px",
            backgroundColor:
              order_entry_data.payment_status === "active"
                ? "success.main"
                : "error.main",
            color: "#fff",
          }}
          size="small"
          label={
            order_entry_data.payment_status === "active"
              ? "Completed"
              : "Pending"
          }
        ></Chip>
      </TableCell>

      <TableCell>
        <i
          className="fa-solid fa-pen-to-square"
          onClick={() => {
            update_order_entry_data(order_entry_data);
            handleClose();
          }}
          style={{ cursor: "pointer", color: "blue" }}
        ></i>
        <i
          className="fa-solid fa-trash"
          style={{ marginLeft: "1rem", cursor: "pointer", color: "red" }}
          onClick={() => {
            delete_order_entry_data(order_entry_data);
            handleClose();
          }}
        ></i>
      </TableCell>
    </TableRow>
  );
};

export default OrderTableItem;
