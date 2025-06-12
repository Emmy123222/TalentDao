# TalentLink DAO - Web3 Creator Discovery Platform

A hackathon project for the 3percentclub Hackathon that combines Web3 and AI to discover and uplift underrepresented creators.

## 🎯 Project Overview

TalentLink DAO is a decentralized platform where creators can mint their profiles as NFTs, get discovered by curators, and unlock token-gated opportunities through community voting. AI helps auto-tag creator bios and match them to relevant opportunities.

## 🚀 Features

- **Profile NFTs**: Creators mint soulbound NFTs representing their profiles
- **DAO Voting**: Curators vote using ERC-20 tokens to promote creators
- **AI Integration**: Automatic bio tagging and opportunity matching using OpenRouter
- **Token-Gated Access**: Opportunities locked behind vote thresholds
- **Leaderboard**: Rankings based on community votes
- **Web3 Wallet Integration**: RainbowKit for seamless wallet connections

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Framer Motion
- **Web3**: RainbowKit + wagmi + viem
- **Smart Contracts**: Solidity (ERC-721, ERC-20, DAO voting)
- **Backend**: Supabase (PostgreSQL)
- **AI**: OpenRouter (OpenAI-compatible API)
- **Deployment**: Vite build system

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenRouter API key
- Wallet with testnet ETH

### 1. Clone the repository
```bash
git clone <repository-url>
cd talentlink-dao
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase
1. Create a new Supabase project
2. Run the migrations in `supabase/migrations/`
3. Set up your environment variables (see below)

### 4. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

### 5. Start the development server
```bash
npm run dev
```

## 🔧 Smart Contract Deployment

The project includes three main contracts:

1. **TalentLinkNFT.sol** - ERC-721 for creator profile NFTs (soulbound)
2. **TalentLinkToken.sol** - ERC-20 voting tokens with faucet functionality
3. **TalentLinkDAO.sol** - DAO voting mechanism

Deploy these contracts to your preferred testnet and update the contract addresses in `src/hooks/useWeb3.ts`.

## 🎮 Demo Walkthrough (3-5 minutes)

### For Creators:
1. **Connect Wallet** - Use RainbowKit to connect your Web3 wallet
2. **Create Profile** - Fill out the creator form with bio, skills, portfolio links
3. **AI Tagging** - Watch AI automatically generate relevant tags from your bio
4. **Mint NFT** - Mint your profile as a soulbound NFT (simulated for demo)
5. **Get Discovered** - Share your profile and appear in the discovery page

### For Curators:
1. **Claim Tokens** - Get voting tokens from the faucet
2. **Browse Creators** - Explore diverse creator profiles with search/filtering
3. **Vote & Support** - Use tokens to vote for creators you want to support
4. **View Impact** - See how votes affect creator rankings and access

### Key Features Demo:
- **AI Matching** - Show how AI matches creators to relevant opportunities
- **Token-Gated Access** - Demonstrate how vote thresholds unlock opportunities
- **Leaderboard** - Display community-driven creator rankings
- **Real-time Updates** - Show live vote counts and ranking changes

## 🧪 Challenges Faced & Solutions

### 1. Web3 Integration Complexity
**Challenge**: Integrating multiple Web3 components (wallets, contracts, tokens)
**Solution**: Used wagmi/viem stack with RainbowKit for streamlined Web3 interactions

### 2. AI Integration
**Challenge**: Making AI feel meaningful, not just a checkbox feature
**Solution**: Implemented practical AI use cases - bio tagging and opportunity matching

### 3. Database Design
**Challenge**: Designing schema that supports both Web3 and traditional data
**Solution**: Hybrid approach using Supabase with wallet addresses as primary keys

### 4. Demo Readiness
**Challenge**: Creating a convincing demo without full smart contract deployment
**Solution**: Implemented demo mode with simulated transactions and sample data

## 🎨 Design Philosophy

- **Accessibility First**: Clean, high-contrast design that works for all users
- **Web3 Native**: Familiar Web3 UI patterns with wallet-first interactions
- **Community Focused**: Social features that encourage discovery and support
- **Mobile Responsive**: Works seamlessly across all device sizes

## 📊 Database Schema

### Creators Table
- Profile information, skills, AI tags
- NFT minting status and vote counts
- Portfolio links and social connections

### Votes Table
- Vote history with curator and creator addresses
- Amount and transaction hashes
- Timestamp tracking for analytics

### Opportunities Table
- Job/collaboration opportunities
- Token requirements and categories
- Application URLs and company info

## 🚀 Future Roadmap

- **Mainnet Deployment** - Deploy to Ethereum/Polygon mainnet
- **Advanced AI** - More sophisticated matching algorithms
- **Mobile App** - Native mobile experience
- **Creator Analytics** - Dashboard with performance metrics
- **DAO Governance** - Community governance for platform decisions

## 🤝 Contributing

This is a hackathon project built in one week. Contributions, feedback, and suggestions are welcome!

## 📄 License

MIT License - see LICENSE file for details

## 🏆 Hackathon Compliance

✅ **Original Work**: Built entirely during hackathon week  
✅ **AI Integration**: OpenRouter for bio tagging and opportunity matching  
✅ **Web3 Integration**: Smart contracts, NFTs, DAO voting, wallet connections  
✅ **Working Demo**: Fully functional demo ready in under 5 minutes  
✅ **Documentation**: Complete setup instructions and feature overview  
✅ **Team Size**: Solo project (1 member)  

## 📞 Contact

Built for the 3percentclub Hackathon by [Your Name]
- GitHub: [your-github]
- Twitter: [your-twitter]
- Email: [your-email]