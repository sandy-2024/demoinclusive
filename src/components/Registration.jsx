import React, { useState } from 'react';
import axios from 'axios';
const  Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      setMessage('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8001/signup', {
        username: formData.name,
        email: formData.email,
        password: formData.password
      });

      setMessage('Registration successful!');
      setError('');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'An unexpected error occurred');
        setMessage('');
      } else {
        setError('An unexpected network error occurred');
        setMessage('');
      }
    }
  };

  return (
    <div className="row justify-content-center mt-4" style={{ marginBottom: '200px' }}>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            Register
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="registerName">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="registerName"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="registerEmail">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="registerEmail"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="registerPassword">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="registerPassword"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="container mt-3">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>
            </form>
            {message && <p className="success-message" style={{ color: 'green' }}>{message}</p>}
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
