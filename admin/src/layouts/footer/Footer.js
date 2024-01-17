import React from "react";
import { Box, Link, Typography } from "@material-ui/core";
const Footer = () => {
  let year = new Date().getFullYear();
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography>
        © {year} All rights reserved by{" "}
        <Link
          href={`${process.env.REACT_APP_ADMIN_PANEL_URL}`}
          style={{ textDecoration: "none" }}
        >
          Quantania and team
        </Link>{" "}
      </Typography>
    </Box>
  );
};

export default Footer;
