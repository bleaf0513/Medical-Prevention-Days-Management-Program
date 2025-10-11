import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("admin")) || null
  );

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (admin) localStorage.setItem("admin", JSON.stringify(admin));
    else localStorage.removeItem("admin");
  }, [admin]);

  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user_token", token);
  };

  const loginAdmin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem("admin_token", token);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user_token");
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("admin_token");
  };

  const logout = () => {
    logoutUser();
    logoutAdmin();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      admin, 
      loginUser, 
      loginAdmin, 
      logoutUser, 
      logoutAdmin, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
