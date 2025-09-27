"""
OpenRouter API integration for AI chat functionality
"""
import os
import requests
import json
from typing import Dict, Any, Optional

class OpenRouterService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "WattWise Energy Assistant"
        }
    
    def generate_chat_response(self, user_message: str, context: Dict[str, Any] = None) -> str:
        """
        Generate chat response using OpenRouter API
        """
        try:
            # Build system prompt for energy assistant
            system_prompt = """You are WattWise Energy Assistant, an AI helper specialized in energy management and conservation. 
            
Your expertise includes:
- Providing energy-saving tips and recommendations
- Helping users understand their electricity consumption
- Suggesting ways to optimize appliance usage
- Answering questions about energy efficiency
- Providing cost-saving strategies for electricity bills
- Explaining energy concepts in simple terms

Be helpful, concise, and focus on practical energy advice. Use emojis sparingly to make responses friendly but professional."""

            # Add context if provided
            if context:
                system_prompt += f"\n\nUser Context: {json.dumps(context, indent=2)}"

            # Prepare the request payload
            payload = {
                "model": "google/gemma-2-9b-it:free",  # Using free model
                "messages": [
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user", 
                        "content": user_message
                    }
                ],
                "max_tokens": 500,
                "temperature": 0.7,
                "top_p": 0.9,
                "stream": False
            }

            # Make API request
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                print(f"OpenRouter API Error: {response.status_code} - {response.text}")
                return self._get_fallback_response(user_message)

        except Exception as e:
            print(f"OpenRouter API Exception: {str(e)}")
            return self._get_fallback_response(user_message)

    def analyze_appliance_image(self, image_data: bytes, filename: str) -> Dict[str, Any]:
        """
        Analyze appliance image using OpenRouter Vision model
        Note: This requires a vision-capable model which may not be available in free tier
        """
        try:
            # For now, return intelligent fallback since vision models require paid access
            return self._get_appliance_fallback(filename)
            
        except Exception as e:
            print(f"OpenRouter Vision API Exception: {str(e)}")
            return self._get_appliance_fallback(filename)

    def _get_fallback_response(self, user_message: str) -> str:
        """
        Provide intelligent fallback responses when API is unavailable
        """
        user_message_lower = user_message.lower()
        
        if any(word in user_message_lower for word in ["save", "reduce", "lower", "cut"]):
            return """💡 Here are some proven energy-saving tips:

1. **Optimize AC usage**: Set temperature to 24-26°C, use timer functions
2. **LED lighting**: Replace old bulbs with LED lights (70% less energy)
3. **Unplug devices**: Avoid standby power consumption
4. **Smart scheduling**: Use appliances during off-peak hours
5. **Regular maintenance**: Clean AC filters, service appliances regularly

Small changes can lead to 20-30% savings on your electricity bill! 💰"""

        elif any(word in user_message_lower for word in ["cost", "bill", "expensive", "money"]):
            return """💰 To reduce your electricity costs:

**Immediate actions:**
- Switch to energy-efficient appliances (5-star rating)
- Use ceiling fans with AC to feel cooler at higher temperatures
- Optimize refrigerator settings (ideal: 2-3°C for fridge, -18°C for freezer)

**Long-term strategies:**
- Consider solar panels if feasible
- Invest in smart power strips
- Track your usage patterns to identify high-consumption periods

**Pro tip:** The biggest savings come from managing your top 3 energy-consuming appliances! 📊"""

        elif any(word in user_message_lower for word in ["appliance", "device", "machine"]):
            return """🔌 Smart appliance usage tips:

**High-consumption appliances:**
- **Air Conditioner**: Use timer, maintain 24-26°C, clean filters monthly
- **Water Heater**: Set to 50-60°C, use timer for heating cycles  
- **Refrigerator**: Keep 70% full, avoid frequent door opening
- **Washing Machine**: Use cold water wash, full loads only

**Energy-efficient practices:**
- Unplug chargers when not in use
- Use natural light during daytime
- Choose appliances with 5-star energy rating

Need specific advice for any appliance? Just ask! ⚡"""

        else:
            return """🌱 Welcome to WattWise Energy Assistant! 

I'm here to help you:
- Reduce your electricity bills 💰
- Optimize appliance usage ⚡
- Understand energy consumption patterns 📊
- Find eco-friendly solutions 🌍

**Quick wins for energy savings:**
1. Use LED bulbs (save 70% on lighting costs)
2. Set AC to 25°C instead of 18°C (save 20-30%)
3. Unplug devices when not in use
4. Use natural light during day

What specific energy topic would you like help with? Feel free to ask about any appliance or energy-saving strategy! 💡"""

    def _get_appliance_fallback(self, filename: str) -> Dict[str, Any]:
        """
        Provide intelligent appliance detection fallback
        """
        filename_lower = filename.lower()
        
        # Basic appliance detection based on filename
        if any(word in filename_lower for word in ["ac", "air", "condition"]):
            return {
                "appliance_type": "Air Conditioner",
                "estimated_wattage": 1500,
                "category": "cooling",
                "confidence": 0.7,
                "suggestions": [
                    "Set temperature to 24-26°C for optimal efficiency",
                    "Use timer function to avoid overnight usage",
                    "Clean filters monthly for better performance",
                    "Use ceiling fans to feel cooler at higher temperatures"
                ],
                "note": "🤖 Intelligent detection - OpenRouter API fallback"
            }
        elif any(word in filename_lower for word in ["fridge", "refrigerator"]):
            return {
                "appliance_type": "Refrigerator", 
                "estimated_wattage": 150,
                "category": "kitchen",
                "confidence": 0.8,
                "suggestions": [
                    "Set temperature to 2-3°C for fridge, -18°C for freezer",
                    "Keep refrigerator 70% full for efficiency",
                    "Avoid frequent door opening",
                    "Clean coils every 6 months"
                ],
                "note": "🤖 Intelligent detection - OpenRouter API fallback"
            }
        elif any(word in filename_lower for word in ["tv", "television"]):
            return {
                "appliance_type": "Television",
                "estimated_wattage": 100,
                "category": "entertainment", 
                "confidence": 0.6,
                "suggestions": [
                    "Use power-saving mode when available",
                    "Adjust brightness to comfortable levels",
                    "Turn off when not actively watching",
                    "Consider LED/OLED models for better efficiency"
                ],
                "note": "🤖 Intelligent detection - OpenRouter API fallback"
            }
        else:
            return {
                "appliance_type": "Unknown Appliance",
                "estimated_wattage": 500,
                "category": "general",
                "confidence": 0.3,
                "suggestions": [
                    "Check appliance nameplate for accurate wattage",
                    "Look for Energy Star or 5-star ratings",
                    "Use power meters to measure actual consumption",
                    "Consider upgrading to energy-efficient models"
                ],
                "note": "🤖 Unable to identify appliance - please provide more details"
            }

# Global instance
openrouter_service = OpenRouterService()