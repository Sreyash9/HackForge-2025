// Weather API integration for energy optimization recommendations
interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
  location: string;
}

interface EnergyRecommendation {
  type: 'cooling' | 'heating' | 'lighting' | 'ventilation' | 'general';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedSavings: string;
  icon: string;
}

class WeatherService {
  private API_KEY = 'bd07809d4c38405dbf421418252709';
  private BASE_URL = 'https://api.weatherapi.com/v1';

  // Mock weather data for demo purposes
  private getMockWeatherData(): WeatherData {
    const mockData: WeatherData = {
      temperature: 28 + Math.random() * 10, // 28-38°C (Goa temperature range)
      humidity: 60 + Math.random() * 30, // 60-90% humidity
      description: ['sunny', 'partly cloudy', 'cloudy', 'light rain'][Math.floor(Math.random() * 4)],
      windSpeed: 5 + Math.random() * 15, // 5-20 km/h
      uvIndex: 5 + Math.random() * 7, // 5-12 UV index
      visibility: 8 + Math.random() * 2, // 8-10 km
      location: 'Verna, Goa'
    };
    return mockData;
  }

  // Get user's current location
  private async getCurrentLocation(): Promise<string> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('Verna, Goa');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude},${longitude}`);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          resolve('Verna, Goa');
        },
        {
          timeout: 10000,
          enableHighAccuracy: true
        }
      );
    });
  }

  async getCurrentWeather(city?: string): Promise<WeatherData> {
    try {
      // If no city provided, use current location
      const location = city || await this.getCurrentLocation();
      
      const response = await fetch(`${this.BASE_URL}/current.json?key=${this.API_KEY}&q=${location}&aqi=yes`);
      
      if (!response.ok) {
        console.warn('Weather API failed, using mock data');
        return this.getMockWeatherData();
      }
      
      const data = await response.json();
      
      return {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        description: data.current.condition.text.toLowerCase(),
        windSpeed: data.current.wind_kph,
        uvIndex: data.current.uv,
        visibility: data.current.vis_km,
        location: `${data.location.name}, ${data.location.region}`
      };
    } catch (error) {
      console.warn('Weather API error, using mock data:', error);
      return this.getMockWeatherData();
    }
  }

  async generateAIEnergyTips(weather: WeatherData): Promise<string> {
    try {
      const prompt = `Based on current weather conditions in Goa, India:
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Weather: ${weather.description}
- Wind Speed: ${weather.windSpeed} km/h
- UV Index: ${weather.uvIndex}

Please provide 3-4 specific, actionable energy-saving tips for homeowners. Focus on:
1. Air conditioning optimization
2. Natural lighting usage
3. Ventilation strategies
4. Appliance efficiency

