import { getDefaultConfig } from 'connectkit'
import { createConfig } from "wagmi";
import { goerli } from 'wagmi/chains';

const alchemyId = process.env.ALCHEMY_ID;
const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID!
const chains = [goerli ];

export const config = createConfig(
  getDefaultConfig({
    appName: "Your App Name",
    alchemyId,
    walletConnectProjectId,
    chains,
  })
)
