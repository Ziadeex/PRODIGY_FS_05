import React, { useState } from "react";
import UserService from "../services/UserService";
import { setLocalStorageUser } from "../UTILS/localStorageUtils";
import { useNavigate, NavLink } from "react-router-dom";
import signformstyles from "../Components/style/css/signform";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SignUpForms = ({ onRegister }) => {
  const navigate = useNavigate();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleregister = async (e) => {
    e.preventDefault();
    if (formData.email !== "" && formData.password !== "") {
      setOpenBackdrop(true);
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);

      try {
        const result = await UserService.register(formData);

        if (result?.data?.message === "Successful") {
          setTimeout(() => {
            setOpenBackdrop(false);
            setSnackbarOpen(true);  
            setTimeout(() => {
          let authenticatedUser = result?.data?.user;
          authenticatedUser.token = result?.data?.token;
          setLocalStorageUser(authenticatedUser);
          onRegister();
          navigate("/sign-in");
        }, 2000);  
      }, 3000);  
    } else {
      setOpenBackdrop(false);  
    }
      } catch (error) {
        console.error("Registration error:", error);
        alert("Error in registration. Please try again.");
        reset();
        setOpenBackdrop(false); 
      }
    }
  };

  const reset = () => {
    setFormData("");
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
        <form onSubmit={handleregister} style={signformstyles.form}>
          <div style={signformstyles.closeForm}></div>
          <div style={signformstyles.formBody}>
            <div style={signformstyles.welcomeLines}>
              <div style={signformstyles.wLine2}>Let's Register</div>
            </div>
            <div style={signformstyles.inputArea}>
              <div style={signformstyles.fInp}>
                <input
                  type="text"
                  placeholder="username"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={signformstyles.input}
                />
              </div>
              <div style={signformstyles.fInp}>
                <input
                  type="email"
                  id="email"
                  placeholder="email"
                  style={signformstyles.input}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div style={signformstyles.fInp}>
                <input
                  type="password"
                  id="password"
                  placeholder="password"
                  style={signformstyles.input}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div style={signformstyles.submitButtonCvr}>
              <button type="submit" style={signformstyles.submitButton}>
                REGISTER
              </button>
            </div>
            <p style={signformstyles.welcomeLines1}>
              Already a member?{" "}
              <a href="/sign-in" style={signformstyles.welcomeLines2}>
                Sign in
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
          Successfully Registered!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignUpForms;
