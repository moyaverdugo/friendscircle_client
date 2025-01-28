import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext"; // Import useUser to access context
import view from '../../assets/icons/views.svg';
import logo from '../../assets/logo/logo.png';
import ButtonLogin from '../../components/ButtonLogin/ButtonLogin';
import ButtonSignup from '../../components/ButtonSignup/ButtonSignup.jsx';
import ButtonForgot from '../../components/ButtonForgot/ButtonForgot.jsx';
import "./Login.scss";

const baseUrl = import.meta.env.VITE_APP_SERVER_URL;
const loginUrl = `${baseUrl}/login`;

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { setUser } = useUser(); // Access setUser from UserContext
  const [isLoginError, setIsLoginError] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [isPhoneError, setIsPhoneError] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    const phoneNumber = `${countryCode}${e.target.phone.value}`;
    const password = e.target.password.value;
  
    // Validate phone number
    if (!/^\d+$/.test(e.target.phone.value)) {
      setPhoneMessage("Phone number must contain only digits.");
      setIsPhoneError(true);
      return;
    }
  
    try {
      const response = await axios.post(loginUrl, {
        username: phoneNumber,
        password,
      });
  
      // Save the auth token in session storage
      sessionStorage.setItem("authToken", response.data.token);
  
      // Extract user data from the response
      const userData = response.data.user;
  
      if (userData) {
        setUser(userData); // Update user context with the fetched user data
        setIsLoggedIn(true); // Mark the user as logged in
        navigate("/home"); // Redirect to the home page
      } else {
        console.error("User data not returned from the server.");
        setLoginMessage("Failed to retrieve user information. Please try again.");
        setIsLoginError(true);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
  
      if (error.response && error.response.data.error) {
        // If error is related to wrong password or any other issue, display the appropriate message
        if (error.response.data.error === "Invalid password") {
          setLoginMessage("Incorrect password. Please try again.");
        } else {
          setLoginMessage(error.response.data.error); 
        }
      } else {
        setLoginMessage("Phone number doesn't exist. Please try again.");
      }
  
      setIsLoginError(true);
      setIsLoggedIn(false);
    }
  };
  

  return (
    <div className="page-container">
      <img src={logo} className="logo" alt="logo" />
      <form onSubmit={handleLogin}>
        <div className="login__text_container">
          <label htmlFor="phone">Phone Number</label>
          <div className="phone-container">
            <select
              name="countryCode"
              id="countryCode"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option value="+1">(+1)</option>
              <option value="+44">(+44)</option>
              <option value="+52">(+52)</option>
              <option value="+56">(+56)</option>
              <option value="+61">(+61)</option>
              <option value="+81">(+81)</option>
              <option value="+82">(+82)</option>
              <option value="+86">(+86)</option>
              <option value="+91">(+91)</option>
            </select>
            <input
              type="text"
              id="phone"
              name="phone"
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setIsPhoneError(false);
                }
              }}
            />
          </div>
          <div className={`error-container ${isPhoneError ? "visible" : "hidden"}`}>
            {phoneMessage}
          </div>
        </div>

        <div className="login__text_container">
          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              onChange={() => {
                if (isLoginError) setIsLoginError(false);
              }}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={togglePasswordVisibility}
            >
              <img src={view} alt={showPassword ? "Hide Password" : "Show Password"} />
            </button>
          </div>
          <div className={`error-container ${isLoginError ? "visible" : "hidden"}`}>
            {loginMessage}
          </div>
        </div>

        <ButtonLogin text="Login" />
        <ButtonSignup path="/signup" text="Join as new user" />
        <ButtonForgot path="/forgot_password" text="Forgot password?" />
      </form>
    </div>
  );
};

export default LoginPage;