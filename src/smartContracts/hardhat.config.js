// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

let accounts = {
  mnemonic: "famous radio just moon copy behind flower umbrella intact skull thank tragic choose leader screen either apple elder sample grape chapter clever flock erupt", // Replace with your mnemonic
};

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "gnosis",
  networks: {
    hardhat: {},
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: accounts,
    },
  },
  etherscan: {
    customChains: [
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
        },
      },
    ],
    // apiKey: {
    //   gnosis: "YOUR_GNOSISSCAN_API_KEY", // Replace with your Gnosisscan API key
    // },
  },
};
