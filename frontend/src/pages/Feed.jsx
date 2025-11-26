import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Shield,
  ArrowRight,
  Menu,
  X,
  Check,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Feed = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>

      {/* Navigation */}
      <Navbar />


      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-gray-800/20 px-4 py-2 rounded-full border border-gray-700/30">
              <Sparkles className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Track. Analyze. Save Money.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Master Your Finances
              <br />
              <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Smart expense tracking powered by AI. Get real-time insights, set budgets, and achieve your financial goals effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user?.user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg hover:shadow-lg hover:shadow-gray-800/50 transition-all transform hover:scale-105"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate('/signin')}
                  className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg hover:shadow-lg hover:shadow-gray-800/50 transition-all transform hover:scale-105"
                >
                   Get Started
                </button>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Feed;