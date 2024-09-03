import { useState } from "react";
import { BrowserRouter as Router, NavLink, Route, Routes } from "react-router-dom";
import SigninForms from "./Pages/loginForm";
import SocialMedia from "./Pages/socialMedia";
import SocialMediaProfile from "./Pages/socialmediaprofile";
import SignUpForms from "./Pages/RegisterForm";
 


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  };


  return (
    <Routes>
      <Route path="/" element={<SignUpForms onRegister={handleRegister} />} />
      <Route path="/sign-in" element={<SigninForms  onLogin={handleLogin}/>}/>
      <Route path="/profile" element={<SocialMediaProfile/>}/>
      <Route path="/home" element={<SocialMedia/>}/>
    </Routes>
  );
}

export default App;