Keep tips concise and include estimated savings percentages where possible.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are an energy efficiency expert specializing in tropical climate energy management. Provide practical, climate-specific advice."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0]?.message?.content || 'Unable to generate AI tips at this time.';
      }
    } catch (error) {
      console.warn('AI tips generation failed:', error);
    }
    
    return this.generateFallbackTips(weather);
  }

  private generateFallbackTips(weather: WeatherData): string {
    let tips = [];
    
    if (weather.temperature > 30) {
      tips.push("🌡️ High temperature detected. Set AC to 24-26°C and use ceiling fans for better air circulation (saves 15-25%).");
    }
    
    if (weather.humidity > 75) {
      tips.push("💧 High humidity levels. Use dehumidifiers and ensure good ventilation to prevent energy waste.");
    }
    
    if (weather.description.includes('sunny') || weather.description.includes('clear')) {
      tips.push("☀️ Sunny weather - maximize natural lighting and avoid artificial lights during day (saves 30-50%).");
    }
    
    if (weather.windSpeed > 15) {
      tips.push("💨 Good wind conditions - open windows for natural ventilation instead of electric fans.");
    }
    
    return tips.join('\n\n');
  }

  generateEnergyRecommendations(weather: WeatherData): EnergyRecommendation[] {
    const recommendations: EnergyRecommendation[] = [];

    // Temperature-based recommendations
    if (weather.temperature > 32) {
      recommendations.push({
        type: 'cooling',
        priority: 'high',
        title: 'High Temperature Alert',
        description: `At ${weather.temperature.toFixed(1)}°C, use AC efficiently. Set to 24-26°C and use ceiling fans to feel cooler.`,
        estimatedSavings: '15-25% on cooling costs',
        icon: '🌡️'
      });
    } else if (weather.temperature < 22) {
      recommendations.push({
        type: 'heating',
        priority: 'medium',
        title: 'Cool Weather Opportunity',
        description: `At ${weather.temperature.toFixed(1)}°C, turn off AC and open windows for natural cooling.`,
        estimatedSavings: '40-60% on cooling costs',
        icon: '🪟'
      });
    }

    // Humidity-based recommendations
    if (weather.humidity > 80) {
      recommendations.push({
        type: 'ventilation',
        priority: 'high',
        title: 'High Humidity Warning',
        description: `${weather.humidity.toFixed(0)}% humidity detected. Use dehumidifiers and ensure good ventilation to prevent mold.`,
        estimatedSavings: '10-15% on health costs',
        icon: '💨'
      });
    }

    // Light conditions recommendations
    if (weather.description.includes('sunny')) {
      recommendations.push({
        type: 'lighting',
        priority: 'medium',
        title: 'Bright Day - Save on Lighting',
        description: 'Sunny weather means natural lighting. Turn off unnecessary lights and use daylight.',
        estimatedSavings: '30-50% on lighting costs',
        icon: '☀️'
      });
    } else if (weather.description.includes('cloudy')) {
      recommendations.push({
        type: 'lighting',
        priority: 'low',
        title: 'Cloudy Day - Efficient Lighting',
        description: 'Cloudy conditions require some artificial lighting. Use LED bulbs and avoid overlighting.',
        estimatedSavings: '20-30% on lighting costs',
        icon: '☁️'
      });
    }

    // Wind speed recommendations
    if (weather.windSpeed > 15) {
      recommendations.push({
        type: 'ventilation',
        priority: 'medium',
        title: 'Windy Conditions - Natural Ventilation',
        description: `${weather.windSpeed.toFixed(0)} km/h winds. Open windows and turn off fans for natural air circulation.`,
        estimatedSavings: '25-40% on ventilation costs',
        icon: '💨'
      });
    }

    // UV Index recommendations
    if (weather.uvIndex > 8) {
      recommendations.push({
        type: 'general',
        priority: 'high',
        title: 'High UV Index - Protect Your Home',
        description: `UV Index ${weather.uvIndex.toFixed(0)}. Close curtains/blinds to reduce heat gain and protect furniture.`,
        estimatedSavings: '10-20% on cooling costs',
        icon: '🌞'
      });
    }

    // Seasonal recommendations for Goa
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) { // March to June (Summer)
      recommendations.push({
        type: 'cooling',
        priority: 'high',
        title: 'Summer Season Strategy',
        description: 'Peak summer in Goa. Pre-cool your home during off-peak hours (6 AM - 10 AM) when electricity is cheaper.',
        estimatedSavings: '20-30% on electricity bills',
        icon: '🏠'
      });
    } else if (month >= 5 && month <= 9) { // June to October (Monsoon)
      recommendations.push({
        type: 'general',
        priority: 'medium',
        title: 'Monsoon Energy Tips',
        description: 'Monsoon season: Use natural ventilation when possible, but watch humidity levels to prevent appliance damage.',
        estimatedSavings: '15-25% on cooling costs',
        icon: '🌧️'
      });
    }

    return recommendations;
  }

  // Get comprehensive weather-based energy insights
  async getEnergyInsights(city: string = 'Verna, Goa'): Promise<{
    weather: WeatherData;
    recommendations: EnergyRecommendation[];
    summary: string;
    aiTips: string;
  }> {
    const weather = await this.getCurrentWeather(city);
    const recommendations = this.generateEnergyRecommendations(weather);
    const aiTips = await this.generateAIEnergyTips(weather);
    
    const summary = this.generateWeatherSummary(weather, recommendations);
    
    return {
      weather,
      recommendations,
      summary,
      aiTips
    };
  }

  private generateWeatherSummary(weather: WeatherData, recommendations: EnergyRecommendation[]): string {
    const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
    const tempStatus = weather.temperature > 32 ? 'very hot' : weather.temperature > 28 ? 'hot' : weather.temperature > 24 ? 'warm' : 'cool';
    
    let summary = `Today's weather in ${weather.location} is ${tempStatus} at ${weather.temperature.toFixed(1)}°C with ${weather.description}. `;
    
    if (highPriorityCount > 0) {
      summary += `We found ${highPriorityCount} high-priority energy saving opportunities for you today. `;
    }
    
    if (weather.temperature > 30) {
      summary += `High temperatures mean increased cooling costs - follow our AC optimization tips to save energy. `;
    }
    
    if (weather.description.includes('sunny')) {
      summary += `Take advantage of natural lighting to reduce electricity usage. `;
    }
    
    return summary;
  }

  // Format weather data for display
  formatWeatherDisplay(weather: WeatherData): string {
    return `${weather.temperature.toFixed(1)}°C, ${weather.description}, ${weather.humidity.toFixed(0)}% humidity`;
  }
}

export const weatherService = new WeatherService();
export type { WeatherData, EnergyRecommendation };