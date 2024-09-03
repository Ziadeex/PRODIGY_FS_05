const express = require("express");
const {
  authenticateController,
  registerController,
  retrieveusernameController,
} = require("../controllers/authController");

const {
  setProfileController,
  displayprofilecontroller,
} = require("../controllers/setprofileController");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../socialMedia/src/Components/Images/"));
  },
  filename: function (req, file, cb) {
    console.log(`file.originalname ${file.originalname}`)
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.post("/register", registerController);
router.put(
  "/setuploadPic",
  upload.single("profilePic"),
  (req, res, next) => {
    console.log(`wrong`)
    if (!req.file) {
      console.log(`wrong2`)
      return res.status(400).json({ message: "No file received" });
    }
    next();
  }
  
  ,
  setProfileController
);
router.get("/getuploadPic", displayprofilecontroller);
router.post("/authenticate", authenticateController);
router.get("/retrieveusernameController", retrieveusernameController);

module.exports = router;
