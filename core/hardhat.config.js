require("@nomicfoundation/hardhat-toolbox");

const alchemyId = process.env.ALCHEMY_ID;
const privateKey = process.env.GOERLI;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${alchemyId}`,
      accounts: [privateKey]
    }
  }
};
