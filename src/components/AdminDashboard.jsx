import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [causes, setCauses] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);

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

        const [causesResponse, campaignsResponse] = await Promise.all([
          axios.get('http://localhost:8001/api/admin/causes', config),
          axios.get('http://localhost:8001/api/admin/campaigns', config)
        ]);

        setCauses(causesResponse.data);
        setCampaigns(campaignsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || 'An unexpected error occurred');
      }
    };

    fetchData();
  }, []);

  const handleApproval = async (type, id, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const url = type === 'cause' ? 
        `http://localhost:8001/api/admin/causes/${id}/approve` :
        `http://localhost:8001/api/admin/campaigns/${id}/approve`;

      await axios.post(url, { status }, config);

      if (type === 'cause') {
        setCauses(causes.map(cause => 
          cause.CauseID === id ? { ...cause, Status: status } : cause
        ));
      } else {
        setCampaigns(campaigns.map(campaign => 
          campaign.CampaignID === id ? { ...campaign, Status: status } : campaign
        ));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.error || 'An unexpected error occurred');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      {error && <p className="text-danger">{error}</p>}
      
      <h3 className="text-center mb-3">Causes</h3>
      <div className="list-group mb-5">
        {causes.map(cause => (
          <div key={cause.CauseID} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-bold">{cause.Title}</span>
              <span className={`badge bg-${cause.Status === 'pending' ? 'warning' : 'success'} ms-2`}>{cause.Status}</span>
            </div>
            {cause.Status === 'pending' && (
              <div>
                <button onClick={() => handleApproval('cause', cause.CauseID, 'approved')} className="btn btn-success mx-2">Approve</button>
                <button onClick={() => handleApproval('cause', cause.CauseID, 'rejected')} className="btn btn-danger mx-2">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-center mb-3">Campaigns</h3>
      <div className="list-group">
        {campaigns.map(campaign => (
          <div key={campaign.CampaignID} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-bold">{campaign.Title}</span>
              <span className={`badge bg-${campaign.Status === 'pending' ? 'warning' : 'success'} ms-2`}>{campaign.Status}</span>
            </div>
            {campaign.Status === 'pending' && (
              <div>
                <button onClick={() => handleApproval('campaign', campaign.CampaignID, 'approved')} className="btn btn-success mx-2">Approve</button>
                <button onClick={() => handleApproval('campaign', campaign.CampaignID, 'rejected')} className="btn btn-danger mx-2">Reject</button>
              </div>
            )}
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;