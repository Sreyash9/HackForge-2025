import React, { useState } from 'react';
import { Upload, Camera, Trash2, FileText, Wine, Zap, Smartphone, ArrowRight, Check } from 'lucide-react';
import { wasteCategories } from '../../data/mockData';

interface RecognitionResult {
  category: string;
  confidence: number;
  suggestions: string[];
}

export default function ImageRecognition() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      // Mock recognition results
      const mockResults: RecognitionResult[] = [
        {
          category: 'Plastic',
          confidence: 92,
          suggestions: ['Remove labels and caps', 'Rinse thoroughly', 'Check recycling number']
        },
        {
          category: 'Paper',
          confidence: 88,
          suggestions: ['Remove any plastic components', 'Keep dry', 'Separate glossy materials']
        },
        {
          category: 'Electronics',
          confidence: 95,
          suggestions: ['Remove batteries', 'Find certified e-waste recycler', 'Data wipe recommended']
        }
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'plastic': return Trash2;
      case 'paper': return FileText;
      case 'glass': return Wine;
      case 'metal': return Zap;
      case 'electronics': return Smartphone;
      default: return Trash2;
    }
  };

  const getCategoryData = (categoryName: string) => {
    return wasteCategories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Smart Waste Recognition</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload or capture an image of your waste item, and our AI will identify the category 
          and provide recycling recommendations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Image</h3>
          
          {!selectedImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-400 transition-colors">
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Select an image to analyze</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
                <label className="inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
                    Choose File
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected waste item"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Analyze Image</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recognition Results</h3>
          
          {!result ? (
            <div className="text-center py-12 text-gray-500">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Upload an image to see recognition results</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {(() => {
                    const Icon = getIconForCategory(result.category);
                    return <Icon className="w-8 h-8 text-green-600" />;
                  })()}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{result.category}</h4>
                    <p className="text-sm text-green-600">{result.confidence}% confidence</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Preparation Tips</h5>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {(() => {
                const categoryData = getCategoryData(result.category);
                if (categoryData && categoryData.recyclers.length > 0) {
                  return (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Recommended Recyclers</h5>
                      <div className="space-y-3">
                        {categoryData.recyclers.slice(0, 2).map((recycler) => (
                          <div key={recycler.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h6 className="font-medium text-gray-900">{recycler.name}</h6>
                                <p className="text-sm text-gray-600">{recycler.distance} km away</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-green-600">
                                  {recycler.rating}★
                                </span>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <span>Get Recycler Suggestions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}