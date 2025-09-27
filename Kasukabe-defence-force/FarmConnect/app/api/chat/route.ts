import { NextRequest } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 30

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  let requestBody: any
  try {
    requestBody = await req.json()
    const { message } = requestBody
    if (!message) return new Response("Missing message", { status: 400 })
    
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ 
        text: "I'm sorry, but the AI service is not properly configured. Please check the API key configuration.",
        error: "API_KEY_MISSING"
      })
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a farming/agriculture context for the AI
    const prompt = `You are an AI assistant for HarvestHub, a platform that connects farmers with buyers. 
You help with farming advice, market information, weather insights, and agricultural best practices.
User message: ${message}

Respond helpfully and concisely:`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return Response.json({ text })
  } catch (error) {
    console.error("Chat API error:", error)
    // Fallback to error response if API fails
    const message = requestBody?.message || "your question"
    return Response.json({ 
      text: `I apologize, but I encountered an error processing your request. Please try again later.`,
      error: "API_ERROR"
    }, { status: 500 })
  }
}
