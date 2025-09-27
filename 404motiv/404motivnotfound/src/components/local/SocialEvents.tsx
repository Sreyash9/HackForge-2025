import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Share2, Heart } from 'lucide-react';
import { socialEvents as mockEvents } from '../../data/mockData';
import CreateEventForm from './CreateEventForm';
import { SocialEvent } from '../../types';

export default function SocialEvents() {
  const [events, setEvents] = useState<SocialEvent[]>(mockEvents);
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);

  const joinEvent = (eventId: string) => {
    setJoinedEvents(prev => new Set(prev).add(eventId));
  };

  const leaveEvent = (eventId: string) => {
    setJoinedEvents(prev => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Community Programs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join local recycling programs, awareness drives, and community events. 
          Connect with like-minded individuals and make a collective impact!
        </p>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">
              {events.reduce((sum, event) => sum + event.participants, 0)}
            </div>
            <div className="text-green-100">Total Participants</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">{events.length}</div>
            <div className="text-green-100">Active Events</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">{joinedEvents.size}</div>
            <div className="text-green-100">Events You Joined</div>
          </div>
        </div>
      </div>

      {/* Create Event Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Organize an Event</h3>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
        <p className="text-gray-600">
          Have an idea for a community recycling event? Create your own program and invite others to join!
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Upcoming Events</h3>
        
        <div className="grid gap-6">
          {events.map((event) => {
            const isJoined = joinedEvents.has(event.id);
            const participationPercentage = (event.participants / event.maxParticipants) * 100;
            
            return (
              <div key={event.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-semibold text-gray-900">{event.title}</h4>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-green-500" />
                        <span>{event.participants}/{event.maxParticipants} participants</span>
                      </div>
                    </div>

                    {/* Participation Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Participation</span>
                        <span>{Math.round(participationPercentage)}% filled</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            participationPercentage >= 80 
                              ? 'bg-red-500' 
                              : participationPercentage >= 60 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${participationPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-6">
                    {!isJoined ? (
                      <button
                        onClick={() => joinEvent(event.id)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Join Event</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-green-100 text-green-700 px-6 py-2 rounded-lg text-center font-medium">
                          ✓ Joined
                        </div>
                        <button
                          onClick={() => leaveEvent(event.id)}
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors text-center w-full"
                        >
                          Leave Event
                        </button>
                      </div>
                    )}
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Event Form Modal */}
      {showCreateForm && (
        <CreateEventForm
          onClose={() => setShowCreateForm(false)}
          onSave={(newEvent) => {
            setEvents(prev => [...prev, newEvent]);
            setShowCreateForm(false);
          }}
        />
      )}

      {/* Community Impact */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">2,450 kg</div>
            <div className="text-sm text-green-700">Waste Collected</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
            <div className="text-sm text-blue-700">Active Members</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">24</div>
            <div className="text-sm text-purple-700">Events This Month</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">8.2 tons</div>
            <div className="text-sm text-orange-700">CO₂ Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
}