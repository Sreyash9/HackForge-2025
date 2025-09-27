import React, { useState } from 'react';
import { QrCode, Package, BarChart3, Settings } from 'lucide-react';
import QRGenerator from './QRGenerator';
import ProductManagement from './ProductManagement';
import Analytics from './Analytics';

type ActiveTab = 'overview' | 'qr-generator' | 'products' | 'analytics';

export default function ManufacturerDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'qr-generator', label: 'QR Generator', icon: QrCode },
    { id: 'products', label: 'Product Management', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'qr-generator':
        return <QRGenerator />;
      case 'products':
        return <ProductManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Manufacturer Dashboard</h2>
              <p className="text-blue-100 mb-6">
                Generate QR codes for your products, manage your product portfolio, 
                and track recycling impact through comprehensive analytics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <QrCode className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">QR Generation</h3>
                  <p className="text-sm text-blue-100">Create recycling QR codes for products</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <Package className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Product Portfolio</h3>
                  <p className="text-sm text-blue-100">Manage your product catalog</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <BarChart3 className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold mb-1">Impact Analytics</h3>
                  <p className="text-sm text-blue-100">Track recycling performance</p>
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
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tab.label}</h3>
                    <p className="text-sm text-gray-600">
                      {tab.id === 'qr-generator' && 'Create QR codes that connect customers with recyclers'}
                      {tab.id === 'products' && 'Manage your product database and specifications'}
                      {tab.id === 'analytics' && 'View recycling statistics and environmental impact'}
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
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
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