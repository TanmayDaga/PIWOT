import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { EthereumProvider } from "./lib/ContractContext";
import React from "react";
import Wrapper from "./components/Wrapper";

function App() {
  const [count, setCount] = useState(0);

  return (
    <EthereumProvider>
      <Wrapper/>
    </EthereumProvider>
  );
}

export default App;
