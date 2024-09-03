import React, { useState, useEffect, useRef } from "react";
import { Container, Grid, Avatar, Typography, Box } from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { styled } from "@mui/material/styles";
import { Appbars, styles, useStyles } from "../Components/resuables/appbar";
import { getLocalStorageUser } from "../UTILS/localStorageUtils";
import UserService from "../services/UserService";
import PostService from "../services/postService";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SocialMediaProfile = () => { 
  const classes = useStyles();
  const [profilePic, setProfilePic] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openBackdrop, setOpenBackdrop] = useState(false);

  useEffect(() => {
    setOpenBackdrop(true);
    setTimeout(() => {
      setOpenBackdrop(false);
      
   
    const userId = getLocalStorageUser().user_id;

    
    UserService.getUserProfilePic(userId)
      .then((response) => {
        const imageUrl = require(`../Components/Images/${response.data.profilePic}`);
        setProfilePic(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching profile picture:", error);
      });

    PostService.displayUsersPosts(userId)
      .then((response) => {
        if (Array.isArray(response.data.dislayMessages.data)) {
          setUserPosts(response.data.dislayMessages.data);
        } else {
          console.error(
            "Expected an array of posts but received:",
            response.data.dislayMessages.data
          );
          setUserPosts([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching user posts:", error);
        setUserPosts([]);
      });

        
    }, 1500);  
  }, []);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleFileChange = async (e) => {
    setOpenBackdrop(true);
    const file = e.target.files[0]; 
    if (file) {
      const user_id = getLocalStorageUser().user_id;
      const result = await UserService.setUserProfilePic(user_id, file);
      if (result.status === 200) {
       
        const updatedImageUrl = `../Components/Images/${result.data.profilePic}`;
        setProfilePic(updatedImageUrl);
        setTimeout(() => {
          setOpenBackdrop(false);
          setSnackbarOpen(true);  
         
         
            setSnackbarMessage("Profile Updated successfully!");
        setSnackbarSeverity("success");
         
        }, 1500);  
      }
    }
  };

  const InputFileUpload = () => {
    const fileInputRef = useRef(null);

    const handleIconClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    return (
      <div>
        <InsertPhotoIcon
          onClick={handleIconClick}
          className={classes.uploadIcon}
        />
        <VisuallyHiddenInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    );
  };

  
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

return (
  <>
    {/* Navbar AppBar */}
    <Appbars />

    {/* Main content */}
    <main>
      <Container sx={{ mt: 9 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item md={20} sx={{ textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar src={profilePic} alt="" sx={styles.profilePhotos} />
              <Box sx={{ position: "absolute", bottom: -10, right: -10 }}>
                <InputFileUpload />
              </Box>
            </Box>
          </Grid>

          <Grid item md={91} sx={{ justifyContent: "center",textAlign: "center" }}>
            <Typography variant="h4" component="h2">
              @{getLocalStorageUser().username}{" "}
            </Typography>
            <ul style={styles.flexMenu}>
              <li style={styles.flexMenuItem}>
                <strong>{userPosts.length}</strong> posts
              </li>
            </ul>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {userPosts.map((post, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Box sx={styles.viewOverlay}>
                <img
                  src={require(`../Components/PostImages/${post.post_image}`)}
                  style={{ width: "100%", height:"270px" }}
                  alt=""
                />
                <Box sx={styles.mask}>
                  <ul style={styles.flexMenu}>
                    <li style={styles.lastFlexMenuItem}>
                      <Typography sx={styles.whiteText}>
                        <FavoriteIcon /> {post.like_count}
                      </Typography>
                    </li>
                  </ul>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </main>
  </>
);
};

export default SocialMediaProfile;