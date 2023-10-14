import { getDefaultConfig } from 'connectkit'
import { createConfig } from "wagmi";
import { mantleTestnet, optimismGoerli, polygon, polygonMumbai, polygonZkEvm, polygonZkEvmTestnet, scrollSepolia, scrollTestnet } from 'wagmi/chains';

const alchemyId = process.env.ALCHEMY_ID;
const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID!
const chains = [mantleTestnet, optimismGoerli, polygon, polygonMumbai, polygonZkEvm, polygonZkEvmTestnet, scrollSepolia, scrollTestnet ];


export const config = createConfig(
  getDefaultConfig({
    appName: "Your App Name",
    alchemyId,
    walletConnectProjectId,
    chains,
  })
)
