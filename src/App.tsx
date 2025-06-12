import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { config } from './config/wagmi';
import Header from './components/Header';
import Web3Status from './components/Web3Status';
import Home from './pages/Home';
import CreateProfile from './pages/CreateProfile';
import Discover from './pages/Discover';
import Leaderboard from './pages/Leaderboard';
import Opportunities from './pages/Opportunities';
import Profile from './pages/Profile';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              <Header />
              <Web3Status />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create" element={<CreateProfile />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/opportunities" element={<Opportunities />} />
                  <Route path="/profile/:id" element={<Profile />} />
                </Routes>
              </main>
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#1f2937',
                    color: '#f9fafb',
                    border: '1px solid #374151'
                  }
                }}
              />
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;