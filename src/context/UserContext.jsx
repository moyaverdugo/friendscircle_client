import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create UserContext
const UserContext = createContext();

// UserProvider component that wraps the whole app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user state
  const [isLoading, setIsLoading] = useState(true); // For loading state

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    if (token) {
      // If token exists, fetch the user data
      axios
        .get("/user", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUser(response.data.user); // Set user data in context
          console.log(response.data.user);
          setIsLoading(false); // Stop loading once data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false); // Stop loading even in case of error
        });
    } else {
      setIsLoading(false); // No token, stop loading
    }
  }, []); // Empty array ensures this only runs once after initial render

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => useContext(UserContext);