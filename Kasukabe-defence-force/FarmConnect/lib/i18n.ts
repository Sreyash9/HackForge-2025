export type Language = "en" | "hi"

export interface Translations {
  // Navigation
  dashboard: string
  weather: string
  market: string
  chat: string
  buyers: string
  calculator: string
  aiAssistant: string
  cluster: string
  logistics: string
  rewards: string
  account: string
  notifications: string

  // Common
  login: string
  signup: string
  logout: string
  save: string
  cancel: string
  submit: string
  search: string
  filter: string
  loading: string
  error: string
  success: string

  // Home page
  appName: string
  tagline: string
  description: string
  getStarted: string
  marketPrices: string
  findBuyers: string
  costCalculator: string
  // Home feature descriptions
  featureMarketDesc: string
  featureBuyersDesc: string
  featureCalculatorDesc: string
  featureAIDesc: string

  // AI Assistant page
  aiSubtitle: string
  aiWelcome: string
  aiInputPlaceholder: string
  aiQuickCrop: string
  aiQuickPest: string
  aiQuickWeather: string
  aiQuickMarket: string

  // Chat page
  messagesTitle: string
  messagesSubtitle: string
  searchConversationsPlaceholder: string
  noConversations: string
  clearSearch: string

  // Auth
  phoneNumber: string
  password: string
  confirmPassword: string
  forgotPassword: string
  createAccount: string
  alreadyHaveAccount: string
  dontHaveAccount: string

  // Voice Assistant
  voiceAssistant: string
  startListening: string
  stopListening: string
  listening: string
  processing: string
  speakYourQuestion: string
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    weather: "Weather",
    market: "Market",
    chat: "Chat",
    buyers: "Buyers",
    calculator: "Calculator",
    aiAssistant: "AI Assistant",
    cluster: "Farmer Cluster",
    logistics: "Logistics",
    rewards: "Rewards",
    account: "My Account",
    notifications: "Notifications",

    // Common
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    loading: "Loading...",
    error: "Error",
    success: "Success",

    // Home page
    appName: "FarmConnect",
    tagline: "Connect Farmers with Markets",
    description: "Get real-time market prices, connect with buyers, and manage your agricultural business efficiently.",
    getStarted: "Get Started Free",
    marketPrices: "Market Prices",
    findBuyers: "Find Buyers",
    costCalculator: "Cost Calculator",
    // Home feature descriptions
    featureMarketDesc: "Real-time pricing from nearby markets",
    featureBuyersDesc: "Connect with verified buyers",
    featureCalculatorDesc: "Transport & logistics planning",
    featureAIDesc: "Smart farming recommendations",

    // AI Assistant page
    aiSubtitle: "Smart farming guidance",
    aiWelcome:
      "Hello! I'm your AI farming assistant. I can help you with crop recommendations, pest management, weather insights, and market analysis. What would you like to know?",
    aiInputPlaceholder: "Ask me anything about farming...",
    aiQuickCrop: "Crop Recommendations",
    aiQuickPest: "Pest Control",
    aiQuickWeather: "Weather Insights",
    aiQuickMarket: "Market Analysis",

    // Chat page
    messagesTitle: "Messages",
    messagesSubtitle: "Connect with buyers and farmers",
    searchConversationsPlaceholder: "Search conversations...",
    noConversations: "No conversations found",
    clearSearch: "Clear Search",

    // Auth
    phoneNumber: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",

    // Voice Assistant
    voiceAssistant: "Voice Assistant",
    startListening: "Start Listening",
    stopListening: "Stop Listening",
    listening: "Listening...",
    processing: "Processing...",
    speakYourQuestion: "Speak your question about farming, weather, or markets",
  },
  hi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    weather: "मौसम",
    market: "बाज़ार",
    chat: "चैट",
    buyers: "खरीदार",
    calculator: "कैलकुलेटर",
    aiAssistant: "AI सहायक",
    cluster: "किसान समूह",
    logistics: "रसद",
    rewards: "पुरस्कार",
    account: "मेरा खाता",
    notifications: "सूचनाएं",

    // Common
    login: "लॉगिन",
    signup: "साइन अप",
    logout: "लॉगआउट",
    save: "सेव करें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    search: "खोजें",
    filter: "फिल्टर",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",

    // Home page
    appName: "फार्मकनेक्ट",
    tagline: "किसानों को बाज़ारों से जोड़ें",
    description: "रियल-टाइम बाज़ार की कीमतें पाएं, खरीदारों से जुड़ें, और अपने कृषि व्यवसाय को कुशलता से प्रबंधित करें।",
    getStarted: "मुफ्त में शुरू करें",
    marketPrices: "बाज़ार की कीमतें",
    findBuyers: "खरीदार खोजें",
    costCalculator: "लागत कैलकुलेटर",
    // Home feature descriptions
    featureMarketDesc: "नज़दीकी मंडियों की रियल-टाइम कीमतें",
    featureBuyersDesc: "प्रमाणित खरीदारों से जुड़ें",
    featureCalculatorDesc: "परिवहन और लॉजिस्टिक्स योजना",
    featureAIDesc: "स्मार्ट खेती सुझाव",

    // AI Assistant page
    aiSubtitle: "स्मार्ट खेती मार्गदर्शन",
    aiWelcome:
      "नमस्ते! मैं आपका AI खेती सहायक हूँ। मैं फसल सुझाव, कीट प्रबंधन, मौसम जानकारी और बाज़ार विश्लेषण में आपकी मदद कर सकता हूँ। आप क्या जानना चाहते हैं?",
    aiInputPlaceholder: "खेती के बारे में कुछ भी पूछें...",
    aiQuickCrop: "फसल सुझाव",
    aiQuickPest: "कीट नियंत्रण",
    aiQuickWeather: "मौसम जानकारी",
    aiQuickMarket: "बाज़ार विश्लेषण",

    // Chat page
    messagesTitle: "संदेश",
    messagesSubtitle: "खरीदारों और किसानों से जुड़ें",
    searchConversationsPlaceholder: "बातचीत खोजें...",
    noConversations: "कोई बातचीत नहीं मिली",
    clearSearch: "खोज साफ़ करें",

    // Auth
    phoneNumber: "फोन नंबर",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    forgotPassword: "पासवर्ड भूल गए?",
    createAccount: "खाता बनाएं",
    alreadyHaveAccount: "पहले से खाता है?",
    dontHaveAccount: "खाता नहीं है?",

    // Voice Assistant
    voiceAssistant: "आवाज़ सहायक",
    startListening: "सुनना शुरू करें",
    stopListening: "सुनना बंद करें",
    listening: "सुन रहा है...",
    processing: "प्रोसेसिंग...",
    speakYourQuestion: "खेती, मौसम या बाज़ार के बारे में अपना सवाल बोलें",
  },
}

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.en
}

export function getCurrentLanguage(): Language {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("farmconnect-language")
    if (stored && (stored === "en" || stored === "hi")) {
      return stored as Language
    }
    // Auto-detect based on browser language
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith("hi")) return "hi"
  }
  return "en"
}

export function setLanguage(language: Language) {
  if (typeof window !== "undefined") {
    localStorage.setItem("farmconnect-language", language)
    // Notify listeners without forcing a full reload
    try {
      window.dispatchEvent(new Event("fc-language-change"))
      // Also emit a synthetic storage event for components relying on it
      window.dispatchEvent(new StorageEvent("storage", { key: "farmconnect-language", newValue: language }))
    } catch {
      // no-op: some environments may restrict constructing StorageEvent
    }
  }
}
