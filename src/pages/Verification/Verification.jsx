import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Verification.scss";
import axios from "axios";
import ButtonNext from '../../components/ButtonNext/ButtonNext.jsx';
import ButtonResend from '../../components/ButtonResend/ButtonResend.jsx';
import ButtonChangePhone from '../../components/ButtonChangePhone/ButtonChangePhone.jsx';
import logo from '../../assets/logo/logo.png';

const baseUrl = import.meta.env.VITE_APP_SERVER_URL;
const signupUrl = `${baseUrl}/verification`;


const Verification = () => {
 const navigate = useNavigate();
 const [inputs, setInputs] = useState({ d1: "", d2: "", d3: "", d4: "", d5: "", d6: "" });
 const [error, setError] = useState("");
 const phoneNumber = sessionStorage.getItem("phone");

    const handleInputChange = (e) => {
    const { name, value } = e.target;

        if (/^\d?$/.test(value)) {
        // Update state if value is a digit or empty
        setInputs((prev) => ({ ...prev, [name]: value }));

        // Move focus to the next input field if a digit is entered
            if (value && e.target.nextSibling) {
                e.target.nextSibling.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Consolidate the verification code
        const verificationCode = Object.values(inputs).join("");
        console.log("Request payload:", { phoneNumber: phoneNumber, code: verificationCode });

        if (verificationCode.length !== 6) {
          setError("Please enter all 6 digits of the verification code.");
          return;
        }
    
        // Perform the API call
        try {
          await axios.post(signupUrl, { phoneNumber: phoneNumber, code: verificationCode });
          console.log("Verification successful");
          navigate("/setup"); // Navigate after successful submission
        } catch (err) {
          console.error("Verification failed", err);
          setError("Verification failed. Please try again.");
        }
      };

    return(         
      <div className="page-container">
      <img src={logo} className="logo" alt="logo"></img>
      <form onSubmit={handleSubmit}>
      <div className="verification__text_container">
        <label htmlFor="verification">Enter the 6-digit Verification Code</label>
        <div className="verification__text">
            {["d1", "d2", "d3", "d4", "d5", "d6"].map((name, index) => (
              <input
                key={index}
                type="text"
                id={name}
                name={name}
                maxLength="1"
                value={inputs[name]}
                onChange={handleInputChange}
              />
            ))}
        </div>
        {error && <div className="error-container visible">{error}</div>}
        <div className="verification__description">
          <p>For phone number {phoneNumber}.</p>
        </div>
      </div>
        <ButtonNext text="Next" />
        <ButtonResend path="/setup" text="Resend SMS" />
        <ButtonChangePhone path="/" text="Change phone number" />
      </form>
    </div>
    );
};
export default Verification;