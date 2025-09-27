import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Zap, Lightbulb, Calculator, Home } from 'lucide-react';

type ChatMessage = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
};

const SmartEnergyChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hi! I'm your Smart Energy Assistant 💡 I can help you with electricity usage, appliance efficiency, energy costs, and saving tips. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Using backend chat endpoint instead of direct API calls

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isEnergyRelatedQuery = (message: string): boolean => {
    const energyKeywords = [
      'energy', 'electricity', 'power', 'appliance', 'watt', 'kwh', 'consumption',
      'save', 'saving', 'cost', 'bill', 'efficient', 'usage', 'meter', 'smart',
      'led', 'bulb', 'heater', 'ac', 'air conditioner', 'refrigerator', 'tv',
      'washing machine', 'dishwasher', 'oven', 'microwave', 'fan', 'lights',
      'electronics', 'device', 'solar', 'renewable', 'grid', 'voltage',
      'ampere', 'circuit', 'switch', 'plug', 'outlet', 'home automation'
    ];
    
    const messageLower = message.toLowerCase();
    return energyKeywords.some(keyword => messageLower.includes(keyword));
  };

  // System prompt now handled by backend OpenRouter service
  
  const sendMessage = async (): Promise<void> => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Check if query is energy-related
      if (!isEnergyRelatedQuery(inputMessage)) {
        setTimeout(() => {
      const botResponse: ChatMessage = {
            id: Date.now() + 1,
            text: "I'm specifically designed to help with energy and electricity topics! I can assist you with appliance power consumption, energy-saving tips, electricity costs, and home energy efficiency. What energy-related question can I help you with? ⚡",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botResponse]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      const requestBody = {
        message: inputMessage + " (Please keep response under 100 words)"
      };

      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/energy/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI service');
      }

      const data = await response.json();
      
      const botResponseText = data.response || 
        "I'm sorry, I couldn't process your request. Please try asking about energy usage, appliance efficiency, or electricity costs.";

      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse: ChatMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment. In the meantime, remember that LED bulbs use 75% less energy than traditional incandescent bulbs! 💡",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions: { icon: React.ComponentType<{ size?: number | string; className?: string }>; text: string; query: string }[] = [
    { icon: Zap, text: "How much power does my AC use?", query: "How much electricity does an air conditioner consume per hour?" },
    { icon: Lightbulb, text: "LED vs regular bulbs", query: "What's the energy difference between LED and incandescent bulbs?" },
    { icon: Calculator, text: "Calculate my bill", query: "How do I calculate my electricity bill based on usage?" },
    { icon: Home, text: "Home energy tips", query: "Give me 5 practical tips to reduce electricity usage at home" }
  ];

  const handleQuickQuestion = (query: string) => {
    setInputMessage(query);
  };

  const LoadingAnimation = () => (
    <div className="flex space-x-1 p-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Zap size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Smart Energy Assistant</h3>
                <p className="text-xs opacity-90">Energy · Efficiency · Savings</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <LoadingAnimation />
                </div>
              </div>
            )}

            {/* Quick Questions (only show when no loading and few messages) */}
            {!isLoading && messages.length <= 3 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500 text-center">Quick questions to get started:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(q.query)}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-xs flex items-center space-x-1"
                    >
                      <q.icon size={12} className="text-green-600" />
                      <span>{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about energy usage, appliances, costs..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="relative">
            <MessageCircle size={24} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default SmartEnergyChatbot;