import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import "./SetUp.scss";
import axios from "axios";
import ButtonNext from '../../components/ButtonNext/ButtonNext.jsx';

const baseUrl = import.meta.env.VITE_APP_SERVER_URL;
const signupUrl = `${baseUrl}/setup`; // Signup route for user registration
const sendActivationUrl = `${baseUrl}/activation/send-link`; // Activation link API

const SetUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [birthdate, setBirthdate] = useState(null); // State for birthdate
  const [profileImage, setProfileImage] = useState(null);
  const phoneNumber = sessionStorage.getItem("phone");
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    address: "",
    zipcode: "",
    email: "",
    password: "",
    retypepassword: "", // Include retypepassword for validation
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic
    if (
      !inputs.firstname ||
      !inputs.lastname ||
      !birthdate ||
      !inputs.address ||
      !inputs.zipcode ||
      !inputs.email ||
      !inputs.password ||
      !inputs.retypepassword
    ) {
      setError("Please fill out all fields.");
      return;
    }

    if (inputs.password !== inputs.retypepassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear error on successful validation

    const userData = {
      phone: phoneNumber,
      firstName: inputs.firstname,
      lastName: inputs.lastname,
      address: inputs.address,
      zipcode: inputs.zipcode,
      email: inputs.email,
      password: inputs.password,
      birthdate,
      profileImage,
    };

    try {
      // Register the user
      await axios.post(signupUrl, userData);

      // Send activation link
      await axios.post(sendActivationUrl, { email: inputs.email });

      alert("An activation link has been sent to your email.");
      navigate("/setup"); // You can change the navigation destination if needed
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Phone number is already in use by an active user.");
      } else {
        console.error("Error during registration or activation:", err);
        setError(err.response?.data?.error || "An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="setup__title">
        <h2>Set your profile</h2>
      </div>

      {/* Profile Image Upload Section */}
      <div className="setup__image-upload">
        <label className="setup__image-circle" htmlFor="profileImage">
          <span className="setup__image-plus">+</span>
          <span className="setup__image-text">Image</span>
        </label>
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }} // Hide the file input
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="setup__text_container">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            className="setup__input"
            value={inputs.firstname}
            onChange={handleInputChange}
          />

          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            className="setup__input"
            value={inputs.lastname}
            onChange={handleInputChange}
          />

          <label htmlFor="birthday">Birthday</label>
          <div className="setup__birthday_input">
            <ReactDatePicker
              id="date-picker"
              selected={birthdate}
              onChange={(date) => setBirthdate(date)}
              placeholderText=""
              dateFormat="yyyy/MM/dd"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              className="setup__date_picker"
            />
            <button
              type="button"
              className="setup__calendar_button"
              onClick={() => document.getElementById("date-picker").focus()}
            >
              📅
            </button>
          </div>

          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            className="setup__input"
            value={inputs.address}
            onChange={handleInputChange}
          />

          <label htmlFor="zipcode">Zipcode</label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            className="setup__input"
            value={inputs.zipcode}
            onChange={handleInputChange}
          />

          <label htmlFor="zipcode">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            className="setup__input"
            value={inputs.email}
            onChange={handleInputChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            name="password"
            className="setup__input"
            value={inputs.password}
            onChange={handleInputChange}
          />

          <label htmlFor="retypepassword">Re-type Password</label>
          <input
            type="text"
            id="retypepassword"
            name="retypepassword"
            className="setup__input"
            value={inputs.retypepassword}
            onChange={handleInputChange}
          />

          {/* Error message container */}
          <div className={`error-container ${error ? "visible" : "hidden"}`}>
            {error}
          </div>
        </div>
        <ButtonNext text="Activate!" />
      </form>
    </div>
  );
};

export default SetUp;