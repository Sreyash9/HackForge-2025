import React, { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, MapPin, Phone, Mail, Check, Star } from 'lucide-react';
import { recyclers } from '../../data/mockData';
import EditServiceForm from './EditServiceForm';

export default function ServiceManagement() {
  const [services, setServices] = useState(recyclers);
  const [editingService, setEditingService] = useState<string | null>(null);

  const categories = ['plastic', 'paper', 'glass', 'metal', 'electronics', 'batteries'];

  const toggleCategory = (serviceId: string, category: string) => {
    setServices(prev => prev.map(service => {
      if (service.id === serviceId) {
        const updatedCategories = service.categories.includes(category)
          ? service.categories.filter(c => c !== category)
          : [...service.categories, category];
        return { ...service, categories: updatedCategories };
      }
      return service;
    }));
  };

  const handleSaveEdit = (updatedService: typeof recyclers[0]) => {
    setServices(prev => prev.map(service => 
      service.id === updatedService.id ? updatedService : service
    ));
    setEditingService(null);
  };

  const handleCloseEdit = () => {
    setEditingService(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Management</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Manage your recycling service offerings, update contact information, 
          and configure the waste categories you handle.
        </p>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
            <span className="text-purple-600 font-bold text-lg">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Services</h3>
          <p className="text-3xl font-bold text-purple-600">{services.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Verified</h3>
          <p className="text-3xl font-bold text-green-600">{services.filter(s => s.verified).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Avg. Rating</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {(services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
            <span className="text-blue-600 font-bold text-lg">🏭</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Categories</h3>
          <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
        </div>
      </div>

      {/* Service Listings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Your Services</h3>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">{service.name}</h4>
                    {service.verified && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        ✓ Verified
                      </span>
                    )}
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-600">{service.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">{service.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">{service.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">{service.email}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Accepted Categories</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((category) => {
                        const isAccepted = service.categories.includes(category);
                        return (
                          <button
                            key={category}
                            onClick={() => toggleCategory(service.id, category)}
                            className={`p-3 rounded-lg border transition-all text-left ${
                              isAccepted
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-300 hover:border-purple-300 text-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="capitalize font-medium">{category}</span>
                              {isAccepted && <Check className="w-4 h-4" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 lg:ml-6">
                  <button
                    onClick={() => setEditingService(service.id)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <EditServiceForm
          service={services.find(s => s.id === editingService) || null}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
        />
      )}

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📞</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Monthly Contacts</h4>
            <p className="text-3xl font-bold text-blue-600">247</p>
            <p className="text-sm text-gray-500">+18% from last month</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">♻️</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Items Processed</h4>
            <p className="text-3xl font-bold text-green-600">3,421</p>
            <p className="text-sm text-gray-500">+25% from last month</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Satisfaction Rate</h4>
            <p className="text-3xl font-bold text-purple-600">4.8/5</p>
            <p className="text-sm text-gray-500">Based on 156 reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}