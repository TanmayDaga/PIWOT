"use client"
import { useConnectionManager } from "thirdweb/react";

export type WrapperProps = {
    children: React.ReactNode;
    };


export default function Wrapper({children}:WrapperProps){


    const activeChain = {
		id:0,
		chainId: 1337, // Ganache Network ID
		rpc: "http://127.0.0.1:7545", // Localhost RPC URL
		nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
		shortName: "SERVER",
		slug: "SERVER",
	  };
    const connectionManager = useConnectionManager();

    connectionManager.defineChains([
        activeChain
    ])

    return (
        <div>
            
            {children}
        </div>
    );

}