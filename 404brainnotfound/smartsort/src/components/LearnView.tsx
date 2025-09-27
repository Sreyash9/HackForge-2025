import React from 'react';
import { Leaf, Recycle, AlertTriangle, TrendingUp, Users, Lightbulb } from 'lucide-react';

export const LearnView: React.FC = () => {
  const impactStats = [
    {
      icon: Recycle,
      title: "Materials Recovered",
      value: "75%",
      description: "of recyclables can be recovered with proper sorting"
    },
    {
      icon: Leaf,
      title: "CO₂ Reduction",
      value: "30%",
      description: "less carbon emissions through recycling vs. new production"
    },
    {
      icon: TrendingUp,
      title: "Energy Saved",
      value: "60%",
      description: "less energy needed for recycled materials"
    },
    {
      icon: Users,
      title: "Jobs Created",
      value: "1.1M",
      description: "recycling and reuse jobs in the circular economy"
    }
  ];

  const wasteHierarchy = [
    {
      level: 1,
      title: "Reduce",
      description: "Buy less, choose products with minimal packaging",
      color: "bg-green-500",
      examples: ["Buy in bulk", "Choose reusable products", "Avoid single-use items"]
    },
    {
      level: 2,
      title: "Reuse",
      description: "Find new purposes for items before disposing",
      color: "bg-blue-500",
      examples: ["Repurpose containers", "Donate usable items", "Creative upcycling"]
    },
    {
      level: 3,
      title: "Recycle",
      description: "Process materials to make new products",
      color: "bg-purple-500",
      examples: ["Sort properly", "Clean containers", "Follow local guidelines"]
    },
    {
      level: 4,
      title: "Dispose",
      description: "Safe disposal when no other option exists",
      color: "bg-gray-500",
      examples: ["Hazardous waste centers", "Proper landfill", "Incineration with energy recovery"]
    }
  ];

  const commonMistakes = [
    {
      mistake: "Wish-cycling",
      description: "Putting non-recyclable items in recycling bins hoping they'll be recycled",
      impact: "Contaminates recycling streams, increases processing costs"
    },
    {
      mistake: "Bagging recyclables",
      description: "Putting recyclables in plastic bags before placing in bins",
      impact: "Bags jam sorting equipment, entire loads may go to landfill"
    },
    {
      mistake: "Not cleaning containers",
      description: "Leaving food residue in containers before recycling",
      impact: "Can contaminate other recyclables and create pest problems"
    },
    {
      mistake: "Mixed materials",
      description: "Not separating different materials (like metal lids from glass jars)",
      impact: "Makes processing difficult, reduces recycling efficiency"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Learn About Waste Management
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Understanding proper waste disposal helps protect our environment and creates a more sustainable future for everyone
        </p>
      </div>

      {/* Impact Statistics */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Environmental Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{stat.title}</h3>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Waste Hierarchy */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">The Waste Hierarchy</h2>
        <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
          The waste hierarchy prioritizes waste management strategies from most to least preferred environmental option
        </p>
        <div className="space-y-4">
          {wasteHierarchy.map((level, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className={`${level.color} text-white p-6 md:w-1/4`}>
                  <div className="text-2xl font-bold mb-2">{level.level}</div>
                  <h3 className="text-xl font-bold">{level.title}</h3>
                </div>
                <div className="p-6 flex-1">
                  <p className="text-gray-700 mb-4">{level.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {level.examples.map((example, i) => (
                      <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Common Recycling Mistakes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commonMistakes.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.mistake}</h3>
                  <p className="text-gray-700 mb-3">{item.description}</p>
                  <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r">
                    <p className="text-sm text-red-700"><strong>Impact:</strong> {item.impact}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips for Success */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tips for Successful Waste Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Lightbulb className="w-8 h-8 text-yellow-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Know Your Local Rules</h3>
            <p className="text-gray-600 text-sm">Recycling guidelines vary by location. Check with your local waste management authority.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Recycle className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Clean Before Recycling</h3>
            <p className="text-gray-600 text-sm">Rinse containers to remove food residue, but don't waste excessive water doing so.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Leaf className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Start Small</h3>
            <p className="text-gray-600 text-sm">Begin with one room or one type of waste. Build habits gradually for lasting change.</p>
          </div>
        </div>
      </div>
    </div>
  );
};