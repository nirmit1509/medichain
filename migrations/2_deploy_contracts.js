const MediChain = artifacts.require("MediChain");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(MediChain);
};
