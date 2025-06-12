/*
  # Seed Sample Data for TalentLink DAO

  1. Sample Data
    - Sample creators with diverse profiles
    - Sample opportunities with various requirements
    - Sample votes to demonstrate the system

  This migration adds realistic demo data for the hackathon presentation.
*/

-- Insert sample creators
INSERT INTO creators (wallet_address, name, bio, category, skills, portfolio_links, ai_tags, nft_minted, total_votes) VALUES
(
  '0x1234567890123456789012345678901234567890',
  'Maya Chen',
  'Full-stack developer with 5 years of experience building scalable web applications. Passionate about Web3 and decentralized technologies. Founded two startups in emerging markets.',
  'developer',
  ARRAY['React', 'Node.js', 'Solidity', 'TypeScript', 'AWS'],
  ARRAY['https://github.com/mayachen', 'https://mayachen.dev'],
  ARRAY['blockchain', 'full-stack', 'startup founder', 'emerging markets'],
  true,
  45
),
(
  '0x2345678901234567890123456789012345678901',
  'Kwame Asante',
  'Digital artist creating Afrofuturistic NFT collections that celebrate African culture and heritage. My work has been featured in major galleries across three continents.',
  'artist',
  ARRAY['Digital Art', 'NFT Creation', 'Photoshop', 'Blender', 'Procreate'],
  ARRAY['https://kwameart.com', 'https://opensea.io/kwameasante'],
  ARRAY['afrofuturism', 'cultural heritage', 'NFT art', 'gallery featured'],
  true,
  67
),
(
  '0x3456789012345678901234567890123456789012',
  'Priya Sharma',
  'UX/UI designer specializing in accessibility and inclusive design. I believe technology should be accessible to everyone, regardless of their abilities or background.',
  'artist',
  ARRAY['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Accessibility', 'User Research'],
  ARRAY['https://priyauxdesign.com', 'https://dribbble.com/priyasharma'],
  ARRAY['accessibility', 'inclusive design', 'user experience', 'social impact'],
  false,
  32
),
(
  '0x4567890123456789012345678901234567890123',
  'Carlos Rodriguez',
  'Independent music producer and composer creating Latin-fusion electronic music. I blend traditional instruments with modern beats to tell stories of my community.',
  'musician',
  ARRAY['Music Production', 'Ableton Live', 'Sound Design', 'Mixing', 'Mastering'],
  ARRAY['https://soundcloud.com/carlosbeats', 'https://spotify.com/artist/carlosrodriguez'],
  ARRAY['latin fusion', 'electronic music', 'cultural storytelling', 'community focused'],
  true,
  28
),
(
  '0x5678901234567890123456789012345678901234',
  'Fatima Al-Zahra',
  'Documentary photographer capturing stories of resilience in refugee communities. My work has been published in National Geographic and Time Magazine.',
  'photographer',
  ARRAY['Documentary Photography', 'Photojournalism', 'Adobe Lightroom', 'Storytelling'],
  ARRAY['https://fatimaphotography.com', 'https://instagram.com/fatima_captures'],
  ARRAY['documentary', 'refugee communities', 'resilience stories', 'published photographer'],
  false,
  51
),
(
  '0x6789012345678901234567890123456789012345',
  'Alex Thompson',
  'Technical writer and developer advocate focused on making complex blockchain concepts accessible to newcomer developers. I write tutorials that have helped thousands learn Web3.',
  'writer',
  ARRAY['Technical Writing', 'Developer Relations', 'Blockchain Education', 'Content Strategy'],
  ARRAY['https://alexwrites.dev', 'https://medium.com/@alexthompson'],
  ARRAY['blockchain education', 'developer advocacy', 'technical communication', 'community building'],
  true,
  39
);

