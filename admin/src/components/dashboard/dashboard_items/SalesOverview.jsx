import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { RefreshOutlined } from "@material-ui/icons/";
import Spinner from "../../spinner/Spinner";

const SalesOverview = () => {
  const initial_state = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const navigate = useNavigate();
  let minimum, maximum;

  const [order_count, set_order_count] = useState(initial_state);
  const [product_count, set_product_count] = useState(initial_state);
  const [customer_count, set_customer_count] = useState(initial_state);
  const [administrator_count, set_administrator_count] =
    useState(initial_state);
  const [loading, set_loading] = useState(true);

  const fetch_statistical_data = async () => {
    const request = await fetch(
      `${process.env.REACT_APP_SERVER_SIDE_URL}/api/statistics/statistical_data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          administrator_authentication_token: localStorage.getItem(
            "administrator_authentication_token"
          ),
        },
      }
    );
    const response = await request.json();
    set_order_count(response.order_result);
    set_product_count(response.product_result);
    set_customer_count(response.customer_result);
    set_administrator_count(response.administrator_result);
    set_loading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("administrator_authentication_token")) {
      fetch_statistical_data();

      // eslint-disable-next-line
      minimum = Math.min(
        Math.min(...order_count),
        Math.min(...product_count),
        Math.min(...customer_count),
        Math.min(...administrator_count)
      );

      // eslint-disable-next-line
      maximum = Math.max(
        Math.max(...order_count),
        Math.max(...product_count),
        Math.max(...customer_count),
        Math.max(...administrator_count)
      );
    } else {
      navigate(`/admin_panel/login`);
    }
    // eslint-disable-next-line
  }, []);

  const optionssalesoverview = {
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        endingShape: "rounded",
        borderRadius: 5,
      },
    },

    colors: ["#1e4db7", "#1a97f5", "#1ddb0f", "#fa052a"],
    fill: {
      type: "solid",
      opacity: 1,
    },
    chart: {
      offsetX: -15,
      toolbar: {
        show: false,
      },
      foreColor: "#adb0bb",
      fontFamily: "'DM Sans',sans-serif",
      sparkline: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    yaxis: {
      show: true,
      min: minimum,
      max: maximum,
      tickAmount: 3,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
    },
  };
  const seriessalesoverview = [
    {
      name: "Order",
      data: order_count,
    },
    {
      name: "Customer",
      data: customer_count,
    },
    {
      name: "Administrator",
      data: administrator_count,
    },
    {
      name: "Product",
      data: product_count,
    },
  ];
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          paddingBottom: "0",
        }}
      >
        <CardContent
          sx={{
            paddingBottom: "16px !important",
          }}
        >
          <Box
            sx={{
              display: {
                sm: "flex",
                xs: "block",
              },
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  marginBottom: "0",
                }}
                gutterBottom
              >
                Sales Overview
              </Typography>
            </Box>
            <Box
              sx={{
                marginLeft: "auto",
                display: "flex",
                mt: {
                  lg: 0,
                  xs: 2,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "secondary.main",
                    borderRadius: "50%",
                    height: 8,
                    width: 8,
                    mr: 1,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "secondary.main",
                  }}
                >
                  Order
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "primary.main",
                    borderRadius: "50%",
                    height: 8,
                    width: 8,
                    mr: 1,
                  }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                  }}
                >
                  Customer
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#1ddb0f",
                    borderRadius: "50%",
                    height: 8,
                    width: 8,
                    mr: 1,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1ddb0f",
                  }}
                >
                  Administrator
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#fa052a",
                    borderRadius: "50%",
                    height: 8,
                    width: 8,
                    mr: 1,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fa052a",
                  }}
                >
                  Product
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                  padding: "0 2rem",
                }}
              >
                <RefreshOutlined
                  style={{
                    position: "absolute",
                    right: "5rem",
                    top: "8.5rem",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    set_loading(true);
                    fetch_statistical_data();
                  }}
                />
              </Box>
            </Box>
          </Box>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Box
                sx={{
                  marginTop: "25px",
                }}
              >
                <Chart
                  options={optionssalesoverview}
                  series={seriessalesoverview}
                  type="bar"
                  height="295px"
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SalesOverview;
