import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { EthereumProvider } from "./lib/ContractContext";
import React from "react";
import Wrapper from "./components/Wrapper";
import  CommunityDashboard from "./components/getComunity"
import  UserProfilePage from "./components/userProfile"
import { BrowserRouter, Routes , Route } from "react-router";
function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route  path = "/profile" element = {<UserProfilePage/>} />
      <Route  path="/communities" element = {<CommunityDashboard/>}/>
    </Routes>
    </BrowserRouter>
  )

}

export default App;
