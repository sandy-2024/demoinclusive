import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Logout from './Logout';
import './UserDashboard.css'; // Custom CSS file for additional styling

const UserDashboard = () => {
    const [causes, setCauses] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // Fetch causes
                const causesResponse = await axios.get('http://localhost:8001/api/user/causes', config);
                setCauses(causesResponse.data);

                // Fetch campaigns
                const campaignsResponse = await axios.get('http://localhost:8001/api/user/campaigns', config);
                setCampaigns(campaignsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.error || 'An unexpected error occurred');
                if (err.response?.status === 401) {
                    navigate('/login'); // Redirect to login if unauthorized
                }
            }
        };

        fetchData();
    }, []);

        return (
      <div className="container user-dashboard-container">
          <div className="row justify-content-center">
              <div className="col-md-10">
                  <h2 className="text-center mb-4">Your Dashboard</h2>
                  <div className="d-flex justify-content-between mb-3">
                      <Link to="/create-cause" className="btn btn-primary">Create New Cause</Link>
                      <Link to="/create-campaign" className="btn btn-primary">Create New Campaign</Link>
                      <Logout />
                  </div>
                  {error && <p className="text-danger">{error}</p>}

                  <div className="causes-list">
                      <h3>Your Causes</h3>
                      {causes.length > 0 ? (
                          <ul className="list-group">
                              {causes.map(cause => (
                                  <li key={cause.CauseID} className="list-group-item">
                                      <strong>{cause.Title}</strong> - {cause.Status}
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <p>No causes found</p>
                      )}
                  </div>

                  <div className="campaigns-list mt-4">
                      <h3>Your Campaigns</h3>
                      {campaigns.length > 0 ? (
                          <ul className="list-group">
                              {campaigns.map(campaign => (
                                  <li key={campaign.CampaignID} className="list-group-item">
                                      <strong>{campaign.Title}</strong> - {campaign.Status}
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <p>No campaigns found</p>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );
};
export default UserDashboard;