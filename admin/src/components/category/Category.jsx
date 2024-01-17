import React from "react";
import CategoryTable from "./CategoryTable";
import { Card, CardContent, Box, Typography } from "@material-ui/core";

const Category = () => {
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Category Panel</Typography>
          <Box
            
          >
            <CategoryTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Category;
