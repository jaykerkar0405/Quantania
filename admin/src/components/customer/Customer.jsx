import React from "react";
import CustomerTable from "./CustomerTable";
import { Card, CardContent, Box, Typography } from "@material-ui/core";

const Customer = () => {
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Customer Panel</Typography>
          <Box
            sx={{
              overflow: {
                xs: "auto",
                sm: "unset",
              },
            }}
          >
            <CustomerTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Customer;
