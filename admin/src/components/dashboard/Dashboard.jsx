import React, { useEffect } from "react";
import { Grid, Box } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import {
  RecentProduct,
  RecentCategory,
  RecentOrder,
  SalesOverview,
} from "./dashboard_items";

const Dashboard = (props) => {
  let navigate = useNavigate();
  useEffect(() => {
    document.title = "Dashboard - Quantania Admin Panel";
    if (!localStorage.getItem("administrator_authentication_token")) {
      navigate(`/admin_panel/login`);
    }
    //eslint-disable-next-line
  }, []);
  return (
    <>
      <Box>
        <Grid container spacing={0}>
          <Grid item xs={12} lg={12}>
            <SalesOverview />
          </Grid>
          <div className="row">
            <div className="col-lg-4">
              <RecentProduct />
            </div>
            <div className="col-lg-4">
              <RecentCategory />
            </div>
            <div className="col-lg-4">
              <RecentOrder />
            </div>
          </div>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
