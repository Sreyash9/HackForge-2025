import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { weatherService, WeatherData, EnergyRecommendation } from '../services/weatherService';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<EnergyRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [summary, setSummary] = useState('');
  const [aiTips, setAiTips] = useState('');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    fetchWeatherData();
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    try {
      const data = await weatherService.getEnergyInsights();
      setWeather(data.weather);
      setRecommendations(data.recommendations);
      setSummary(data.summary);
      setAiTips(data.aiTips);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });
      
      setLocationPermission('granted');
      fetchWeatherData(); // Refetch with current location
    } catch (error) {
      console.warn('Location permission denied:', error);
      setLocationPermission('denied');
    }
  };

  const getWeatherIcon = (description: string) => {
    if (description.includes('sunny')) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (description.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (description.includes('cloudy')) return <Cloud className="w-8 h-8 text-gray-500" />;
    return <Sun className="w-8 h-8 text-yellow-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-700';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'low': return 'bg-green-50 border-green-200 text-green-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <div className="space-y-4">
      {/* Main Weather Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              {getWeatherIcon(weather.description)}
              Weather & Energy Insights
              {weather.location.includes('Verna') && locationPermission !== 'granted' && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Default Location
                </span>
              )}
            </span>
            <div className="flex gap-2">
              {locationPermission === 'prompt' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestLocation}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  📍 Use My Location
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Zap className="w-4 h-4 mr-1" />
                {recommendations.length} Tips
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Thermometer className="w-4 h-4 text-red-500 mr-1" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{weather.temperature.toFixed(1)}°C</div>
              <div className="text-xs text-gray-600">Temperature</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Droplets className="w-4 h-4 text-blue-500 mr-1" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{weather.humidity.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Humidity</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Wind className="w-4 h-4 text-green-500 mr-1" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{weather.windSpeed.toFixed(0)}</div>
              <div className="text-xs text-gray-600">km/h Wind</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Eye className="w-4 h-4 text-purple-500 mr-1" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{weather.uvIndex.toFixed(0)}</div>
              <div className="text-xs text-gray-600">UV Index</div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">📍 {weather.location}</p>
            <p className="text-sm text-gray-700 bg-white/50 rounded-lg p-3">
              {summary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Energy Recommendations */}
      <AnimatePresence>
        {showRecommendations && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Today's Energy Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${getPriorityColor(rec.priority)}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{rec.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {rec.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{rec.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-green-600">💰 {rec.estimatedSavings}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {aiTips && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                      <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                        🤖 AI-Powered Energy Tips
                      </h4>
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {aiTips}
                      </div>
                    </div>
                  )}
                  
                  {recommendations.length === 0 && !aiTips && (
                    <div className="text-center py-8 text-gray-500">
                      <Cloud className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No specific recommendations for current weather conditions.</p>
                      <p className="text-sm">Keep monitoring for energy-saving opportunities!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherWidget;