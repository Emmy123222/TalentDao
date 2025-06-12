import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'react-hot-toast';
import {
  User, ExternalLink, Vote, Heart, Share2, Trophy, Calendar,
  Sparkles, MapPin, Mail, Twitter, Github, Linkedin, Globe
} from 'lucide-react';
import { supabase, Creator, Vote as VoteType } from '../lib/supabase';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { address, isConnected } = useAccount();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [votes, setVotes] = useState<VoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voteAmount, setVoteAmount] = useState('1');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (id) {
      fetchCreatorProfile();
      fetchVotes();
    }
  }, [id]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Vote cast successfully!');
      fetchCreatorProfile(); // Refresh to get updated vote count
      fetchVotes();
      setVoting(false);
    }
  }, [isConfirmed]);

  const fetchCreatorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCreator(data);
    } catch (error) {
      console.error('Error fetching creator:', error);
      toast.error('Failed to load creator profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('creator_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVotes(data || []);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const handleVote = async () => {
    if (!isConnected || !address || !creator) {
      toast.error('Please connect your wallet');
      return;
    }

    if (creator.wallet_address === address) {
      toast.error('You cannot vote for yourself');
      return;
    }

    setVoting(true);
    
    try {
      const amount = parseFloat(voteAmount);
      if (amount <= 0 || amount > 10) {
        toast.error('Vote amount must be between 1 and 10');
        setVoting(false);
        return;
      }

      // For demo purposes, we'll simulate the vote in the database
      // In a real implementation, this would interact with smart contracts
      const { error } = await supabase
        .from('votes')
        .insert([
          {
            creator_id: creator.id,
            curator_address: address,
            amount: amount,
            transaction_hash: `demo_${Date.now()}` // In real app, this would be the actual tx hash
          }
        ]);

      if (error) throw error;

      // Update creator's total votes
      const { error: updateError } = await supabase
        .from('creators')
        .update({ total_votes: creator.total_votes + amount })
        .eq('id', creator.id);

      if (updateError) throw updateError;

      toast.success('Vote cast successfully!');
      fetchCreatorProfile();
      fetchVotes();
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile link copied to clipboard!');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400">The creator profile you're looking for doesn't exist.</p>
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
          {/* Profile Header */}
          <div className="relative">
            {/* Cover Image */}
            <div className={`h-64 bg-gradient-to-r ${getCategoryColor(creator.category)} rounded-2xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2 bg-black/30 backdrop-blur-sm rounded-lg text-white hover:bg-black/50 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                {creator.nft_minted && (
                  <div className="bg-purple-500/20 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-sm">
                    NFT Minted
                  </div>
                )}
              </div>
              
              {/* Profile Avatar */}
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-2xl border-4 border-white/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {creator.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 pb-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="mb-6 md:mb-0">
                  <h1 className="text-4xl font-bold text-white mb-2">{creator.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-300 mb-4">
                    <span className="capitalize text-purple-300">{creator.category}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(creator.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {formatAddress(creator.wallet_address)}
                  </p>
                </div>

                {/* Vote Section */}
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{creator.total_votes}</div>
                    <div className="text-gray-400 text-sm">Total Votes</div>
                  </div>
                  
                  {isConnected && creator.wallet_address !== address && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={voteAmount}
                        onChange={(e) => setVoteAmount(e.target.value)}
                        className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-center"
                      />
                      <button
                        onClick={handleVote}
                        disabled={voting || isPending || isConfirming}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
                      >
                        {voting || isPending || isConfirming ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Voting...</span>
                          </>
                        ) : (
                          <>
                            <Vote className="h-4 w-4" />
                            <span>Vote</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                <p className="text-gray-300 leading-relaxed">{creator.bio}</p>
              </div>

              {/* Skills */}
              {creator.skills && creator.skills.length > 0 && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {creator.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-white/10 rounded-full text-gray-300 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Tags */}
              {creator.ai_tags && creator.ai_tags.length > 0 && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    <h2 className="text-xl font-semibold text-white">AI-Generated Tags</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {creator.ai_tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm border border-yellow-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {creator.portfolio_links && creator.portfolio_links.length > 0 && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Portfolio</h2>
                  <div className="space-y-3">
                    {creator.portfolio_links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors p-3 bg-white/5 rounded-lg hover:bg-white/10"
                      >
                        <ExternalLink className="h-5 w-5" />
                        <span className="truncate">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Votes</span>
                    <span className="text-white font-semibold">{creator.total_votes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Rank</span>
                    <span className="text-purple-400 font-semibold">#TBD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">NFT Status</span>
                    <span className={`font-semibold ${creator.nft_minted ? 'text-green-400' : 'text-gray-400'}`}>
                      {creator.nft_minted ? 'Minted' : 'Not Minted'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Votes */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Recent Votes</h2>
                {votes.length === 0 ? (
                  <p className="text-gray-400">No votes yet</p>
                ) : (
                  <div className="space-y-3">
                    {votes.slice(0, 5).map((vote) => (
                      <div key={vote.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">+{vote.amount} votes</p>
                          <p className="text-gray-400 text-sm">
                            {formatAddress(vote.curator_address)}
                          </p>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {new Date(vote.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}