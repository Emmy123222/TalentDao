import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Users, Sparkles, ExternalLink, Vote, User, 
  TrendingUp, Calendar, MapPin, Star, Zap, Heart, Award,
  ChevronDown, Grid, List, SortAsc, SortDesc
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { supabase, Creator } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import GradientCard from '../components/GradientCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedCounter from '../components/AnimatedCounter';
import useWeb3 from '../hooks/useWeb3';

const categories = [
  { id: 'all', label: 'All Creators', icon: Users, count: 0 },
  { id: 'developer', label: 'Developers', icon: Users, count: 0 },
  { id: 'artist', label: 'Artists', icon: Users, count: 0 },
  { id: 'musician', label: 'Musicians', icon: Users, count: 0 },
  { id: 'photographer', label: 'Photographers', icon: Users, count: 0 },
  { id: 'writer', label: 'Writers', icon: Users, count: 0 },
  { id: 'other', label: 'Other', icon: Users, count: 0 }
];

const sortOptions = [
  { id: 'votes', label: 'Most Votes', icon: TrendingUp },
  { id: 'recent', label: 'Recently Joined', icon: Calendar },
  { id: 'name', label: 'Name A-Z', icon: SortAsc },
  { id: 'nft', label: 'NFT Holders', icon: Award }
];

