import React from 'react';
import { TrendingUp, Users, Recycle, Award, BarChart3, Target } from 'lucide-react';
import { PDFDownloadButton } from './SustainabilityReport';

export default function Analytics() {
  const metrics = [
    { 
      title: 'QR Codes Scanned', 
      value: '2,847', 
      change: '+12%', 
      positive: true,
      icon: TrendingUp 
    },
    { 
      title: 'Active Users', 
      value: '1,234', 
      change: '+8%', 
      positive: true,
      icon: Users 
    },
    { 
      title: 'Items Recycled', 
      value: '5,692', 
      change: '+15%', 
      positive: true,
      icon: Recycle 
    },
    { 
      title: 'Environmental Score', 
      value: '94/100', 
      change: '+3%', 
      positive: true,
      icon: Award 
    }
  ];

  const topProducts = [
    { name: 'Eco Water Bottle', scans: 456, category: 'Plastic' },
    { name: 'Smart Phone Case', scans: 324, category: 'Electronics' },
    { name: 'Food Container', scans: 289, category: 'Plastic' },
    { name: 'Glass Jar', scans: 187, category: 'Glass' },
    { name: 'Metal Can', scans: 156, category: 'Metal' }
  ];

  const recyclingImpact = [
    { material: 'Plastic', recycled: '2,340 kg', savings: '4.2 tons CO₂' },
    { material: 'Electronics', recycled: '890 kg', savings: '1.8 tons CO₂' },
    { material: 'Glass', recycled: '1,560 kg', savings: '0.9 tons CO₂' },
    { material: 'Metal', recycled: '680 kg', savings: '1.1 tons CO₂' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track the performance of your recycling program, monitor user engagement, 
          and measure your environmental impact.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  metric.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">{product.scans}</p>
                  <p className="text-xs text-gray-500">scans</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Environmental Impact</h3>
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {recyclingImpact.map((impact, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{impact.material}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    impact.material === 'Plastic' ? 'bg-blue-100 text-blue-700' :
                    impact.material === 'Electronics' ? 'bg-purple-100 text-purple-700' :
                    impact.material === 'Glass' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {impact.material}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Recycled</p>
                    <p className="font-semibold text-green-600">{impact.recycled}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">CO₂ Saved</p>
                    <p className="font-semibold text-green-600">{impact.savings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chart visualization would appear here</p>
            <p className="text-sm text-gray-400">Showing QR scans, recycling volume, and impact over time</p>
          </div>
        </div>
      </div>

      {/* Sustainability Report */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Sustainability Report</h3>
            <p className="text-green-100 mb-6">
              Your recycling program has made a significant positive impact on the environment. 
              Generate a comprehensive sustainability report to share with stakeholders.
            </p>
            <PDFDownloadButton />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">8.1</div>
              <div className="text-green-100 text-sm">Total CO₂ Saved (tons)</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">5,470</div>
              <div className="text-green-100 text-sm">Items Recycled</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">92%</div>
              <div className="text-green-100 text-sm">Recycling Rate</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">1,234</div>
              <div className="text-green-100 text-sm">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}