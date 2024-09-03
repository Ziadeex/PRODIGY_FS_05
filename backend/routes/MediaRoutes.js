const express = require("express");
const {
  addPostController,
  displayPostsController,
  removelikecontroller,
  addlikecontroller,
  getlikescontroller,
  getpostlikescontroller,
  getdisplayUsersPostscontroller,
} = require("../controllers/PostController");

const router = express.Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../../socialMedia/src/Components/PostImages/")
    );
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.get("/displayPosts", displayPostsController);
router.post(
  "/addPost",
  upload.single("postImage"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "Nothing received" });
    }
    next();
  },
  addPostController
);
router.get("/getlikes", getlikescontroller);
router.post("/addlike", addlikecontroller);
router.delete("/removelike", removelikecontroller);
router.get("/displayPostslikes", getpostlikescontroller);
router.get("/displayUsersPosts", getdisplayUsersPostscontroller);

module.exports = router;
