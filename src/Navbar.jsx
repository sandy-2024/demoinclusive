import React from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const isAuthenticated = () => {
    // Check if the user is authenticated
    return !!localStorage.getItem('token'); // Example, adapt based on your auth logic
  };
  const isAdmin = () => {
    // Check if the user is authenticated and has admin role
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Decode the token to check user role
    const decodedToken = jwtDecode(token); // Assuming you're using jwt-decode library
    return decodedToken.role === 'admin';
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="./src/assets/logo.svg"
              alt="InclusiveBizHub"
              height={100}
              width={100}
              className="object-contain"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/social-causes">
                  Social Causes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/campaigns">
                  Campaigns
                </Link>
              </li>
              {isAuthenticated() && (
                <li className="nav-item">
                  <Link className="nav-link" to="/userdashboard">
                    User Dashboard
                  </Link>
                </li>
                
              )}
            </ul>
            <div className="dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ paddingRight: "5rem" }}
              >
                Join us
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/registration">
                    Registration
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                {isAuthenticated() && isAdmin() &&(
                  <Link className="dropdown-item" to="/admindashboard">
                    Admin
                  </Link>)}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;