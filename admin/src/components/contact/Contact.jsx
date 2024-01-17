import React from "react";
import ContactTable from "./ContactTable";
import { Card, CardContent, Box, Typography } from "@material-ui/core";

const Contact = () => {
  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Contact Panel</Typography>
          <Box
            
          >
            <ContactTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Contact;
