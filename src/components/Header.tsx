import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Users, Sparkles } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/create', label: 'Create Profile' },
    { path: '/discover', label: 'Discover' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/opportunities', label: 'Opportunities' },
  ];

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TalentLink DAO</h1>
              <p className="text-xs text-purple-300">Discover • Uplift • Connect</p>
            </div>
          </Link>

          {/* Navigation - Hidden on small screens, shown on medium+ */}
          <nav className="hidden lg:flex space-x-6 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'text-purple-300 border-b-2 border-purple-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* AI Badge */}
            <div className="hidden sm:flex items-center space-x-1 text-yellow-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium whitespace-nowrap">AI Powered</span>
            </div>
            
            {/* Connect Button */}
            <div className="flex-shrink-0">
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-white/10 py-2">
          <nav className="flex flex-wrap justify-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 py-1 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-purple-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}