require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('dotenv').config()

const alchemyId = process.env.ALCHEMY_ID;
const privateKey = process.env.GOERLI;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.21",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${alchemyId}`,
      accounts: [privateKey]
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "M9UMTJGIUXKE8YQSTRN497MTYFE32965QX"
  }
};
