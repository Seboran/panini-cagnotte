const CommonPot = artifacts.require("CommonPot");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(CommonPot, accounts[0]);
};
