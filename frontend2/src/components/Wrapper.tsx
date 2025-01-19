import { EthereumContext } from "@/lib/ContractContext";
import React, { useContext, useEffect } from "react";

interface WrapperProps {}

const Wrapper: React.FC<WrapperProps> =  () => {
  const { provider, signer, contract } = useContext(EthereumContext);

  useEffect(() => {
    async function name() {
      try {
      
        console.log((await (await contract.getAllCommunities())[1]));
        
        
    
        
      } catch (err) {
        console.log(err);
      }
    }
console.log("Hello world");

    if (contract) {
        name();
      
    }
  }, [contract]);

  return <>Hello</>;
};

export default Wrapper;
