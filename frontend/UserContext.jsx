import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to log in a user and store user data
  const loginUser = (userData) => {
    setUser(userData); // Store in context
    localStorage.setItem("user", JSON.stringify(userData)); // Store in localStorage
  };

  // Function to log out a user and clear
  const logoutUser = () => {
    setUser(null); // Clear context
    localStorage.removeItem("user"); // Clear localStorage
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
