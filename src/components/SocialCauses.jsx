import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaLeaf, FaGraduationCap, FaHeartbeat, FaHandHoldingUsd, FaVenus } from 'react-icons/fa';

const iconMap = {
  'Environmental Protection': <FaLeaf size={40} color="green" />,
  'Education for All': <FaGraduationCap size={40} color="blue" />,
  'Healthcare Improvement': <FaHeartbeat size={40} color="red" />,
  'Poverty Alleviation': <FaHandHoldingUsd size={40} color="goldenrod" />,
  'Gender Equality': <FaVenus size={40} color="purple" />,
};

const SocialCauses = () => {
  const [approvedCauses, setApprovedCauses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedCauses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get('http://localhost:8001/api/causes/approved', config);
        setApprovedCauses(response.data);
      } catch (err) {
        console.error('Error fetching approved causes:', err);
        setError(err.response?.data?.error || 'An unexpected error occurred');
      }
    };

    fetchApprovedCauses();
  }, []);
  return (
    <div className="container mt-4" style={{ marginBottom: '200px' }}>
      <h2 className="text-center mb-4">Social Causes We Support</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="row">
        {approvedCauses.length === 0 ? (
          <p className="text-center">No approved causes to display.</p>
        ) : (
          approvedCauses.map((cause) => (
            <div key={cause.CauseID} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img src={cause.imageUrl || 'https://via.placeholder.com/300'} className="card-img-top" alt={cause.Title} />
                <div className="card-body text-center">
                  <div className="mb-3">{iconMap[cause.Title]}</div>
                  <h5 className="card-title">{cause.Title}</h5>
                  <p className="card-text">{cause.Description}</p>
                  <Link to={`/causes/${cause.CauseID}`} className="btn btn-primary">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};




export default SocialCauses