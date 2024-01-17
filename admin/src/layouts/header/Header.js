import React, { useEffect } from "react";
import MenuOutlinedIcon from "@material-ui/icons/MenuOutlined";
import Settings from "@material-ui/icons/Settings";
import Logout from "@material-ui/icons/Logout";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  Button,
  Divider,
  ListItemIcon,
  Avatar,
} from "@material-ui/core";
import Spinner from "../../components/spinner/Spinner";

const Header = (props) => {
  const [administrator_data, set_administrator_data] = React.useState({
    administrator_details: {
      username: "",
    },
    administrator_image: {
      image_url: "/administrator_image_preview.png",
    },
  });
  let navigate = useNavigate();
  const [anchorEl4, setAnchorEl4] = React.useState(null);

  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  const administrator_logout = () => {
    localStorage.removeItem("administrator_authentication_token");
    navigate(`admin_panel/login`);
  };

  const fetch_administrator_details = async () => {
    let administrator_authentication_token = localStorage.getItem(
      "administrator_authentication_token"
    );

    const api_url = `${process.env.REACT_APP_SERVER_SIDE_URL}/api/administrator/administrator_details/authentication_token`;
    const request = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        administrator_authentication_token: administrator_authentication_token,
      },
      body: JSON.stringify({}),
    });
    const request_result = await request.json();
    set_administrator_data(request_result.administrator_details);
  };

  useEffect(() => {
    fetch_administrator_details();
    //eslint-disable-next-line
  }, []);

  return (
    <>
      {administrator_data ? (
        <AppBar sx={props.sx} elevation={0} className={props.customClass}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={props.toggleMobileSidebar}
              sx={{
                display: {
                  lg: "none",
                  xs: "inline",
                },
              }}
            >
              <MenuOutlinedIcon width="20" height="20" />
            </IconButton>
            <Box flexGrow={1} />

            <Box
              sx={{
                width: "1px",
                backgroundColor: "rgba(0,0,0,0.1)",
                height: "25px",
                ml: 1,
              }}
            ></Box>
            <Button
              aria-label="menu"
              color="inherit"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleClick4}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {administrator_data && (
                  <Avatar
                    alt="administrator_image"
                    src={administrator_data.administrator_image.image_url}
                  />
                )}
              </Box>
            </Button>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl4}
              keepMounted
              open={Boolean(anchorEl4)}
              onClose={handleClose4}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              sx={{
                "& .MuiMenu-paper": {
                  width: "250px",
                  right: 0,
                  top: "70px !important",
                },
              }}
            >
              <MenuItem>
                <Box
                  sx={{
                    ml: 2,
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  Howdy, {administrator_data && administrator_data.username}
                </Box>
              </MenuItem>
              <Divider />

              <a
                href="#/admin_panel/admin_account/view"
                style={{
                  textDecoration: "none",
                  color: "rgb(65 71 78)",
                }}
              >
                <MenuItem onClick={handleClose4}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  My account
                </MenuItem>
              </a>

              <MenuItem onClick={administrator_logout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Header;
