import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.scss";

import LoginPage from "./pages/Login/Login.jsx";
import SignUpPage from "./pages/SignUp/SignUp.jsx";
import VerificationPage from "./pages/Verification/Verification.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPassword.jsx";
import SetUpPage from "./pages/SetUp/SetUp.jsx";
import ActivationPage from "./pages/Activation/Activation.jsx";
import ResetPasswordPage from "./pages/ResetPassword/ResetPassword.jsx";

import HomePage from "./pages/Home/Home.jsx";
import Connections from "./pages/Connections/Connections.jsx";
import Nav from "./components/Nav/Nav.jsx";

import { UserProvider, useUser } from "./context/UserContext.jsx"; // UserProvider wraps the app

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manages logged-in state
  const { user, isLoading } = useUser(); // Access user and loading state from context

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true); // If user exists, they are logged in
    } else {
      setIsLoggedIn(false); // If no user, not logged in
    }
  }, [user]); // Re-check login status whenever user data changes

  if (isLoading) {
    return <div>Loading...</div>; // Show loading until user data is fetched
  }

  return (
    <UserProvider>
      <BrowserRouter>
        <div className="diagonal-background"></div>

        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/connections" element={<Connections />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/verification" element={<VerificationPage />} />
              <Route path="/forgot_password" element={<ForgotPasswordPage />} />
              <Route path="/setup" element={<SetUpPage />} />
              <Route path="/activation" element={<ActivationPage />} />
              <Route path="/reset/reset-password" element={<ResetPasswordPage />} />
            </>
          )}
        </Routes>

        {isLoggedIn && <Nav />}
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;