-- Insert sample opportunities
INSERT INTO opportunities (title, description, company, category, required_tokens, tags, application_url) VALUES
(
  'Senior Frontend Developer - DeFi Platform',
  'Join our team building the next generation of decentralized finance tools. We are looking for a passionate frontend developer with React and Web3 experience.',
  'DecentraFi Labs',
  'development',
  25,
  ARRAY['React', 'Web3', 'DeFi', 'TypeScript', 'Remote'],
  'https://decentrafi.com/careers/senior-frontend'
),
(
  'NFT Collection Artist',
  'Create a unique 10,000 piece NFT collection for our upcoming gaming platform. This is a paid commission with ongoing royalties.',
  'GameChain Studios',
  'design',
  40,
  ARRAY['NFT Art', 'Gaming', 'Digital Art', 'Character Design'],
  'https://gamechain.io/artist-application'
),
(
  'Blockchain Developer Intern',
  'Remote internship opportunity for emerging developers interested in blockchain technology. Mentorship and potential full-time offer included.',
  'Web3 Academy',
  'development',
  10,
  ARRAY['Solidity', 'Internship', 'Remote', 'Mentorship', 'Entry Level'],
  'https://web3academy.org/internship'
),
(
  'UX Designer for Social Impact App',
  'Design user experiences for our app connecting refugees with local resources. This role requires sensitivity to diverse user needs.',
  'ConnectGlobal',
  'design',
  30,
  ARRAY['UX Design', 'Social Impact', 'Accessibility', 'Mobile App'],
  'https://connectglobal.org/careers/ux-designer'
),
(
  'Content Creator - Crypto Education',
  'Create educational content about cryptocurrency and blockchain for underrepresented communities. Multiple content formats needed.',
  'CryptoForAll',
  'writing',
  20,
  ARRAY['Content Creation', 'Crypto Education', 'Community Outreach', 'Multilingual'],
  'https://cryptoforall.org/creator-program'
),
(
  'Music Producer for Web3 Platform',
  'Produce original music and sound effects for our metaverse platform. Royalties and platform tokens included.',
  'MetaSound',
  'music',
  35,
  ARRAY['Music Production', 'Metaverse', 'Sound Design', 'Web3'],
  'https://metasound.xyz/producer-opportunity'
),
(
  'Technical Writer - DeFi Documentation',
  'Write comprehensive documentation for our DeFi protocol. Clear communication of complex concepts is essential.',
  'YieldFarm Pro',
  'writing',
  15,
  ARRAY['Technical Writing', 'DeFi', 'Documentation', 'Blockchain'],
  'https://yieldfarm.pro/careers/technical-writer'
);

-- Insert sample votes to create realistic voting patterns
INSERT INTO votes (creator_id, curator_address, amount, transaction_hash) VALUES
(
  (SELECT id FROM creators WHERE name = 'Maya Chen'),
  '0xABCD1234567890123456789012345678901234AB',
  5,
  'demo_tx_001'
),
(
  (SELECT id FROM creators WHERE name = 'Maya Chen'),
  '0xBCDE2345678901234567890123456789012345BC',
  3,
  'demo_tx_002'
),
(
  (SELECT id FROM creators WHERE name = 'Kwame Asante'),
  '0xCDEF3456789012345678901234567890123456CD',
  8,
  'demo_tx_003'
),
(
  (SELECT id FROM creators WHERE name = 'Kwame Asante'),
  '0xDEF04567890123456789012345678901234567DE',
  4,
  'demo_tx_004'
),
(
  (SELECT id FROM creators WHERE name = 'Priya Sharma'),
  '0xEF015678901234567890123456789012345678EF',
  6,
  'demo_tx_005'
),
(
  (SELECT id FROM creators WHERE name = 'Carlos Rodriguez'),
  '0xF0126789012345678901234567890123456789F0',
  7,
  'demo_tx_006'
),
(
  (SELECT id FROM creators WHERE name = 'Fatima Al-Zahra'),
  '0x0123789012345678901234567890123456789012',
  9,
  'demo_tx_007'
),
(
  (SELECT id FROM creators WHERE name = 'Alex Thompson'),
  '0x1234890123456789012345678901234567890123',
  5,
  'demo_tx_008'
);