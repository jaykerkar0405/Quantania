import React from "react";
import { Chip, Box, Typography, TableCell, TableRow } from "@material-ui/core";

const PaymentTableItem = (props) => {
  const { payment, sr_no } = props;

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
              {payment._id}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {payment.razorpay_order_price.replace("00", "")}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {payment.razorpay_order_id}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {payment.razorpay_payment_id}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography color="textSecondary" variant="h6">
          {payment.razorpay_signature.slice(0, 25)}
        </Typography>
      </TableCell>

      <TableCell>
        <Chip
          sx={{
            pl: "4px",
            pr: "4px",
            backgroundColor:
              payment.razorpay_payment_status === true
                ? "success.main"
                : "error.main",
            color: "#fff",
          }}
          size="small"
          label={
            payment.razorpay_payment_status === true ? "Completed" : "Pending"
          }
        ></Chip>
      </TableCell>
    </TableRow>
  );
};

export default PaymentTableItem;
