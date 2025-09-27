import React, { useState } from 'react';
import { Bot, Camera, GraduationCap, Info, Users, MessageSquare, Image, BookOpen, Calendar } from 'lucide-react';
import ChatBot from './ChatBot';
import ImageRecognition from './ImageRecognition';
import Education from './Education';
import InteractiveContent from './InteractiveContent';
import SocialEvents from './SocialEvents';

type ActiveTab = 'overview' | 'chatbot' | 'image' | 'education' | 'interactive' | 'social';

export default function LocalUserDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'chatbot', label: 'AI Assistant', icon: Bot },
    { id: 'image', label: 'Scan Waste', icon: Camera },
    { id: 'education', label: 'Learn', icon: GraduationCap },
    { id: 'interactive', label: 'Process Guide', icon: BookOpen },
    { id: 'social', label: 'Community', icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chatbot':
        return <ChatBot />;
      case 'image':
        return <ImageRecognition />;
      case 'education':
        return <Education />;
      case 'interactive':
        return <InteractiveContent />;
      case 'social':
        return <SocialEvents />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Welcome to Your Recycling Hub!</h2>
              <p className="text-green-100 mb-6">
                Discover personalized recycling solutions, learn through interactive content, 
                and connect with your local community to make a positive environmental impact.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <MessageSquare className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">AI Assistant</h3>
                  <p className="text-sm text-green-100">Get personalized recycler recommendations</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <Image className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Smart Recognition</h3>
                  <p className="text-sm text-green-100">Identify waste types instantly</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <Users className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Community</h3>
                  <p className="text-sm text-green-100">Join local recycling events</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tabs.slice(1).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tab.label}</h3>
                    <p className="text-sm text-gray-600">
                      {tab.id === 'chatbot' && 'Get AI-powered recycler suggestions based on your waste types'}
                      {tab.id === 'image' && 'Upload or capture images to identify waste categories'}
                      {tab.id === 'education' && 'Complete levels and earn badges while learning'}
                      {tab.id === 'interactive' && 'Explore the recycling process step by step'}
                      {tab.id === 'social' && 'Join community programs and local events'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300 ease-in-out">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}