export default function Discover() {
  const { address, isConnected } = useAccount();
  const { voteForCreator, tokenBalance } = useWeb3();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('votes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [votingCreator, setVotingCreator] = useState<string | null>(null);

  useEffect(() => {
    fetchCreators();
  }, []);

  useEffect(() => {
    filterAndSortCreators();
  }, [creators, searchTerm, selectedCategory, sortBy]);

  const fetchCreators = async () => {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('total_votes', { ascending: false });

      if (error) throw error;
      setCreators(data || []);
      updateCategoryCounts(data || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast.error('Failed to load creators');
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryCounts = (creators: Creator[]) => {
    categories.forEach(category => {
      if (category.id === 'all') {
        category.count = creators.length;
      } else {
        category.count = creators.filter(creator => creator.category === category.id).length;
      }
    });
  };

  const filterAndSortCreators = () => {
    let filtered = creators;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(creator => creator.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(creator =>
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        creator.ai_tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    switch (sortBy) {
      case 'votes':
        filtered = filtered.sort((a, b) => b.total_votes - a.total_votes);
        break;
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'name':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nft':
        filtered = filtered.sort((a, b) => Number(b.nft_minted) - Number(a.nft_minted));
        break;
    }

    setFilteredCreators(filtered);
  };

  const handleVote = async (creator: Creator, amount: number = 1) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (creator.wallet_address === address) {
      toast.error('You cannot vote for yourself');
      return;
    }

    setVotingCreator(creator.id);

    try {
      // Call the Web3 voting function (e.g., token transfer or on-chain vote)
      await voteForCreator(creator.wallet_address, amount.toString());

      // Update Supabase with the new vote count
      const { error } = await supabase
        .from('creators')
        .update({ total_votes: creator.total_votes + amount })
        .eq('id', creator.id);

      if (error) throw error;

      // Refresh creators data from Supabase to reflect the update
      await fetchCreators();

      toast.success(`Successfully voted for ${creator.name}!`);
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to cast vote');
      // Revert local state if Supabase update fails
      setCreators(prev => prev.map(c => 
        c.id === creator.id ? { ...c, total_votes: c.total_votes } : c
      ));
    } finally {
      setVotingCreator(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      developer: 'from-blue-500 to-cyan-500',
      artist: 'from-purple-500 to-pink-500',
      musician: 'from-green-500 to-teal-500',
      photographer: 'from-yellow-500 to-orange-500',
      writer: 'from-red-500 to-rose-500',
      other: 'from-gray-500 to-slate-500'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" color="purple" />
          <p className="text-gray-400 mt-4 text-lg">Discovering amazing creators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-6 py-3 rounded-full border border-purple-500/30">
                <Users className="h-5 w-5 text-purple-400" />
                <span className="text-purple-300 font-medium">Creator Discovery</span>
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Discover
              </span>
              <br />
              <span className="text-white">Amazing Creators</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Find and support underrepresented talent from around the world. Every vote helps creators 
              unlock new opportunities and gain visibility in the Web3 ecosystem.
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter value={creators.length} />
                </div>
                <div className="text-gray-400 text-sm">Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  <AnimatedCounter value={creators.reduce((sum, c) => sum + c.total_votes, 0)} />
                </div>
                <div className="text-gray-400 text-sm">Total Votes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  <AnimatedCounter value={creators.filter(c => c.nft_minted).length} />
                </div>
                <div className="text-gray-400 text-sm">NFTs Minted</div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <GradientCard className="p-6">
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, skills, AI tags, or bio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                  />
                </div>

                {/* Filter Toggle */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Filter className="h-5 w-5" />
                    <span>Advanced Filters</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="flex items-center space-x-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-white/5 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {sortOptions.map(option => (
                        <option key={option.id} value={option.id} className="bg-gray-900">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-white/10">
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                                selectedCategory === category.id
                                  ? 'border-purple-400 bg-purple-500/20 scale-105'
                                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                              }`}
                            >
                              <category.icon className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                              <div className="text-white font-medium text-sm">{category.label}</div>
                              <div className="text-gray-400 text-xs mt-1">{category.count}</div>
                              {selectedCategory === category.id && (
                                <motion.div
                                  layoutId="categoryIndicator"
                                  className="absolute inset-0 border-2 border-purple-400 rounded-xl"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GradientCard>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-bold text-white">
                {filteredCreators.length} Creator{filteredCreators.length !== 1 ? 's' : ''} Found
              </h3>
              {searchTerm && (
                <span className="text-gray-400">for "{searchTerm}"</span>
              )}
            </div>
            
            {isConnected && (
              <div className="flex items-center space-x-2 text-sm">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-400">Your balance:</span>
                <span className="text-white font-bold">{parseFloat(tokenBalance).toFixed(1)} TLVT</span>
              </div>
            )}
          </div>

          {/* Creators Grid/List */}
          {filteredCreators.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <GradientCard className="p-12 max-w-lg mx-auto">
                <User className="h-16 w-16 text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">No creators found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search criteria or filters' 
                    : 'Be the first to create a profile and join our community!'
                  }
                </p>
                {!searchTerm && selectedCategory === 'all' && (
                  <button
                    onClick={() => window.location.href = '/create'}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                  >
                    Create Profile
                  </button>
                )}
              </GradientCard>
            </motion.div>
          ) : (
            <motion.div
              layout
              className={viewMode === 'grid' 
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
                : "space-y-6"
              }
            >
              <AnimatePresence mode="popLayout">
                {filteredCreators.map((creator, index) => (
                  <motion.div
                    key={creator.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    {viewMode === 'grid' ? (
                      <CreatorCard 
                        creator={creator} 
                        onVote={handleVote}
                        votingCreator={votingCreator}
                        isConnected={isConnected}
                        userAddress={address}
                      />
                    ) : (
                      <CreatorListItem 
                        creator={creator} 
                        onVote={handleVote}
                        votingCreator={votingCreator}
                        isConnected={isConnected}
                        userAddress={address}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Creator Card Component
function CreatorCard({ 
  creator, 
  onVote, 
  votingCreator, 
  isConnected, 
  userAddress 
}: {
  creator: Creator;
  onVote: (creator: Creator) => void;
  votingCreator: string | null;
  isConnected: boolean;
  userAddress?: string;
}) {
  const getCategoryColor = (category: string) => {
    const colors = {
      developer: 'from-blue-500 to-cyan-500',
      artist: 'from-purple-500 to-pink-500',
      musician: 'from-green-500 to-teal-500',
      photographer: 'from-yellow-500 to-orange-500',
      writer: 'from-red-500 to-rose-500',
      other: 'from-gray-500 to-slate-500'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const isVoting = votingCreator === creator.id;
  const canVote = isConnected && creator.wallet_address !== userAddress;

  return (
    <GradientCard className="overflow-hidden group">
      {/* Header with category color */}
      <div className={`h-24 bg-gradient-to-r ${getCategoryColor(creator.category)} relative`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-end justify-between p-4">
          <div className="flex items-center space-x-2">
            {creator.nft_minted && (
              <div className="bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-green-300 border border-green-500/30">
                ✓ NFT Minted
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
            <Vote className="h-4 w-4 text-purple-400" />
            <span className="text-white font-bold">{creator.total_votes}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Profile Info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getCategoryColor(creator.category)} flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300`}>
            {creator.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-1 truncate">{creator.name}</h3>
            <p className="text-purple-300 text-sm capitalize mb-2">{creator.category}</p>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>Joined {new Date(creator.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">{creator.bio}</p>

        {/* Skills */}
        {creator.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {creator.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                >
                  {skill}
                </span>
              ))}
              {creator.skills.length > 3 && (
                <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                  +{creator.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* AI Tags */}
        {creator.ai_tags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-1 mb-2">
              <Sparkles className="h-3 w-3 text-yellow-400" />
              <span className="text-xs text-gray-400">AI Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {creator.ai_tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs border border-yellow-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {canVote ? (
            <button
              onClick={() => onVote(creator)}
              disabled={isVoting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              {isVoting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Voting...</span>
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Vote</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex-1 bg-gray-600/50 text-gray-400 px-4 py-3 rounded-xl font-semibold flex items-center justify-center text-sm">
              {!isConnected ? 'Connect Wallet' : 'Your Profile'}
            </div>
          )}
          
          <button 
            onClick={() => window.location.href = `/profile/${creator.id}`}
            className="px-4 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </GradientCard>
  );
}

// Creator List Item Component
function CreatorListItem({ 
  creator, 
  onVote, 
  votingCreator, 
  isConnected, 
  userAddress 
}: {
  creator: Creator;
  onVote: (creator: Creator) => void;
  votingCreator: string | null;
  isConnected: boolean;
  userAddress?: string;
}) {
  const getCategoryColor = (category: string) => {
    const colors = {
      developer: 'from-blue-500 to-cyan-500',
      artist: 'from-purple-500 to-pink-500',
      musician: 'from-green-500 to-teal-500',
      photographer: 'from-yellow-500 to-orange-500',
      writer: 'from-red-500 to-rose-500',
      other: 'from-gray-500 to-slate-500'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const isVoting = votingCreator === creator.id;
  const canVote = isConnected && creator.wallet_address !== userAddress;

  return (
    <GradientCard className="p-6">
      <div className="flex items-center space-x-6">
        {/* Avatar */}
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${getCategoryColor(creator.category)} flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
          {creator.name.charAt(0).toUpperCase()}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-2xl font-bold text-white">{creator.name}</h3>
            <span className="text-purple-300 text-sm capitalize">{creator.category}</span>
            {creator.nft_minted && (
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                NFT Minted
              </span>
            )}
          </div>
          
          <p className="text-gray-300 mb-3 line-clamp-2">{creator.bio}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {creator.skills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                {skill}
              </span>
            ))}
            {creator.ai_tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                <Sparkles className="h-3 w-3 inline mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{creator.total_votes}</div>
            <div className="text-gray-400 text-sm">Votes</div>
          </div>
          
          <div className="flex space-x-3">
            {canVote ? (
              <button
                onClick={() => onVote(creator)}
                disabled={isVoting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
              >
                {isVoting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Voting...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" />
                    <span>Vote</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-gray-600/50 text-gray-400 px-6 py-3 rounded-xl font-semibold">
                {!isConnected ? 'Connect Wallet' : 'Your Profile'}
              </div>
            )}
            
            <button 
              onClick={() => window.location.href = `/profile/${creator.id}`}
              className="px-4 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </GradientCard>
  );
}