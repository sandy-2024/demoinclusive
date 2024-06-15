import React from 'react';
import Navbar from "./Navbar";
import Contact from "./components/Contact";
import About from "./components/About";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Home from "./components/Home";
import CreateCause from "./components/CreateCause";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import CreateCampaign from './components/CreateCampaign';
import CampaignList from './components/CampaignList';
import SocialCauses from "./components/SocialCauses";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import backgroundImage from "../src/assets/home2.png";
import Userlogin from '../src/user/Userlogin';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  const location = useLocation();

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    marginTop: "0px",
    backgroundPosition: 'top',
    opacity: 1, // 100% opacity
  };
  const showHeaderFooter = !['/userlogin'].includes(location.pathname);

  const isAuthenticated = () => {
    // Check if the user is authenticated
    return !!localStorage.getItem('token'); // Example, adapt based on your auth logic
  };

  const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
  };

  

  return (
    <div style={backgroundStyle}>
      {showHeaderFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/create-cause" element={<PrivateRoute element={<CreateCause />} />} />
        <Route path="/userdashboard" element={<PrivateRoute element={<UserDashboard />} />} />
        <Route path="/admindashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
        <Route path="/social-causes" element={<SocialCauses />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/campaigns" element={<CampaignList/>} />
        <Route path="/userlogin" element={<Userlogin />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
