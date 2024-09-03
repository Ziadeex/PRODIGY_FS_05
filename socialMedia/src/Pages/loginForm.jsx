import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import {
  getLocalStorageUser,
  setLocalStorageUser,
} from "../UTILS/localStorageUtils";
import signformstyles from "../Components/style/css/signform";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SigninForms = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const reset = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email !== "" && password !== "") {
      setOpenBackdrop(true);
      const user = {
        email: email,
        password,
      };
      const result = await UserService.authenticate({ user }).catch((error) => {
        alert("Wrong username/password");
        reset();
        setOpenBackdrop(false); 
      });

      if (result?.data?.message === "Successful") {
        let authenticatedUser = result?.data?.user;
        authenticatedUser.token = result?.data?.token;
        setLocalStorageUser(authenticatedUser);
        getLocalStorageUser();
        onLogin();

        
        setTimeout(() => {
          setOpenBackdrop(false);
          setSnackbarOpen(true);  
          setTimeout(() => {
            navigate("/home");
          }, 2000);  
        }, 3000);  
      } else {
        setOpenBackdrop(false);  
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div style={signformstyles.cover}>
      <div style={signformstyles.formUI}>
        <form onSubmit={handleLogin} style={signformstyles.form}>
          <div style={signformstyles.closeForm}></div>
          <div style={signformstyles.formBody}>
            <div style={signformstyles.welcomeLines}>
              <div style={signformstyles.wLine1}>Hi,</div>
              <div style={signformstyles.wLine2}>Welcome Back</div>
            </div>
            <div style={signformstyles.inputArea}>
              <div style={signformstyles.fInp}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="username/email"
                  style={signformstyles.input}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div style={signformstyles.fInp}>
                <input
                  type="password"
                  id="password"
                  placeholder="password"
                  name="password"
                  value={password}
                  style={signformstyles.input}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div style={signformstyles.submitButtonCvr}>
              <button type="submit" style={signformstyles.submitButton}>
                LOGIN
              </button>
            </div>
            <p style={signformstyles.welcomeLines1}>
              Not a member?{" "}
              <a href="/" style={signformstyles.welcomeLines2}>
                Sign up now
              </a>
            </p>
          </div>
        </form>
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Successfully Logged In!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SigninForms;
