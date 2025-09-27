import React, { useState } from 'react';
import { Building, Users, BarChart3, Settings } from 'lucide-react';
import ServiceManagement from './ServiceManagement';
import Partnerships from './Partnerships';
import Analytics from './Analytics';

type ActiveTab = 'overview' | 'services' | 'partnerships' | 'analytics';

export default function RecyclerDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'partnerships', label: 'Partnerships', icon: Building },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'services':
        return <ServiceManagement />;
      case 'partnerships':
        return <Partnerships />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Recycler Dashboard</h2>
              <p className="text-purple-100 mb-6">
                Manage your recycling services, connect with manufacturers and GRS brands, 
                and track your business performance through comprehensive analytics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <Settings className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Service Management</h3>
                  <p className="text-sm text-purple-100">Configure your recycling capabilities</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <Building className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Brand Partnerships</h3>
                  <p className="text-sm text-purple-100">Connect with GRS certified brands</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <Users className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Customer Network</h3>
                  <p className="text-sm text-purple-100">Expand your customer reach</p>
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
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tab.label}</h3>
                    <p className="text-sm text-gray-600">
                      {tab.id === 'services' && 'Manage your recycling capabilities and service offerings'}
                      {tab.id === 'partnerships' && 'Connect with manufacturers and GRS certified brands'}
                      {tab.id === 'analytics' && 'Monitor performance and business growth metrics'}
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
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
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