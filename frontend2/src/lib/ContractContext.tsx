import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { log } from 'console';

// Define types for context state
interface EthereumContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
}

// Create a context with the defined types
export const EthereumContext = createContext<EthereumContextType | undefined>(undefined);

// Define the EthereumProvider props type
interface EthereumProviderProps {
  children: ReactNode;
}

// EthereumContext provider component
export const EthereumProvider: React.FC<EthereumProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        const tempProvider = await new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);
        const tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);
        // Replace with your contract's ABI and address
        const contractABI = [    {
            "inputs": [
              {
                "internalType": "address",
                "name": "_initialOwner",
                "type": "address"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          }];
        const contractAddress = '0x954949E74CbB465dfA5DdC340a6901dA0c960946';
        const tempContract = await new ethers.Contract(contractAddress, contractABI, tempSigner);
        setContract(tempContract);
        
      } else {
        console.error('Ethereum provider not found');
      }
    };

    initializeEthers();
  }, []);

  return (
    <EthereumContext.Provider value={{ provider, signer, contract }}>
      {children}
    </EthereumContext.Provider>
  );
};
