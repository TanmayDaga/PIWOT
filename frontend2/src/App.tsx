import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { EthereumProvider } from "./lib/ContractContext";
import React from "react";
import Wrapper from "./components/Wrapper";
import  CommunityDashboard from "@/components/getComunitiy"
import  UserProfilePage from "@/components/userProfile"
import { BrowserRouter, Routes , Route } from "react-router";
import LoginPage from "./components/Login"
import CommunityFeed from './components/communityData'
function App() {
  return(
    
    <BrowserRouter>
    <Routes>
      <Route  path = "/profile" element = {<UserProfilePage/>} />
      <Route  path="/communities" element = {<CommunityDashboard/>}/>
      <Route path = "/login" element =  {<LoginPage/>}/>
      <Route path ="/feed" element = {<CommunityFeed/>}/>

    </Routes>
    </BrowserRouter>
  )

}

export default App;