import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Users, Sparkles, TrendingUp } from 'lucide-react';
import { supabase, Creator } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function Leaderboard() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchTopCreators();
  }, []);

  const fetchTopCreators = async () => {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('total_votes', { ascending: false })
        .limit(50);

      if (error) throw error;
      setCreators(data || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return Crown;
      case 2: return Trophy;
      case 3: return Medal;
      default: return null;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-gray-500';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <h1 className="text-4xl font-bold text-white">Creator Leaderboard</h1>
            </div>
            <p className="text-xl text-gray-300">
              Top creators based on community votes and recognition
            </p>
          </div>

          {/* Top 3 Podium */}
          {creators.length >= 3 && (
            <div className="mb-16">
              <div className="flex justify-center items-end space-x-8">
                {[creators[1], creators[0], creators[2]].map((creator, idx) => {
                  const actualPosition = idx === 1 ? 1 : idx === 0 ? 2 : 3;
                  const RankIcon = getRankIcon(actualPosition);
                  
                  return (
                    <motion.div
                      key={creator.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: idx * 0.2 }}
                      className={`text-center ${idx === 1 ? 'order-2' : ''}`}
                    >
                      {/* Podium */}
                      <div className={`bg-gradient-to-t ${getCategoryColor(creator.category)} rounded-t-2xl p-6 ${
                        actualPosition === 1 ? 'h-40' : actualPosition === 2 ? 'h-32' : 'h-24'
                      } flex flex-col justify-end mb-4`}>
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
                          <div className="flex items-center justify-center mb-2">
                            {RankIcon && <RankIcon className={`h-8 w-8 ${getRankColor(actualPosition)}`} />}
                          </div>
                          <h3 className="text-white font-bold text-lg mb-1">{creator.name}</h3>
                          <p className="text-gray-200 text-sm capitalize">{creator.category}</p>
                          <div className="flex items-center justify-center space-x-1 mt-2">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 font-semibold">{creator.total_votes}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-6xl font-bold text-white/20">#{actualPosition}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{creators.length}</div>
              <div className="text-gray-400">Total Creators</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 text-center">
              <Sparkles className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {creators.reduce((sum, creator) => sum + creator.total_votes, 0)}
              </div>
              <div className="text-gray-400">Total Votes</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 text-center">
              <Crown className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {creators.filter(c => c.nft_minted).length}
              </div>
              <div className="text-gray-400">NFTs Minted</div>
            </div>
          </div>

          {/* Full Leaderboard */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Full Rankings</h2>
            </div>
            
            <div className="divide-y divide-white/10">
              {creators.map((creator, index) => {
                const position = index + 1;
                const RankIcon = getRankIcon(position);
                
                return (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="p-6 hover:bg-white/5 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-6">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-16">
                        {RankIcon ? (
                          <RankIcon className={`h-6 w-6 ${getRankColor(position)}`} />
                        ) : (
                          <span className="text-2xl font-bold text-gray-500">#{position}</span>
                        )}
                      </div>

                      {/* Profile */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(creator.category)} flex items-center justify-center`}>
                            <span className="text-white font-bold text-lg">
                              {creator.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-white">{creator.name}</h3>
                              {creator.nft_minted && (
                                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                                  NFT
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm capitalize">{creator.category}</p>
                          </div>
                        </div>
                      </div>

                      {/* AI Tags */}
                      <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
                        {creator.ai_tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Votes */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{creator.total_votes}</div>
                        <div className="text-gray-400 text-sm">votes</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {creators.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No creators yet</h3>
              <p className="text-gray-400">Be the first to create a profile and claim the top spot!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}