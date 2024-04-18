/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.17',
    defaultNetwork: 'Fantom Testnet',
    networks: {
      hardhat: {},
      goerli: {
        url: 'https://rpc.testnet.fantom.network',
        accounts: [0x9E89b95bf4E965Aa9295967f8442701661eEBF10]
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};