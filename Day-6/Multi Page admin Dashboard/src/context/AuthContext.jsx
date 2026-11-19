import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Check localStorage for saved session
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('admin_dashboard_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password, remember = true) => {
    // Simulated authentication
    const userData = {
      id: "usr-admin-1",
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: "Super Admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      token: "jwt-simulated-token-xyz-12345"
    };

    setUser(userData);
    if (remember) {
      localStorage.setItem('admin_dashboard_user', JSON.stringify(userData));
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_dashboard_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
