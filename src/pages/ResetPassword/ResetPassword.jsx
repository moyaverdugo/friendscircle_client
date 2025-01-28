import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ButtonNext from '../../components/ButtonNext/ButtonNext.jsx';
import "./ResetPassword.scss";

const baseUrl = import.meta.env.VITE_APP_SERVER_URL;
const resetPasswordUrl = `${baseUrl}/reset/reset-password`; // Backend route for resetting password

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({
    password: "",
    retypepassword: "",
  });
  const [tokenValid, setTokenValid] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [token, setToken] = useState(""); // Store the token

  // Extract the token from the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setTokenValid(false); // Invalid token, no token provided in URL
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    if (!inputs.password || !inputs.retypepassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (inputs.password !== inputs.retypepassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear error on successful validation

    try {
      // Send the new password and token to the backend
      const response = await axios.post(resetPasswordUrl, {
        token,
        newPassword: inputs.password,
      });

      if (response.status === 200) {
        alert("Your password has been reset successfully!");
        navigate("/login"); // Redirect to login page after successful password reset
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Invalid or expired token.");
        setTokenExpired(true); // Mark the token as expired
      } else {
        console.error("Error during password reset:", err);
        setError(err.response?.data?.error || "An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="RP__title">
        <h2>Reset Your Password</h2>
      </div>
      <div className="RP__text_container">
      {tokenValid ? (
        <>
          <form onSubmit={handleSubmit}>
            <label htmlFor="password">New Password</label>
            <input
              type="text"
              id="password"
              name="password"
              className="RP__input"
              value={inputs.password}
              onChange={handleInputChange}
            />

            <label htmlFor="retypepassword">Re-type New Password</label>
            <input
              type="text"
              id="retypepassword"
              name="retypepassword"
              className="RP__input"
              value={inputs.retypepassword}
              onChange={handleInputChange}
            />

            {/* Error message container */}
            <div className={`error-container ${error ? "visible" : "hidden"}`}>
              {error}
            </div>

            <ButtonNext text="Reset Password" />
          </form>
        </>
      ) : (
        <div className="error-container visible">
          {tokenExpired ? (
            <p>The reset password link has expired or is invalid.</p>
          ) : (
            <p>Invalid or missing token. Please request a new reset password link.</p>
          )}
        </div>
      )}
      </div>
    </div>

  );
};

export default ResetPassword;