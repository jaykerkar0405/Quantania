import React from "react";
import BannerTable from "./BannerTable";
import { Card, CardContent, Box, Typography } from "@material-ui/core";

const Banner = () => {
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Banner Panel</Typography>
          <Box>
            <BannerTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Banner;
