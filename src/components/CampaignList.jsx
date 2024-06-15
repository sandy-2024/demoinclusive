// CampaignList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaClock, FaDollarSign } from 'react-icons/fa';
import './CampaignList.css';
const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
              try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
            const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
            const response = await axios.get('http://localhost:8001/api/campaigns/approved', config);
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setError('Error fetching campaigns');
      }
              };

    fetchCampaigns();
  }, []);

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-3">Campaigns</h2>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {campaigns.map((campaign) => (
          <li key={campaign.CampaignID} className="list-group-item">
            <h3>{campaign.Title}</h3>
            <p>{campaign.Description}</p>
            <div className="d-flex align-items-center">
              <FaDollarSign className="me-1" /> Goal Amount: {campaign.GoalAmount}
            </div>
            <div className="d-flex align-items-center">
              <FaClock className="me-1" /> Deadline: {campaign.Deadline}
            </div>
            <div className="d-flex align-items-center">
              <FaCheckCircle className={`me-1 text-${campaign.Status === 'approved' ? 'success' : 'warning'}`} /> Status: {campaign.Status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default CampaignList;