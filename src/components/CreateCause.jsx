import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './CreateCause.css'; // Make sure to create this CSS file

const CreateCause = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state

        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);

            if (token) {
                const decoded = jwtDecode(token); // Decode the token
                console.log('Decoded Token:', decoded);
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.post('http://localhost:8001/api/user/causes', { title, description }, config);
            console.log('Cause created:', response.data);
            navigate('/UserDashboard');
        } catch (err) {
            console.error('Error creating cause:', err);
            setError(err.response?.data?.error || 'An unexpected error occurred');
        }
    };

    return (
      <div className="container create-cause-container">
          <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                  <h2 className="text-center mb-4">Create Cause</h2>
                  <form onSubmit={handleSubmit} className="create-cause-form">
                      <div className="form-group">
                          <label htmlFor="title">Title</label>
                          <input
                              type="text"
                              className="form-control"
                              id="title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Enter cause title"
                          />
                      </div>
                      <div className="form-group">
                          <label htmlFor="description">Description</label>
                          <textarea
                              className="form-control"
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Enter cause description"
                              rows="4"
                          ></textarea>
                      </div>
                      {error && <p className="text-danger">{error}</p>}
                      <button type="submit" className="btn btn-primary btn-block mt-3">Create Cause</button>
                  </form>
              </div>
          </div>
      </div>
  );
};

export default CreateCause;