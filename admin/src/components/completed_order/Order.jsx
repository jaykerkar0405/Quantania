import React from "react";
import OrderTable from "./OrderTable";
import { Card, CardContent, Box, Typography } from "@material-ui/core";

const Category = () => {
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Order Panel</Typography>
          <Box
            
          >
            <OrderTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Category;
