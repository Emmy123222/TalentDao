import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Lock, Unlock, Briefcase, MapPin, Clock, ExternalLink, Sparkles, Users, Zap } from 'lucide-react';
import { supabase, Opportunity, Creator } from '../lib/supabase';
import { matchOpportunities } from '../lib/ai';
import { toast } from 'react-hot-toast';

export default function Opportunities() {
  const { address, isConnected } = useAccount();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [userProfile, setUserProfile] = useState<Creator | null>(null);
  const [matchedOpportunities, setMatchedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchOpportunities();
    if (isConnected && address) {
      fetchUserProfile();
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (userProfile && opportunities.length > 0) {
      generateMatches();
    }
  }, [userProfile, opportunities]);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('wallet_address', address)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const generateMatches = async () => {
    try {
      const matches = await matchOpportunities(userProfile, opportunities);
      setMatchedOpportunities(matches);
    } catch (error) {
      console.error('Error generating matches:', error);
    }
  };

  const getFilteredOpportunities = () => {
    switch (activeFilter) {
      case 'matched':
        return matchedOpportunities;
      case 'accessible':
        return opportunities.filter(opp => 
          !userProfile || userProfile.total_votes >= opp.required_tokens
        );
      case 'locked':
        return opportunities.filter(opp => 
          userProfile && userProfile.total_votes < opp.required_tokens
        );
      default:
        return opportunities;
    }
  };

  const canAccess = (opportunity: Opportunity) => {
    if (!userProfile) return false;
    return userProfile.total_votes >= opportunity.required_tokens;
  };

  const isMatched = (opportunity: Opportunity) => {
    return matchedOpportunities.some(match => match.id === opportunity.id);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      development: 'from-blue-500 to-cyan-500',
      design: 'from-purple-500 to-pink-500',
      music: 'from-green-500 to-teal-500',
      photography: 'from-yellow-500 to-orange-500',
      writing: 'from-red-500 to-rose-500',
      general: 'from-gray-500 to-slate-500'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const filteredOpportunities = getFilteredOpportunities();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to access opportunities</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Profile First</h2>
          <p className="text-gray-400 mb-6">You need a creator profile to access opportunities</p>
          <a
            href="/create"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Create Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Briefcase className="h-6 w-6 text-purple-400" />
              <h1 className="text-4xl font-bold text-white">Opportunities</h1>
            </div>
            <p className="text-xl text-gray-300 mb-6">
              Token-gated opportunities matched to your profile using AI
            </p>
            
            {/* User Stats */}
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{userProfile.total_votes}</div>
                <div className="text-gray-400 text-sm">Your Votes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{matchedOpportunities.length}</div>
                <div className="text-gray-400 text-sm">AI Matches</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {opportunities.filter(opp => canAccess(opp)).length}
                </div>
                <div className="text-gray-400 text-sm">Accessible</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {[
              { id: 'all', label: 'All Opportunities', count: opportunities.length },
              { id: 'matched', label: 'AI Matched', count: matchedOpportunities.length },
              { id: 'accessible', label: 'Accessible', count: opportunities.filter(opp => canAccess(opp)).length },
              { id: 'locked', label: 'Locked', count: opportunities.filter(opp => !canAccess(opp)).length }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeFilter === filter.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span>{filter.label}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{filter.count}</span>
              </button>
            ))}
          </div>

          {/* Opportunities Grid */}
          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No opportunities found</h3>
              <p className="text-gray-400">
                {activeFilter === 'matched' && 'Keep building your profile to get more AI matches'}
                {activeFilter === 'accessible' && 'Gain more votes to unlock opportunities'}
                {activeFilter === 'locked' && 'All opportunities are accessible to you!'}
                {activeFilter === 'all' && 'Check back later for new opportunities'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOpportunities.map((opportunity, index) => {
                const accessible = canAccess(opportunity);
                const matched = isMatched(opportunity);
                
                return (
                  <motion.div
                    key={opportunity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className={`bg-white/5 backdrop-blur-md rounded-2xl border transition-all duration-300 overflow-hidden ${
                      accessible
                        ? 'border-white/10 hover:border-white/20'
                        : 'border-red-500/20 bg-red-500/5'
                    }`}>
                      {/* Header */}
                      <div className={`h-20 bg-gradient-to-r ${getCategoryColor(opportunity.category)} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="relative h-full flex items-center justify-between p-4">
                          <div className="flex items-center space-x-2">
                            {accessible ? (
                              <Unlock className="h-5 w-5 text-white" />
                            ) : (
                              <Lock className="h-5 w-5 text-white" />
                            )}
                            <span className="text-white text-sm font-medium">
                              {opportunity.required_tokens} votes required
                            </span>
                          </div>
                          {matched && (
                            <div className="flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Sparkles className="h-3 w-3 text-yellow-400" />
                              <span className="text-yellow-300 text-xs font-medium">AI Match</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Opportunity Info */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-white mb-2">{opportunity.title}</h3>
                          <p className="text-purple-300 text-sm font-medium mb-2">{opportunity.company}</p>
                          <p className={`text-sm mb-3 ${accessible ? 'text-gray-300' : 'text-gray-500'}`}>
                            {opportunity.description}
                          </p>
                        </div>

                        {/* Tags */}
                        {opportunity.tags && opportunity.tags.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {opportunity.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    accessible
                                      ? 'bg-white/10 text-gray-300'
                                      : 'bg-white/5 text-gray-500'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                              {opportunity.tags.length > 3 && (
                                <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                                  +{opportunity.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(opportunity.created_at).toLocaleDateString()}</span>
                          </div>
                          <span className="capitalize">{opportunity.category}</span>
                        </div>

                        {/* Action Button */}
                        {accessible ? (
                          <a
                            href={opportunity.application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
                          >
                            <span>Apply Now</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <div className="w-full bg-red-500/20 text-red-300 px-4 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 cursor-not-allowed">
                            <Lock className="h-4 w-4" />
                            <span>Need {opportunity.required_tokens - userProfile.total_votes} more votes</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Call to Action */}
          {userProfile.total_votes < 10 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 text-center"
            >
              <div className="bg-gradient-to-r from-purple-900/50 via-black/50 to-blue-900/50 rounded-2xl p-8 border border-white/10">
                <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Need More Votes?</h3>
                <p className="text-gray-300 mb-6">
                  Get discovered by the community to unlock more opportunities
                </p>
                <a
                  href="/discover"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Get Discovered
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}