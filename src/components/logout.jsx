import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const Navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from local storage
    localStorage.removeItem('token');

    // Redirect to the login page
    Navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout
    </button>
  );
};

export default Logout;