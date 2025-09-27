import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  let requestBody: any
  try {
    requestBody = await req.json().catch(() => ({}))
    const { prompt } = requestBody
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'prompt required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json({ 
        text: "I'm sorry, but the AI service is not properly configured. Please check the API key configuration.",
        error: "API_KEY_MISSING"
      })
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Create context for HarvestHub AI assistant
    const systemPrompt = `You are HarvestHub AI, an intelligent farming assistant helping Indian farmers with:
- Crop recommendations and farming techniques
- Market prices and selling strategies  
- Weather insights and irrigation advice
- Pest management and disease control
- Agricultural best practices
- Connecting with buyers and logistics

Respond in a helpful, practical way. Use simple Hindi when appropriate, especially for farming terms. Keep responses concise and actionable.

User question: ${prompt}`
    
    const result = await model.generateContent(systemPrompt)
    const response = await result.response
    const text = response.text()
    
    return Response.json({ text })
  } catch (error) {
    console.error('AI API error:', error)
    
    // Provide intelligent fallback responses based on the question
    const prompt = requestBody?.prompt || ''
    const lowerPrompt = prompt.toLowerCase()
    
    let fallbackResponse = 'I apologize, but I encountered an error connecting to the AI service. Here\'s some general guidance:'
    
    if (lowerPrompt.includes('crop') || lowerPrompt.includes('plant') || lowerPrompt.includes('farming')) {
      fallbackResponse = 'Based on general farming knowledge: Consider seasonal crops like tomatoes, potatoes, and onions. Check local market prices and soil conditions. For specific guidance, consult your local agricultural extension office.'
    } else if (lowerPrompt.includes('pest') || lowerPrompt.includes('disease') || lowerPrompt.includes('insect')) {
      fallbackResponse = 'For pest management: Use organic neem oil spray for common pests. Practice crop rotation and maintain field hygiene. Consult local agricultural experts for specific pest identification and treatment.'
    } else if (lowerPrompt.includes('weather') || lowerPrompt.includes('rain') || lowerPrompt.includes('irrigation')) {
      fallbackResponse = 'Weather and irrigation tips: Monitor local weather forecasts. Water crops during early morning or evening. Ensure proper drainage to prevent waterlogging. Adjust irrigation based on soil moisture.'
    } else if (lowerPrompt.includes('market') || lowerPrompt.includes('price') || lowerPrompt.includes('sell')) {
      fallbackResponse = 'Market guidance: Check local mandi prices regularly. Consider direct-to-consumer sales for better margins. Build relationships with reliable buyers. Store crops properly to maintain quality.'
    }
    
    return Response.json({ 
      text: fallbackResponse + ' (Note: AI service temporarily unavailable - please get a Google AI Studio API key for full functionality)',
      error: "API_ERROR"
    })
  }
}


