import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Activation.scss";

const baseUrl = import.meta.env.VITE_APP_SERVER_URL;
const verifyActivationUrl = `${baseUrl}/activation/verify-token`; // Match the backend route

const Activation = () => {
    const [status, setStatus] = useState("Verifying...");
    const [status2, setStatus2] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get("token");

            if (!token) {
                setStatus("Invalid activation link.");
                setStatus2("Please request a new activation link.");
                return;
            }

            try {
                // Send token to the server for verification
                await axios.post(verifyActivationUrl, { token });
                setStatus("Your account has been successfully activated!");
                setStatus2("Redirecting to the Login page in a few seconds...");
                setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
            } catch (err) {
                console.error("Activation failed:", err);
                if (err.response?.status === 400) {
                    setStatus("Invalid or expired activation link.");
                    setStatus2("Please request a new activation link.");
                } else {
                    setStatus("Something went wrong with the activation process.");
                    setStatus2("Please try again or contact support.");
                }
            }
        };

        verifyToken();
    }, [navigate, searchParams]);

    return (
        <div className="activation-container">
            <h1>{status}</h1>
            <p>{status2}</p>
        </div>
    );
};

export default Activation;