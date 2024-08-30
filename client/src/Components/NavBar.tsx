// src/components/Navbar.jsx
import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import Logout from './Logout';

export const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const handleLogout = () => {
        logout();
      };
  return (
    <nav>
      <ul>
      
        {isAuthenticated ? (
          <>
            <a href="/"><li>Home</li></a>
            <a href="/profile"><li>Profile</li></a>
            <a href="/" onClick={handleLogout}><li>Logout</li></a>
          </>
        ) : (
          <>
           <a href="/login"> <li>Login</li></a>
           <a href="/signup"> <li>Sign Up</li></a>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
