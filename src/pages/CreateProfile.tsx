import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { User, Palette, Code, Music, Camera, Pen, Sparkles, Upload, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateAITags } from '../lib/ai';

const categories = [
  { id: 'developer', label: 'Developer', icon: Code, color: 'from-blue-500 to-cyan-500' },
  { id: 'artist', label: 'Visual Artist', icon: Palette, color: 'from-purple-500 to-pink-500' },
  { id: 'musician', label: 'Musician', icon: Music, color: 'from-green-500 to-teal-500' },
  { id: 'photographer', label: 'Photographer', icon: Camera, color: 'from-yellow-500 to-orange-500' },
  { id: 'writer', label: 'Writer', icon: Pen, color: 'from-red-500 to-rose-500' },
  { id: 'other', label: 'Other', icon: User, color: 'from-gray-500 to-slate-500' }
];

export default function CreateProfile() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    category: '',
    skills: [''],
    portfolioLinks: ['']
  });

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const addPortfolioLink = () => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: [...prev.portfolioLinks, '']
    }));
  };

  const removePortfolioLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((_, i) => i !== index)
    }));
  };

  const updatePortfolioLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.map((link, i) => i === index ? value : link)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.name || !formData.bio || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Generate AI tags
      const aiTags = await generateAITags(formData.bio, formData.category);
      
      // Filter out empty skills and links
      const skills = formData.skills.filter(skill => skill.trim() !== '');
      const portfolioLinks = formData.portfolioLinks.filter(link => link.trim() !== '');

      // Save to Supabase
      const { data, error } = await supabase
        .from('creators')
        .insert([
          {
            wallet_address: address,
            name: formData.name,
            bio: formData.bio,
            category: formData.category,
            skills,
            portfolio_links: portfolioLinks,
            ai_tags: aiTags,
            nft_minted: false,
            total_votes: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Profile created successfully! AI tags generated.');
      
      // Reset form
      setFormData({
        name: '',
        bio: '',
        category: '',
        skills: [''],
        portfolioLinks: ['']
      });

    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to create your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <h1 className="text-4xl font-bold text-white">Create Your Profile</h1>
            </div>
            <p className="text-xl text-gray-300">
              Mint your creator profile as an NFT and get discovered by the community
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your display name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio *
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us about yourself, your work, and what makes you unique..."
                    required
                  />
                  <p className="text-sm text-gray-400 mt-1">AI will analyze your bio to generate relevant tags</p>
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Category *</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.category === category.id
                          ? 'border-purple-400 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-2`}>
                        <category.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-white font-medium">{category.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Skills</h3>
                <div className="space-y-3">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex space-x-3">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., React, JavaScript, UI/UX Design"
                      />
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Skill</span>
                  </button>
                </div>
              </div>

              {/* Portfolio Links */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Portfolio Links</h3>
                <div className="space-y-3">
                  {formData.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex space-x-3">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updatePortfolioLink(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://your-portfolio.com"
                      />
                      {formData.portfolioLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePortfolioLink(index)}
                          className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPortfolioLink}
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Portfolio Link</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Create Profile with AI Tags</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}