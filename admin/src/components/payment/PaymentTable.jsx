import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshOutlined } from "@material-ui/icons/";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Box,
} from "@material-ui/core";
import PaymentTableItem from "./PaymentTableItem";
import NoRecords from "../error/NoRecords";
import Spinner from "../spinner/Spinner";

const PaymentTable = () => {
  let navigate = useNavigate();
  let sr_no = 0;
  const [payment, set_payment] = useState();

  const fetch_payment = async () => {
    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/payment/fetch_payment`;
    const request = await fetch(api_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await request.json();
    set_payment(response.payment);
  };

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_payment();
      document.title = "Payment Panel - Quantania Admin Panel";
    } else {
      navigate(`/admin_panel/login`);
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {payment ? (
        <>
          <Box>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h3">Payment Panel</Typography>
                <Box
                  sx={{
                    overflow: "hidden",
                    overflowX: "scroll",
                  }}
                >
                  <RefreshOutlined
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      top: "8.5rem",
                      right: "8rem",
                    }}
                    onClick={() => {
                      fetch_payment();
                    }}
                  />

                  <Table
                    aria-label="simple table"
                    sx={{
                      mt: 3,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography color="textDark" variant="h6">
                            Sr. No
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography color="textDark" variant="h6">
                            Id
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography color="textDark" variant="h6">
                            Order Price
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography color="textDark" variant="h6">
                            Order id
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography color="textDark" variant="h6">
                            Payment id
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography color="textDark" variant="h6">
                            Razorpay Signature
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography color="textDark" variant="h6">
                            Status
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payment.length === 0 && (
                        <div style={{ marginRight: "-62rem" }}>
                          <NoRecords />
                        </div>
                      )}
                      {payment &&
                        payment.map((element) => {
                          sr_no++;
                          return (
                            <PaymentTableItem
                              key={element._id}
                              payment={element}
                              sr_no={sr_no}
                            />
                          );
                        })}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default PaymentTable;
