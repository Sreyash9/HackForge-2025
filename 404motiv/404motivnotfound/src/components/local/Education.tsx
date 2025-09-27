import React, { useState } from 'react';
import { Trophy, Star, CheckCircle, Lock, Play, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { educationLevels } from '../../data/mockData';

export default function Education() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const completedLevels = educationLevels.filter(level => level.completed).length;
  const totalPoints = educationLevels.reduce((sum, level) => level.completed ? sum + level.points : sum, 0);

  const handleStartLevel = (levelId: string) => {
    // Simulate completing a level
    setTimeout(() => {
      setSelectedLevel(null);
      // In a real app, this would update the backend
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gamified Waste Education</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn about waste management and recycling through interactive levels. 
          Complete challenges, earn badges, and become a recycling expert!
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-8 h-8 mr-2" />
              <span className="text-2xl font-bold">{completedLevels}</span>
            </div>
            <p className="text-green-100">Levels Completed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-8 h-8 mr-2" />
              <span className="text-2xl font-bold">{totalPoints}</span>
            </div>
            <p className="text-green-100">Points Earned</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-8 h-8 mr-2" />
              <span className="text-2xl font-bold">{educationLevels.filter(l => l.badge && l.completed).length}</span>
            </div>
            <p className="text-green-100">Badges Collected</p>
          </div>
        </div>
      </div>

      {/* Recycling Basics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Recycling Basics</h3>
            <p className="text-gray-600 mt-1">Start with the fundamentals of recycling</p>
          </div>
          <Link
            to="/recycling-basics"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Start Learning</span>
          </Link>
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Learning Path</h3>
        
        <div className="space-y-4">
          {educationLevels.map((level, index) => {
            const isAccessible = index === 0 || educationLevels[index - 1]?.completed;
            
            return (
              <div
                key={level.id}
                className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${
                  level.completed
                    ? 'border-green-200 bg-green-50'
                    : isAccessible
                    ? 'border-blue-200 bg-blue-50 hover:shadow-md cursor-pointer'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
                onClick={() => isAccessible && !level.completed && setSelectedLevel(level.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      level.completed
                        ? 'bg-green-200 text-green-700'
                        : isAccessible
                        ? 'bg-blue-200 text-blue-700'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {level.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isAccessible ? (
                        <Play className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        {level.title}
                        {level.badge && level.completed && (
                          <span className="ml-2 text-2xl">{level.badge}</span>
                        )}
                      </h4>
                      <p className="text-gray-600">{level.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      level.completed ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {level.points} pts
                    </div>
                    <div className="text-sm text-gray-500">
                      {level.completed ? 'Completed' : isAccessible ? 'Available' : 'Locked'}
                    </div>
                  </div>
                </div>

                {selectedLevel === level.id && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h5 className="font-semibold text-gray-900 mb-2">Starting Level...</h5>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Loading interactive content...</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {educationLevels.map((level) => (
            <div
              key={`badge-${level.id}`}
              className={`text-center p-4 rounded-lg ${
                level.completed && level.badge
                  ? 'bg-yellow-50 border-2 border-yellow-200'
                  : 'bg-gray-50 border-2 border-gray-200 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">
                {level.badge || '🔒'}
              </div>
              <h4 className="font-medium text-gray-900 text-sm">{level.title}</h4>
              {level.completed && (
                <p className="text-xs text-green-600 mt-1">Earned!</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}