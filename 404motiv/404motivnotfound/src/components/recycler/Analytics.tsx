import React from 'react';
import { TrendingUp, Users, Recycle, DollarSign, BarChart3, Target, Award } from 'lucide-react';

export default function Analytics() {
  const metrics = [
    { 
      title: 'Monthly Revenue', 
      value: '$24,580', 
      change: '+15%', 
      positive: true,
      icon: DollarSign 
    },
    { 
      title: 'New Customers', 
      value: '156', 
      change: '+23%', 
      positive: true,
      icon: Users 
    },
    { 
      title: 'Items Processed', 
      value: '3,247', 
      change: '+18%', 
      positive: true,
      icon: Recycle 
    },
    { 
      title: 'Service Rating', 
      value: '4.8/5', 
      change: '+0.3', 
      positive: true,
      icon: Award 
    }
  ];

  const categoryPerformance = [
    { category: 'Plastic', processed: 1250, revenue: '$8,450', efficiency: 92 },
    { category: 'Electronics', processed: 890, revenue: '$12,340', efficiency: 88 },
    { category: 'Glass', processed: 680, revenue: '$2,180', efficiency: 95 },
    { category: 'Metal', processed: 427, revenue: '$1,610', efficiency: 90 }
  ];

  const topPartners = [
    { name: 'GreenTech Industries', items: 456, revenue: '$5,670' },
    { name: 'EcoPackaging Ltd', items: 324, revenue: '$4,230' },
    { name: 'TechGuard Corp', items: 289, revenue: '$3,890' },
    { name: 'Sustainable Solutions', items: 187, revenue: '$2,140' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Analytics</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Monitor your recycling business performance, track revenue growth, 
          and analyze customer engagement metrics.
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
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-600" />
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
        {/* Category Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {categoryPerformance.map((category, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{category.category}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    category.category === 'Plastic' ? 'bg-blue-100 text-blue-700' :
                    category.category === 'Electronics' ? 'bg-purple-100 text-purple-700' :
                    category.category === 'Glass' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {category.efficiency}% efficiency
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Items Processed</p>
                    <p className="font-semibold text-gray-900">{category.processed.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-semibold text-purple-600">{category.revenue}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        category.category === 'Plastic' ? 'bg-blue-500' :
                        category.category === 'Electronics' ? 'bg-purple-500' :
                        category.category === 'Glass' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${category.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Partners */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Partners</h3>
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {topPartners.map((partner, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{partner.name}</h4>
                    <p className="text-sm text-gray-600">{partner.items} items processed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-purple-600">{partner.revenue}</p>
                  <p className="text-xs text-gray-500">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Revenue and processing volume trends</p>
            <p className="text-sm text-gray-400">Interactive chart would be displayed here</p>
          </div>
        </div>
      </div>

      {/* Business Growth */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-8 text-white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Business Growth Summary</h3>
            <p className="text-purple-100 mb-6">
              Your recycling business is performing exceptionally well with consistent growth 
              across all key performance indicators.
            </p>
            <div className="space-y-2">
              <p className="text-purple-100">✓ Revenue growth: 15% month-over-month</p>
              <p className="text-purple-100">✓ Customer satisfaction: 4.8/5 stars</p>
              <p className="text-purple-100">✓ Partnership success: 98% retention rate</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">$24,580</div>
              <div className="text-purple-100 text-sm">Monthly Revenue</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">3,247</div>
              <div className="text-purple-100 text-sm">Items Processed</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">156</div>
              <div className="text-purple-100 text-sm">New Customers</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold mb-1">15+</div>
              <div className="text-purple-100 text-sm">Active Partners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}