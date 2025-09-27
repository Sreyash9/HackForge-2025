import React from 'react';
import { Users, Building, Recycle, ArrowRight, Leaf, Globe, Heart } from 'lucide-react';
import { User } from '../types';

interface LandingPageProps {
  onRoleSelect: (role: User['role']) => void;
}

export default function LandingPage({ onRoleSelect }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect. Recycle.{' '}
              <span className="text-green-600">Sustain.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The comprehensive platform connecting communities, manufacturers, and recyclers 
              for a sustainable future. Discover, learn, and make a difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md">
                <Leaf className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Eco-Friendly</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md">
                <Globe className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Community Driven</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium">Impact Focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
          <p className="text-lg text-gray-600">Join our community and start making a difference</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Local Users Card */}
          <div
            onClick={() => onRoleSelect('local')}
            className="group bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Local Users</h3>
            <p className="text-gray-600 mb-6">
              Discover nearby recyclers, learn through gamified education, and participate in community programs.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-700">AI-powered recycler suggestions</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Image recognition for waste sorting</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Gamified learning experience</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Community events & programs</span>
              </li>
            </ul>
            <div className="flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Manufacturers Card */}
          <div
            onClick={() => onRoleSelect('manufacturer')}
            className="group bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Manufacturers</h3>
            <p className="text-gray-600 mb-6">
              Generate QR codes for your products and connect customers with appropriate recycling solutions.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-700">QR code generation system</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Product lifecycle management</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Recycler network integration</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Sustainability reporting</span>
              </li>
            </ul>
            <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Recyclers Card */}
          <div
            onClick={() => onRoleSelect('recycler')}
            className="group bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
              <Recycle className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Recyclers</h3>
            <p className="text-gray-600 mb-6">
              Manage your services, connect with GRS brands, and expand your recycling network reach.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Service portfolio management</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Brand partnership opportunities</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Customer connection platform</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Performance analytics</span>
              </li>
            </ul>
            <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}