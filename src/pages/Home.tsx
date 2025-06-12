import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Vote, Trophy, Sparkles, ArrowRight, Zap, Star, TrendingUp, Globe, Heart } from 'lucide-react';
import GradientCard from '../components/GradientCard';
import AnimatedCounter from '../components/AnimatedCounter';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Mint Profile NFTs',
      description: 'Create your unique creator profile as an NFT with AI-powered tagging and analytics',
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 via-pink-500/10 to-purple-500/5'
    },
    {
      icon: Vote,
      title: 'DAO Voting System',
      description: 'Community-driven curation where votes unlock opportunities and increase visibility',
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 via-cyan-500/10 to-blue-500/5'
    },
    {
      icon: Trophy,
      title: 'Dynamic Leaderboard',
      description: 'Real-time rankings that reflect community support and creator achievements',
      color: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-500/20 via-teal-500/10 to-green-500/5'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Matching',
      description: 'Smart algorithms connect creators to perfect opportunities and collaborations',
      color: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/20 via-orange-500/10 to-yellow-500/5'
    }
  ];

  const stats = [
    { label: 'Creators Discovered', value: 2847, icon: Users },
    { label: 'Votes Cast', value: 48293, icon: Vote },
    { label: 'Opportunities', value: 186, icon: Star },
    { label: 'Communities', value: 29, icon: Globe }
  ];

  const testimonials = [
    {
      name: 'Maya Chen',
      role: 'Full-Stack Developer',
      image: 'MC',
      quote: 'TalentLink helped me get discovered by the Web3 community. The AI matching connected me to opportunities I never would have found.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Kwame Asante',
      role: 'Digital Artist',
      image: 'KA',
      quote: 'As an Afrofuturist artist, finding the right audience was challenging. This platform changed everything for my NFT career.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Priya Sharma',
      role: 'UX Designer',
      image: 'PS',
      quote: 'The focus on accessibility and inclusion makes this platform unique. Finally, a space where diverse creators truly belong.',
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex items-center space-x-2 bg-black/90 px-6 py-3 rounded-full border border-purple-500/30">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    3percentclub Hackathon Project
                  </span>
                </div>
              </div>
            </motion.div>
            
            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight"
            >
              <span className="block">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Discover
                </span>
              </span>
              <span className="block text-white my-2">
                Underrepresented
              </span>
              <span className="block">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Creators
                </span>
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              The first Web3 platform combining{' '}
              <span className="text-purple-400 font-semibold">DAO voting</span> and{' '}
              <span className="text-blue-400 font-semibold">AI matching</span> to uplift diverse talent.
              Mint your profile NFT, get discovered by curators, and unlock token-gated opportunities.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/create"
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-5 rounded-2xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-500 flex items-center space-x-3 text-lg shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                <span className="relative z-10">Start Creating</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </Link>
              
              <Link
                to="/discover"
                className="group bg-white/5 backdrop-blur-xl border border-white/20 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-lg hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  <span>Discover Creators</span>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-full"
              style={{
                width: Math.random() * 400 + 100,
                height: Math.random() * 400 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-50, 50, -50],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <GradientCard className="p-6" hover={false}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Powered by <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Web3</span> & <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">AI</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A complete ecosystem designed to discover, promote, and connect underrepresented talent with unprecedented opportunities
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <GradientCard gradient={feature.bgGradient} className="p-8 h-full">
                  <div className="flex items-start space-x-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black/40 to-blue-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Creator Success Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real creators who found opportunities and community through TalentLink DAO
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <GradientCard className="p-8 h-full">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center text-white font-bold text-xl`}>
                      {testimonial.image}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{testimonial.name}</h4>
                      <p className="text-purple-300 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-300 leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-black/60 to-blue-900/60"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-6 py-3 rounded-full border border-yellow-500/30">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-300 font-medium">Join the Revolution</span>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Ready to Get <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Discovered?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of creators who are already building their reputation in the Web3 ecosystem.
              Your journey to recognition starts with a single click.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/create"
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-6 rounded-2xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-500 flex items-center justify-center space-x-3 text-xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
              >
                <span className="relative z-10">Create Your Profile NFT</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </Link>
              
              <Link
                to="/leaderboard"
                className="group bg-white/5 backdrop-blur-xl border border-white/20 text-white px-12 py-6 rounded-2xl font-bold hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-xl hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Trophy className="h-6 w-6 text-yellow-400" />
                <span>View Leaderboard</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 -z-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-30, 30, -30],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: Math.random() * 4 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}