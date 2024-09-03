import { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { getLocalStorageUser } from "../UTILS/localStorageUtils";
import { makeStyles } from "@mui/styles";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import { Appbars } from "../Components/resuables/appbar";
import { Favorite, FavoriteBorder, Padding } from "@mui/icons-material";
import PostService from "../services/postService";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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

const useStyles = makeStyles(() => ({
  uploadIcon: {
    fontSize: "20px",
    cursor: "pointer",
  },
}));

const SocialMedia = () => {
  const classes = useStyles();
  const [openAdd, setOpenAdd] = useState(false);
  const [post, setPost] = useState({ caption: "" });
  const [loading, setLoading] = useState(false);
  const user_id = getLocalStorageUser().user_id;
  const [postImage, setPostImage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await PostService.displayPosts();
      if (response.data.dislayMessages.status === 200) {
        const posts = response.data.dislayMessages.data;
  
        const updatedPosts = await Promise.all(
          posts.map(async (post) => {
            const profilePic = await UserService.getUserProfilePic(
              post.user_id
            );
            const username = await UserService.getusername(post.user_id);
            const likeStatus = await PostService.displaylike(post.post_id);
            const like_counts = await PostService.displayPostslikes(
              post.post_id
            );
            const hey = likeStatus.data.data;
            const userLiked = hey.some((like) => like.user_id === user_id);
            const like_count = like_counts.data.dislayMessages.data[0].like_count; // No JSON.stringify here
  
            return {
              ...post,
              profilePic: profilePic?.data?.profilePic || "",
              username: username?.data?.user[0].username || "",
              isLiked: userLiked,
              like_count: like_count || 0, // Ensure like_count is a number
            };
          })
        );
  
        setRows(updatedPosts);
      } else {
        console.error("Invalid response structure", response);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  

  useEffect(() => {
    setOpenBackdrop(true);
    setTimeout(() => {
      setOpenBackdrop(false);
      fetchPosts();
    }, 800);
   
  }, [user_id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
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
        Uploads
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

  const handleLike = async (post_id, isLiked) => {
   
    try {
      const updatedRows = rows.map((row) => {
        if (row.post_id === post_id) {
          return {
            ...row,
            isLiked: !isLiked,
            like_count: isLiked ? row.like_count - 1 : row.like_count + 1,
          };
        }
        return row;
      });

      setRows(updatedRows);

      if (isLiked) {
        setOpenBackdrop(true);
        setTimeout(() => {
          setOpenBackdrop(false);
          setSnackbarOpen(true);  
          
         
            setSnackbarMessage("Post is disliked successfully!");
        setSnackbarSeverity("success");
         
        }, 1500);  
        
        const a = await PostService.removelike(post_id, user_id);
        
        
      } else {
        setOpenBackdrop(true);
        await PostService.addlike(post_id, user_id);
        setTimeout(() => {
          setOpenBackdrop(false);
          setSnackbarOpen(true);  
          
         
            setSnackbarMessage("Post is liked successfully!");
        setSnackbarSeverity("success");
         
        }, 1500);  
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleSend = async () => {
    setOpenBackdrop(true);
    const { caption } = post;
    if (caption.trim() !== "" || postImage !== "") {
      setLoading(true);
      try {
        const response = await PostService.addPost(
          post.caption,
          user_id,
          postImage
        );
        if (response.status === 200) {
          setPost({ caption: "" });
          setPostImage("");
          setOpenAdd(false);
          setTimeout(() => {
            setOpenBackdrop(false);
           
              setSnackbarMessage("The Post is added successfully!");
          setSnackbarSeverity("success");
           
          }, 1500);  
          navigate("/home");
        } else {
          console.error("Error adding item:", response.data.message);
        }
      } catch (error) {
        console.error("Error adding item:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Caption or image is required");
    }
  };

  const handleAddClickOpen = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Appbars />
      <main className="main">
        <Container>
          <Box sx={{ marginTop: 7 }}>
            <form
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 20,
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
              }}
            >
              
              <TextField
                placeholder="What's on your mind, Freecodez?"
                id="create-post"
                fullWidth
                sx={{ marginRight: 2 }}
              />
              <Button
                onClick={handleAddClickOpen}
                variant="contained"
                color="primary" 
              >
                Create
              </Button>
            </form>

            <Box sx={{ paddingX: 48 }}>
              {/* {rows.map((row) => (
                <Card
                  key={row.post_id}
                  sx={{
                    marginBottom: 1,
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        src={require(`../Components/Images/${row.profilePic}`)}
                        alt={row.username}
                      />
                    }
                    title={row.username}
                  />

                  <CardMedia
                    component="img"
                    height="250"
                    image={require(`../Components/PostImages/${row.post_image}`)}
                    alt={row.caption}
                  />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <IconButton
                      aria-label="like"
                      onClick={() => handleLike(row.post_id, row.isLiked)}
                    >
                      {row.isLiked ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  <Typography variant="body2" style={{ paddingLeft: "8px" }}>
                    {"            "} Liked by{" "}
                    <strong>{row.like_count} people</strong>
                  </Typography>
                  <CardContent>
                    <Typography
                      variant="body2"
                      style={{ paddingBottom: "18px" }}
                    >
                      <strong>{row.username}</strong> {row.caption}
                    </Typography>
                  </CardContent>
                </Card>
              ))} */}
              {rows.map((row) => (
                <Card
                  key={row.post_id}
                  sx={{
                    marginBottom: 1,
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        src={require(`../Components/Images/${row.profilePic}`)}
                        alt={row.username}
                      />
                    }
                    title={row.username}
                  />

                  {row.post_image.endsWith(".mp4") ? (
                    <video
                      controls
                      width="100%"
                      height="250"
                      style={{ borderRadius: "8px" }}
                    >
                      <source
                        src={require(`../Components/PostImages/${row.post_image}`)}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <CardMedia
                      component="img"
                      height="250"
                      image={require(`../Components/PostImages/${row.post_image}`)}
                      alt={row.caption}
                    />
                  )}

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <IconButton
                      aria-label="like"
                      onClick={() => handleLike(row.post_id, row.isLiked)}
                    >
                      {row.isLiked ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  <Typography variant="body2" style={{ paddingLeft: "8px" }}>
                    {" "}
                    Liked by <strong>{row.like_count} people</strong>
                  </Typography>
                  <CardContent>
                    <Typography
                      variant="body2"
                      style={{ paddingBottom: "18px" }}
                    >
                      <strong>{row.username}</strong> {row.caption}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Dialog open={openAdd} onClose={handleAddClose}>
              <DialogTitle>Post Section</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  id="caption"
                  label="caption"
                  fullWidth
                  value={post.caption}
                  onChange={(e) =>
                    setPost({ ...post, caption: e.target.value })
                  }
                />
                <InputFileUpload />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleAddClose}>Cancel</Button>
                <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  onClick={handleSend}
                  startIcon={<SendIcon />}
                  variant="contained"
                  disabled={post.caption.trim() === ""}
                >
                  Send
                </LoadingButton>
              </DialogActions>
            </Dialog>
          </Box>
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

export default SocialMedia;
