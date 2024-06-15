import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  // State for storing form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the login endpoint
      const response = await axios.post('http://localhost:8001/login', formData);
      const { token, isAdmin } = response.data;

      if (isAdmin) {
        localStorage.setItem('token', token);
        navigate('/admindashboard'); // Redirect to admin dashboard if admin
      } else {
        localStorage.setItem('token', token);
        navigate('/userdashboard'); // Redirect to user dashboard if regular user
      }
      
      console.log('Login successful:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error logging in:', error.response.data);
        setError(error.response.data.error || 'An unexpected error occurred');
      } else {
        console.error('Network error:', error.message);
        setError('An unexpected network error occurred');
      }
    }
  };

  return (
    <div style={{ marginBottom: '200px' }}>
      <div className="container pt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                Login
              </div>
              <div className="card-body">
                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="loginEmail">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="loginEmail"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="loginPassword">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="loginPassword"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="container mt-3">
                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                  </div>
                  <div className="container mt-3">
                    <Link to="/forgot-password">
                      Forgot Password?
                    </Link>
                    <Link to="/registration" className="px-3">
                      Register
                    </Link>
                  </div>
                </form>
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;