import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, sepolia, hardhat, localhost } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'TalentLink DAO',
  projectId: 'your-walletconnect-project-id', // Replace with your actual project ID
  chains: [
    // Development chains (for local testing)
    localhost,
    hardhat,
    // Testnets
    sepolia,
    // Mainnets (for production)
    mainnet, 
    polygon, 
    optimism, 
    arbitrum, 
    base
  ],
  ssr: false,
});