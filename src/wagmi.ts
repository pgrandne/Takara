import { getDefaultConfig } from 'connectkit'
import { WagmiConfig, createConfig } from "wagmi";
import { modeTestnet, optimismGoerli, scrollSepolia, scrollTestnet } from 'wagmi/chains';

const alchemyId = process.env.ALCHEMY_ID;
const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID!
const chains = [modeTestnet, optimismGoerli, scrollSepolia, scrollTestnet ];


export const config = createConfig(
  getDefaultConfig({
    appName: "Your App Name",
    alchemyId,
    walletConnectProjectId,
    chains,
  })
)
