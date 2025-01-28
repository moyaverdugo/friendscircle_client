import { useState } from "react";
import { useNavigate } from "react-router-dom";  
import "./SignUp.scss";
import axios from "axios";
import ButtonNext from '../../components/ButtonNext/ButtonNext.jsx';
import logo from '../../assets/logo/logo.png';

const baseUrl = import.meta.env.VITE_APP_SERVER_URL;
const signupUrl = `${baseUrl}/signup`;

const SignUp = () => {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [isPhoneError, setIsPhoneError] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  
  const navigate = useNavigate();  // Initialize the navigate function

  const handleSignup = async (e) => {
    e.preventDefault();
    const phoneNumber = `${countryCode}${e.target.phone.value}`;
    console.log(phoneNumber);
    if (!/^\d+$/.test(e.target.phone.value)) {
      setPhoneMessage("Phone number must contain only digits.");
      setIsPhoneError(true);
      return;
    }
  
    try {
      await axios.post(signupUrl, { phoneNumber });
      sessionStorage.removeItem('phoneNumber'); // Clear old value
      sessionStorage.setItem("phone", phoneNumber);
      setIsSignedUp(true);
      navigate("/verification");  // Use navigate instead of window.location.href
    } catch (error) {
      console.error(error);
      setPhoneMessage("Failed to send verification code. Please try again.");
      setIsPhoneError(true);
    }
  };

  return (
    <div className="page-container">
      <img src={logo} className="logo" alt="logo" />
      <form onSubmit={handleSignup}>
        <div className="signup__text_container">
          <label htmlFor="signup__phone">Phone Number</label>
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
                  setIsPhoneError(false); // Reset error state if input is corrected
                }
              }}
            />
          </div>
          <div className={`error-container ${isPhoneError ? "visible" : "hidden"}`}>
            {phoneMessage}
          </div>
          <div className="signup__text">
            <p>We will send you a 6-digit code by text message to confirm your account.</p>
          </div>
        </div>
        <ButtonNext text="Verification" />
        <div>
          <p>SMS carrier charges may apply.</p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;