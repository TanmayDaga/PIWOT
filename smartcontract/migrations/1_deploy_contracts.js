const myContract = artifacts.require('PollPaymentSystem')

module.exports = function(deployer, network, accounts) {
    const ownerAddress = accounts[0]; // Replace with the desired owner address
  
    deployer.deploy(
      myContract,
      ownerAddress,
    );
}