import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate if you want to navigate
import "./ForgotPassword.scss";
import axios from "axios";
import ButtonNext from '../../components/ButtonNext/ButtonNext.jsx';
import logo from '../../assets/logo/logo.png';

const baseUrl = import.meta.env.VITE_APP_SERVER_URL;
const forgotPasswordUrl = `${baseUrl}/forgot/forgot-password`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();  // Optional: for redirect after success

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailMessage("Please enter a valid email address.");
      setIsEmailError(true);
      return;
    }

    try {
      // Send email to backend to trigger password reset process
      await axios.post(forgotPasswordUrl, { email });

      setIsEmailSent(true);
      setEmailMessage("A reset password link has been sent to your email.");
      setIsEmailError(false);
      
      // Optionally navigate to another page (e.g., login)
      navigate("/login"); // Redirect to login page after submitting the email
    } catch (error) {
      console.error(error);
      setEmailMessage("The email provided doesn't exist. Please try again.");
      setIsEmailError(true);
    }
  };

  return (
    <div className="page-container">
      <img src={logo} className="logo" alt="logo" />
      <form onSubmit={handleForgotPassword}>
        <div className="FP__text_container">
          <label htmlFor="email">Email</label>
          <div className="FP__text_container--email">
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={`error-container ${isEmailError ? "visible" : "hidden"}`}>
            {emailMessage}
          </div>
          <div className="FP__text">
            <p>We will send you a reset password link to your email.</p>
          </div>
        </div>
        <ButtonNext text="Send Reset Link" />
      </form>

      {isEmailSent && (
        <div className="success-message">
          <p>Check your email for the reset password link.</p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;