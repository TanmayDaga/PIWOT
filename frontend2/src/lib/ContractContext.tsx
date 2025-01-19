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
        const contractABI =  [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_initialOwner",
                "type": "address"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "communityId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
              }
            ],
            "name": "CommunityCreated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "communityId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "user",
                "type": "address"
              }
            ],
            "name": "CommunityFollowed",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "communityId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "user",
                "type": "address"
              }
            ],
            "name": "CommunityUnfollowed",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "pollId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "creator",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "question",
                "type": "string"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "communityId",
                "type": "uint256"
              }
            ],
            "name": "PollCreated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "postId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "content",
                "type": "string"
              }
            ],
            "name": "PostContent",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "postId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "creator",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "communityId",
                "type": "uint256"
              }
            ],
            "name": "PostCreated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "user",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "RewardClaimed",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "user",
                "type": "address"
              }
            ],
            "name": "UserRegistered",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "pollId",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "voter",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "option",
                "type": "uint256"
              }
            ],
            "name": "VoteCasted",
            "type": "event"
          },
          {
            "inputs": [],
            "name": "POST_CREATION_FEE",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "communities",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "name",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "memberCount",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "communityCount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "pollCount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "polls",
            "outputs": [
              {
                "internalType": "address",
                "name": "creator",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "question",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "totalVotes",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "reward",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "communityId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [],
            "name": "postCount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "posts",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "creator",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "content",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "communityId",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "registeredUsers",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "userCommunities",
            "outputs": [
              {
                "internalType": "bool",
                "name": "isFollowing",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "joinedAt",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "name": "userWallet",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_content",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "_communityId",
                "type": "uint256"
              }
            ],
            "name": "createPost",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_name",
                "type": "string"
              }
            ],
            "name": "createCommunity",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_communityId",
                "type": "uint256"
              }
            ],
            "name": "followCommunity",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_communityId",
                "type": "uint256"
              }
            ],
            "name": "unfollowCommunity",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "getAllCommunities",
            "outputs": [
              {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
              },
              {
                "internalType": "string[]",
                "name": "names",
                "type": "string[]"
              },
              {
                "internalType": "bool[]",
                "name": "activeStates",
                "type": "bool[]"
              },
              {
                "internalType": "uint256[]",
                "name": "memberCounts",
                "type": "uint256[]"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_user",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_communityId",
                "type": "uint256"
              }
            ],
            "name": "isFollowingCommunity",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_user",
                "type": "address"
              }
            ],
            "name": "getUserCommunities",
            "outputs": [
              {
                "internalType": "uint256[]",
                "name": "communityIds",
                "type": "uint256[]"
              },
              {
                "internalType": "uint256[]",
                "name": "joinDates",
                "type": "uint256[]"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_userAddress",
                "type": "address"
              }
            ],
            "name": "registerUser",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "connectWallet",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_question",
                "type": "string"
              },
              {
                "internalType": "string[]",
                "name": "_options",
                "type": "string[]"
              },
              {
                "internalType": "uint256",
                "name": "_communityId",
                "type": "uint256"
              }
            ],
            "name": "createPoll",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function",
            "payable": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_postId",
                "type": "uint256"
              }
            ],
            "name": "getPost",
            "outputs": [
              {
                "internalType": "address",
                "name": "creator",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "content",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "communityId",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_communityId",
                "type": "uint256"
              }
            ],
            "name": "getCommunityContent",
            "outputs": [
              {
                "components": [
                  {
                    "components": [
                      {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                      },
                      {
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                      },
                      {
                        "internalType": "uint256",
                        "name": "communityId",
                        "type": "uint256"
                      },
                      {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                      },
                      {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                      }
                    ],
                    "internalType": "struct PollPaymentSystem.PostItem[]",
                    "name": "posts",
                    "type": "tuple[]"
                  },
                  {
                    "components": [
                      {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                      },
                      {
                        "internalType": "string",
                        "name": "question",
                        "type": "string"
                      },
                      {
                        "internalType": "string[]",
                        "name": "options",
                        "type": "string[]"
                      },
                      {
                        "internalType": "uint256[]",
                        "name": "voteCounts",
                        "type": "uint256[]"
                      },
                      {
                        "internalType": "uint256",
                        "name": "totalVotes",
                        "type": "uint256"
                      },
                      {
                        "internalType": "uint256",
                        "name": "communityId",
                        "type": "uint256"
                      },
                      {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                      },
                      {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                      }
                    ],
                    "internalType": "struct PollPaymentSystem.PollItem[]",
                    "name": "polls",
                    "type": "tuple[]"
                  }
                ],
                "internalType": "struct PollPaymentSystem.CommunityContent",
                "name": "",
                "type": "tuple"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_pollId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_option",
                "type": "uint256"
              }
            ],
            "name": "castVote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_pollId",
                "type": "uint256"
              }
            ],
            "name": "getPollDetails",
            "outputs": [
              {
                "internalType": "address",
                "name": "creator",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "question",
                "type": "string"
              },
              {
                "internalType": "string[]",
                "name": "options",
                "type": "string[]"
              },
              {
                "internalType": "uint256",
                "name": "totalVotes",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_pollId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_option",
                "type": "uint256"
              }
            ],
            "name": "getVotesForOption",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_pollId",
                "type": "uint256"
              }
            ],
            "name": "closePoll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "withdrawRewards",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "getContractBalance",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_user",
                "type": "address"
              }
            ],
            "name": "isRegistered",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "constant": true
          }
        ]
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
