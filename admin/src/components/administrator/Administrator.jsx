import React from "react";
import AdministratorTable from "./AdministratorTable";
import { Card, CardContent, Box, Typography } from "@material-ui/core";

const Administrator = () => {
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Administrator Panel</Typography>
          <Box>
            <AdministratorTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Administrator;
