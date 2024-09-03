import { useState, useEffect } from "react";
import { getLocalStorageUser } from "../../UTILS/localStorageUtils";
import UserService from "../../services/UserService";
import {
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const styles = {
  navbarBrand: {
    color: "#fff",
    textDecoration: "none",
  },
  profilePhoto: {
    width: "56px",
    height: "56px",
  },
  profilePhotos: {
    width: "100px",
    height: "100px",
  },
  flexMenu: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    listStyle: "none",
    paddingX: 10,
    margin: 0,
  },
  flexMenuItem: {
    marginRight: "40px",
  },
  lastFlexMenuItem: {
    marginRight: 0,
  },
  viewOverlay: {
    position: "relative",
    overflow: "hidden",
    marginBottom: "20px",
  },
  mask: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  whiteText: {
    color: "#fff",
  },
};

export const useStyles = makeStyles((theme) => ({
  profileCard: {
    background: "#FFB300",
    width: "300px",
    height: "400px",
    position: "relative",
    margin: "20px auto",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    animation: `$fadeIn 1s ease-out`,
  },
  profileCardHeader: {
    width: "100%",
    padding: "20px",
    background: "#FFFFFF",
    color: "#000000",
    borderBottom: "1px solid #EEEEEE",
    position: "relative",
  },
  profileCardHeaderH1: {
    color: "#FF5722",
    margin: "10px 0",
  },
  profileCardHeaderImg: {
    position: "relative",
    width: "120px",
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  profileCardAvatar: {
    width: "100px",
    height: "100px",
    fontSize: "48px",
  },
  uploadIcon: {
    position: "absolute",
    bottom: "20px",
    right: "27px",
    fontSize: "20px",
    color: "#000000",
    cursor: "pointer",
  },
  profileBio: {
    padding: "20px",
    background: "#FFFFFF",
    color: "#333333",
    flex: 1,
  },
  profileSocialLinks: {
    width: "100%",
    padding: "10px 20px",
    background: "#FFFFFF",
    borderTop: "1px solid #EEEEEE",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSocialLinksItem: {
    listStyle: "none",
    margin: "0 10px",
  },
  profileSocialLinksItemA: {
    display: "block",
    color: "#333",
    width: "24px",
    height: "24px",
    fontSize: "18px",
    textAlign: "center",
    lineHeight: "24px",
  },

  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

export const Appbars = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElAccount, setAnchorElAccount] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getLocalStorageUser().user_id;

    UserService.getUserProfilePic(userId)
      .then((response) => {
        const imageUrl = require(`../Images/${response.data.profilePic}`);
        setProfilePic(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching profile picture:", error);
      });
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuOpen = (event) => {
    setAnchorElAccount(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorElAccount(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate('/sign-in')
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#000000" }}>
      <Toolbar>
        <Typography variant="h6" component="a" href="#" sx={styles.navbarBrand}>
          <NavLink className="nav-link" to="/home">
            Explore
          </NavLink>
        </Typography>

        
        <List sx={{ display: "flex", marginLeft: "20px" }}>
          <ListItem button>
            <NavLink className="nav-link" to="/home">
              <ListItemText primary="Home" />
            </NavLink>
          </ListItem>

          <ListItem
            button
            aria-controls="account-menu"
            aria-haspopup="true"
            onClick={handleAccountMenuOpen}
          >
            <NavLink className="nav-link" to="/profile">
              <ListItemText primary="Account" />
            </NavLink>
          </ListItem>
        </List>

        <Box sx={{ flexGrow: 1 }} />
        <Avatar src={profilePic} alt="" sx={styles.profilePhoto} onClick={handleAccountMenuOpen} />
        <Menu
          id="account-menu"
          anchorEl={anchorElAccount}
          open={Boolean(anchorElAccount)}
          onClose={handleMenuClose}
        >
         
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
