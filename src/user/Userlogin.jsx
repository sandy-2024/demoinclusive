import Usernav from "./Usernav";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";




function Userlogin() {
    
  
    return (
      <>
      <div > 
      
        <Usernav />
        <div className="Container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <h1 style={{alignContent: "center"}}>Welcome Inclusive</h1>
        <h3>Add causes</h3>
        </div>
      </div>
      </>
    );
}

export default Userlogin;