import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './CreateCampaign.css'; // Custom CSS file for additional styling

const CreateCampaign = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state

        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);

            if (token) {
                const decoded = jwtDecode(token);
                console.log('Decoded Token:', decoded);
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.post('http://localhost:8001/api/user/campaigns', {
                title,
                description,
                goalAmount,
                deadline
            }, config);
            
            console.log('Campaign created:', response.data);
            navigate('/UserDashboard');
        } catch (err) {
            console.error('Error creating campaign:', err);
            setError(err.response?.data?.error || 'An unexpected error occurred');
        }
    };

    return (
        <div className="container create-campaign-container">
            <h2 className="text-center mb-4">Create Campaign</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="goalAmount">Goal Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        id="goalAmount"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="deadline">Deadline</label>
                    <input
                        type="date"
                        className="form-control"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary">Create Campaign</button>
            </form>
        </div>
    );
};

export default CreateCampaign;