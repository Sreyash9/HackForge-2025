import React, { useState } from 'react';
import { Building, Plus, MessageSquare, Star, CheckCircle, Clock } from 'lucide-react';

interface Partnership {
  id: string;
  companyName: string;
  type: 'manufacturer' | 'grs-brand';
  status: 'active' | 'pending' | 'requested';
  contactPerson: string;
  email: string;
  categories: string[];
  establishedDate?: string;
  logo?: string;
}

export default function Partnerships() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([
    {
      id: '1',
      companyName: 'GreenTech Industries',
      type: 'grs-brand',
      status: 'active',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@greentech.com',
      categories: ['plastic', 'electronics'],
      establishedDate: '2024-01-15'
    },
    {
      id: '2',
      companyName: 'EcoPackaging Ltd',
      type: 'manufacturer',
      status: 'pending',
      contactPerson: 'Mike Chen',
      email: 'mike@ecopack.com',
      categories: ['plastic', 'paper']
    },
    {
      id: '3',
      companyName: 'TechGuard Corp',
      type: 'manufacturer',
      status: 'requested',
      contactPerson: 'Lisa Wang',
      email: 'lisa@techguard.com',
      categories: ['electronics']
    }
  ]);

  const [showRequestForm, setShowRequestForm] = useState(false);

  const getStatusColor = (status: Partnership['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'requested': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: Partnership['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'requested': return <MessageSquare className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Brand Partnerships</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with GRS certified brands and manufacturers to expand your recycling network 
          and grow your business opportunities.
        </p>
      </div>

      {/* Partnership Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Partnerships</h3>
          <p className="text-3xl font-bold text-green-600">
            {partnerships.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {partnerships.filter(p => p.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Requested</h3>
          <p className="text-3xl font-bold text-blue-600">
            {partnerships.filter(p => p.status === 'requested').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
            <Building className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">GRS Brands</h3>
          <p className="text-3xl font-bold text-purple-600">
            {partnerships.filter(p => p.type === 'grs-brand').length}
          </p>
        </div>
      </div>

      {/* Request New Partnership */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Request New Partnership</h3>
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Reach out to GRS certified brands and manufacturers to offer your recycling services 
          and establish new business relationships.
        </p>

        {showRequestForm && (
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="manufacturer">Manufacturer</option>
                  <option value="grs-brand">GRS Brand</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Contact person name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="contact@company.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Introduce your services and explain how you can help with their recycling needs..."
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowRequestForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Send Request
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Partnership List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Your Partnerships</h3>
        
        <div className="space-y-4">
          {partnerships.map((partnership) => (
            <div key={partnership.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{partnership.companyName}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(partnership.status)} flex items-center space-x-1`}>
                          {getStatusIcon(partnership.status)}
                          <span className="capitalize">{partnership.status}</span>
                        </span>
                        <span className="text-sm text-gray-500 capitalize">
                          {partnership.type === 'grs-brand' ? 'GRS Brand' : 'Manufacturer'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium text-gray-900">{partnership.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{partnership.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {partnership.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {partnership.establishedDate && (
                    <p className="text-sm text-gray-500 mt-3">
                      Partnership established: {new Date(partnership.establishedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-2 lg:ml-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Contact</span>
                  </button>
                  {partnership.status === 'active' && (
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>Review</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Partnership Success</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">15+</div>
            <div className="text-purple-100">Active Partnerships</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">2,340</div>
            <div className="text-purple-100">Items Processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-purple-100">Partner Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}