import React from 'react';
import { ArrowLeft, Play, Book, Award, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const lessons = [
  {
    id: 'basics-1',
    title: 'Introduction to Recycling',
    description: 'Learn the fundamentals of recycling and why it matters',
    duration: '5 mins',
    type: 'video',
    thumbnailUrl: 'https://img.youtube.com/vi/Y6LzB6rMDtA/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/Y6LzB6rMDtA',
    completed: false
  },
  {
    id: 'basics-2',
    title: 'Types of Recyclable Materials',
    description: 'Understanding different materials and their recycling symbols',
    duration: '8 mins',
    type: 'interactive',
    thumbnailUrl: '/images/recycling-symbols.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
    completed: false
  },
  {
    id: 'basics-3',
    title: 'Proper Waste Sorting',
    description: 'Learn how to sort different types of waste correctly',
    duration: '6 mins',
    type: 'video',
    thumbnailUrl: 'https://img.youtube.com/vi/HSH7UALJArI/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/HSH7UALJArI',
    completed: false
  },
  {
    id: 'basics-4',
    title: 'Recycling Best Practices',
    description: 'Tips and tricks for effective recycling at home',
    duration: '7 mins',
    type: 'interactive',
    thumbnailUrl: '/images/recycling-tips.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0',
    completed: false
  }
];

export default function RecyclingBasics() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-green-100 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Education</span>
          </button>
          
          <h1 className="text-3xl font-bold mb-2">Recycling Basics</h1>
          <p className="text-green-100 max-w-3xl">
            Start your recycling journey with these fundamental lessons. Learn through engaging videos
            and interactive content to become a recycling expert!
          </p>
          
          {/* Progress Overview */}
          <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">0/{lessons.length}</div>
                <div className="text-green-100">Lessons Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">0%</div>
                <div className="text-green-100">Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-green-100">Points Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={lesson.thumbnailUrl}
                  alt={lesson.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  {lesson.type === 'video' ? (
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      <Play className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      <Book className="w-6 h-6 text-green-600" />
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  {lesson.completed ? (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="bg-white bg-opacity-80 px-2 py-1 rounded-full text-sm">
                      {lesson.duration}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                <p className="text-gray-600 mb-4">{lesson.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {lesson.type === 'video' ? '🎥 Video Lesson' : '🔄 Interactive'}
                  </span>
                  <button 
                    onClick={() => {
                      // Handle lesson start
                      if (lesson.type === 'video') {
                        window.open(lesson.videoUrl, '_blank');
                      } else {
                        // Handle interactive content
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Lesson</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Section */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Your Achievements</h2>
            <p className="text-gray-600">Complete lessons to earn badges and rewards!</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Recycling Rookie',
              'Waste Warrior',
              'Sorting Specialist',
              'Green Guardian'
            ].map((badge, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6 text-center opacity-50">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900">{badge}</h3>
                <p className="text-sm text-gray-500 mt-1">Locked</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}