import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../../types';
import { wasteCategories } from '../../data/mockData';

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! I\'m your AI recycling assistant. I can help you find the best recyclers based on your waste types. What would you like to recycle today?',
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for waste types
    const mentionedCategories = wasteCategories.filter(cat => 
      lowerMessage.includes(cat.name.toLowerCase())
    );

    if (mentionedCategories.length > 0) {
      const category = mentionedCategories[0];
      const recyclers = category.recyclers.slice(0, 2);
      
      return `Great! For ${category.name.toLowerCase()}, I recommend these top recyclers near you:\n\n${recyclers.map(r => 
        `🏢 **${r.name}**\n📍 ${r.address}\n⭐ ${r.rating}/5 stars\n📞 ${r.phone}\n🚗 ${r.distance} km away${r.verified ? ' ✅' : ''}`
      ).join('\n\n')}\n\nWould you like directions to any of these locations or information about other waste types?`;
    }

    // General responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hi there! I\'m here to help you find the perfect recycling solution. You can tell me about any waste items like plastic bottles, paper, electronics, or glass containers.';
    }

    if (lowerMessage.includes('help')) {
      return 'I can help you with:\n• Finding recyclers for specific waste types\n• Getting contact information and directions\n• Learning about recycling processes\n• Discovering community programs\n\nJust describe what you want to recycle!';
    }

    if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Every small action makes a big difference for our environment. Is there anything else I can help you recycle today?';
    }

    return 'I understand you\'re looking for recycling options. Could you please specify what type of waste you\'d like to recycle? For example: plastic bottles, paper, electronics, glass, or metal items.';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Recycling Assistant</h3>
            <p className="text-sm text-gray-500">Get personalized recycler recommendations</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {message.sender === 'user' ? 
                  <User className="w-4 h-4 text-blue-600" /> : 
                  <Bot className="w-4 h-4 text-green-600" />
                }
              </div>
              <div className={`p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-green-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about recycling options..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Ask about plastic, paper, electronics, glass, or metal recycling
        </p>
      </div>
    </div>
  );
}