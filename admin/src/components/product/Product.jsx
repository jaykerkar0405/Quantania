import React from "react";
import ProductTable from "./ProductTable";
import { Card, CardContent, Box, Typography } from "@material-ui/core";

const Product = () => {
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Product Panel</Typography>
          <Box
            
          >
            <ProductTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Product;
