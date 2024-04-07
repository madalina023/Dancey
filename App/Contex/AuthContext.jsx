import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
useEffect(() => {
  console.log(user);
}, [user]);

  // Updated signIn method to accept the entire user object
  const signIn = (userData) => {
    // Assuming userData contains all user information, including the photo URL
    setUser(userData);
  };

  const signOut = () => {
    setUser(null);
    // Any additional sign-out logic here
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
