import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  english: {
    // Navigation
    dashboard: "Dashboard",
    addRoom: "Add Room",
    logUsage: "Log Usage",
    setGoals: "Set Goals",
    profile: "Profile",
    logout: "Logout",
    info: "Info",
    
    // AddRoom page
    roomApplianceManagement: "Room & Appliance Management",
    addRoomsAppliancesTracking: "Add your rooms and appliances to start tracking energy consumption with Goa tariff rates",
    manualEntry: "Manual Entry",
    enterApplianceDetailsManually: "Enter appliance details manually when you know the specifications",
    aiLabelScanning: "AI Label Scanning",
    uploadPhotoEnergyLabel: "Upload a photo of the energy label for automatic detection (powered by Gemini AI)",
    addNewRoom: "Add New Room",
    yourSavedRooms: "Your Saved Rooms",
    newRooms: "New Rooms",
    
    // LogUsage page
    dailyUsageLogger: "Daily Usage Logger",
    clickApplianceLogUsage: "Click on any appliance to log daily usage and get instant bill calculations",
    refresh: "Refresh",
    
    // Dashboard
    welcomeToWattWise: "Welcome to WattWise",
    smartEnergyPlatform: "Your smart energy management platform is ready to help you save energy and reduce costs.",
    quickActions: "Quick Actions",
    accessFeatures: "Access frequently used features quickly",
    weeklyUsage: "Weekly Usage",
    weeklyUsageDesc: "Your energy consumption over the past 7 days",
    monthlySavings: "Monthly Savings",
    trackEnergyCostSavings: "Track your energy cost savings",
    topAppliances: "Top Energy Consuming Appliances",
    topAppliancesDesc: "Devices using the most energy",
    noDataAvailable: "No usage data available",
    addBillPrompt: "Please add your previous month's electricity bill to track your savings accurately!",
    addBillAmount: "Add Bill Amount",
    loading: "Loading...",
    room: "Room",
    cost: "Cost",
    usage: "Usage",
    previousMonth: "Previous Month",
    currentMonth: "Current Month",
    reduction: "reduction",
    addPreviousBillCalculate: "Add previous month bill to calculate",
    noApplianceData: "No appliance usage data available",
    startLoggingAppliances: "Start logging your appliance usage to see insights!",
    notCalculated: "Not calculated",
    previousMonthBill: "Previous Month Bill",
    currentAmount: "Current Amount",
    updateBillAmount: "Update Bill Amount",
    addPreviousBillCalculateAccurate: "Add your previous month's bill to calculate accurate savings!",
    enterPreviousBillAmount: "Enter previous month's bill amount (₹)",
    saving: "Saving...",
    updateAmount: "Update Amount",
    saveBillAmount: "Save Bill Amount",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    edit: "Edit",
    delete: "Delete",
    settings: "Settings",
    listView: "List",
    chartView: "Chart",
    
    // Quiz
    dailyQuiz: "Daily Quiz",
    startDailyQuiz: "Start Daily Quiz",
    questionOf: "Question {current} of {total}",
    nextQuestion: "Next Question",
    completeQuiz: "Complete Quiz",
    quizComplete: "Quiz Complete!",
    youScored: "You scored {score} out of {total}",
    backToGoals: "Back to Goals",
    
    // Profile
    userProfile: "User Profile",
    roomsAdded: "Rooms Added",
    appliances: "Appliances",
    quizScore: "Quiz Score",
    quizStreak: "Quiz Streak",
    accountStatus: "Account Status",
    memberSince: "Member Since",
    active: "Active",
    inactive: "Inactive",
    
    // Leaderboard
    leaderboard: "Leaderboard",
    appliancesTracked: "appliances tracked",
    saved: "saved",
    streak: "streak",
    
    // Days
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun"
  },
  
  hindi: {
    // Navigation
    dashboard: "डैशबोर्ड",
    addRoom: "कमरा जोड़ें",
    logUsage: "उपयोग लॉग करें",
    setGoals: "लक्ष्य निर्धारित करें",
    profile: "प्रोफ़ाइल",
    logout: "लॉग आउट",
    info: "जानकारी",
    
    // AddRoom page
    roomApplianceManagement: "कमरा और उपकरण प्रबंधन",
    addRoomsAppliancesTracking: "गोवा टैरिफ दरों के साथ ऊर्जा खपत को ट्रैक करने के लिए अपने कमरे और उपकरण जोड़ें",
    manualEntry: "मैन्युअल एंट्री",
    enterApplianceDetailsManually: "जब आप विनिर्देश जानते हों तो उपकरण विवरण मैन्युअल रूप से दर्ज करें",
    aiLabelScanning: "एआई लेबल स्कैनिंग",
    uploadPhotoEnergyLabel: "स्वचालित पहचान के लिए ऊर्जा लेबल की फोटो अपलोड करें (जेमिनी एआई द्वारा संचालित)",
    addNewRoom: "नया कमरा जोड़ें",
    yourSavedRooms: "आपके सहेजे गए कमरे",
    newRooms: "नए कमरे",
    
    // LogUsage page
    dailyUsageLogger: "दैनिक उपयोग लॉगर",
    clickApplianceLogUsage: "दैनिक उपयोग लॉग करने और तत्काल बिल गणना प्राप्त करने के लिए किसी भी उपकरण पर क्लिक करें",
    refresh: "रीफ्रेश",
    
    // Dashboard
    welcomeToWattwise: "WattWise में आपका स्वागत है",
    smartEnergyManagement: "आपका स्मार्ट ऊर्जा प्रबंधन प्लेटफॉर्म आपकी ऊर्जा बचत और लागत कम करने में मदद के लिए तैयार है।",
    quickActions: "त्वरित कार्य",
    accessFrequentlyUsed: "अक्सर उपयोग की जाने वाली सुविधाओं तक त्वरित पहुंच",
    weeklyUsage: "साप्ताहिक उपयोग",
    energyConsumptionPast7Days: "पिछले 7 दिनों में आपकी ऊर्जा खपत",
    monthlySavings: "मासिक बचत",
    trackEnergyCostSavings: "अपनी ऊर्जा लागत बचत को ट्रैक करें",
    topEnergyConsumers: "शीर्ष ऊर्जा उपभोक्ता",
    appliancesUsingMostEnergy: "इस महीने सबसे अधिक ऊर्जा का उपयोग करने वाले उपकरण",
    
    // Common
    save: "सहेजें",
    cancel: "रद्द करें",
    close: "बंद करें",
    back: "वापस",
    next: "अगला",
    previous: "पिछला",
    submit: "जमा करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    settings: "सेटिंग्स",
    listView: "सूची",
    chartView: "चार्ट",
    
    // Quiz
    dailyQuiz: "दैनिक प्रश्नोत्तरी",
    startDailyQuiz: "दैनिक प्रश्नोत्तरी शुरू करें",
    questionOf: "प्रश्न {current} का {total}",
    nextQuestion: "अगला प्रश्न",
    completeQuiz: "प्रश्नोत्तरी पूर्ण करें",
    quizComplete: "प्रश्नोत्तरी पूर्ण!",
    youScored: "आपका स्कोर {score} में से {total}",
    backToGoals: "लक्ष्य पर वापस जाएं",
    
    // Profile
    userProfile: "उपयोगकर्ता प्रोफ़ाइल",
    roomsAdded: "कमरे जोड़े गए",
    appliances: "उपकरण",
    quizScore: "प्रश्नोत्तरी स्कोर",
    quizStreak: "प्रश्नोत्तरी स्ट्रीक",
    accountStatus: "खाता स्थिति",
    memberSince: "सदस्यता से",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    
    // Leaderboard
    leaderboard: "लीडरबोर्ड",
    appliancesTracked: "उपकरण ट्रैक किए गए",
    saved: "बचत",
    streak: "स्ट्रीक",
    
    // Days
    monday: "सोम",
    tuesday: "मंगल",
    wednesday: "बुध",
    thursday: "गुरु",
    friday: "शुक्र",
    saturday: "शनि",
    sunday: "रवि"
  },
  
  marathi: {
    // Navigation
    dashboard: "डॅशबोर्ड",
    addRoom: "खोली जोडा",
    logUsage: "वापर नोंदवा",
    setGoals: "ध्येय ठरवा",
    profile: "प्रोफाइल",
    logout: "लॉग आउट",
    info: "माहिती",
    
    // AddRoom page
    roomApplianceManagement: "खोली आणि उपकरणे व्यवस्थापन",
    addRoomsAppliancesTracking: "गोवा दर संरचनेसह ऊर्जा वापर ट्रॅक करण्यासाठी आपल्या खोल्या आणि उपकरणे जोडा",
    manualEntry: "मॅन्युअल एंट्री",
    enterApplianceDetailsManually: "जेव्हा आपल्याला तपशील माहित असतील तेव्हा उपकरणे तपशील मॅन्युअली प्रविष्ट करा",
    aiLabelScanning: "एआय लेबल स्कॅनिंग",
    uploadPhotoEnergyLabel: "स्वयंचलित ओळखीसाठी ऊर्जा लेबलचा फोटो अपलोड करा (जेमिनी एआय द्वारे चालविले)",
    addNewRoom: "नवीन खोली जोडा",
    yourSavedRooms: "आपल्या जतन केलेल्या खोल्या",
    newRooms: "नवीन खोल्या",
    
    // LogUsage page
    dailyUsageLogger: "दैनिक वापर लॉगर",
    clickApplianceLogUsage: "दैनिक वापर लॉग करण्यासाठी आणि तत्काल बिल गणना मिळवण्यासाठी कोणत्याही उपकरणावर क्लिक करा",
    refresh: "रीफ्रेश",
    
    // Dashboard
    welcomeToWattwise: "WattWise मध्ये आपले स्वागत आहे",
    smartEnergyManagement: "आपले स्मार्ट ऊर्जा व्यवस्थापन प्लॅटफॉर्म आपली ऊर्जा वाचवण्यासाठी आणि खर्च कमी करण्यासाठी तयार आहे।",
    quickActions: "द्रुत क्रिया",
    accessFrequentlyUsed: "वारंवार वापरल्या जाणाऱ्या वैशिष्ट्यांचा द्रुत प्रवेश",
    weeklyUsage: "साप्ताहिक वापर",
    energyConsumptionPast7Days: "गेल्या 7 दिवसांतील आपला ऊर्जा वापर",
    monthlySavings: "मासिक बचत",
    trackEnergyCostSavings: "आपली ऊर्जा खर्च बचत ट्रॅक करा",
    topEnergyConsumers: "शीर्ष ऊर्जा ग्राहक",
    appliancesUsingMostEnergy: "या महिन्यात सर्वाधिक ऊर्जा वापरणारी उपकरणे",
    
    // Common
    save: "जतन करा",
    cancel: "रद्द करा",
    close: "बंद करा",
    back: "परत",
    next: "पुढे",
    previous: "मागे",
    submit: "सबमिट करा",
    edit: "संपादित करा",
    delete: "हटवा",
    settings: "सेटिंग्स",
    listView: "यादी",
    chartView: "चार्ट",
    
    // Quiz
    dailyQuiz: "दैनिक प्रश्नमंजुषा",
    startDailyQuiz: "दैनिक प्रश्नमंजुषा सुरू करा",
    questionOf: "प्रश्न {current} चा {total}",
    nextQuestion: "पुढील प्रश्न",
    completeQuiz: "प्रश्नमंजुषा पूर्ण करा",
    quizComplete: "प्रश्नमंजुषा पूर्ण!",
    youScored: "आपला स्कोअर {score} पैकी {total}",
    backToGoals: "ध्येयांकडे परत जा",
    
    // Profile
    userProfile: "वापरकर्ता प्रोफाइल",
    roomsAdded: "खोल्या जोडल्या",
    appliances: "उपकरणे",
    quizScore: "प्रश्नमंजुषा स्कोअर",
    quizStreak: "प्रश्नमंजुषा स्ट्रीक",
    accountStatus: "खाते स्थिती",
    memberSince: "सदस्यत्व पासून",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    
    // Leaderboard
    leaderboard: "लीडरबोर्ड",
    appliancesTracked: "उपकरणे ट्रॅक केली",
    saved: "बचत",
    streak: "स्ट्रीक",
    
    // Days
    monday: "सोम",
    tuesday: "मंगळ",
    wednesday: "बुध",
    thursday: "गुरु",
    friday: "शुक्र",
    saturday: "शनि",
    sunday: "रवि"
  },
  
  konkani: {
    // Navigation
    dashboard: "डॅशबोर्ड",
    addRoom: "कुडो घाल",
    logUsage: "वापर नोंदय",
    setGoals: "उद्देश ठरावप",
    profile: "प्रोफाइल",
    logout: "लॉग आउट",
    info: "माहिती",
    
    // AddRoom page
    roomApplianceManagement: "कुडो आनी उपकरणां व्यवस्थापन",
    addRoomsAppliancesTracking: "गोवा दर संरचनेवांगडा ऊर्जा वापर ट्रॅक करपाक तुमच्यो कुडयो आनी उपकरणां घालात",
    manualEntry: "हाताक्या एंट्री",
    enterApplianceDetailsManually: "जेन्ना तुका तपशील कळटात तेन्ना उपकरणां तपशील हाताक्यान भरप",
    aiLabelScanning: "एआई लेबल स्कॅनिंग",
    uploadPhotoEnergyLabel: "स्वयंचालित ओळखपाक ऊर्जा लेबलाचो फोटो अपलोड करप (जेमिनी एआईन चालयतान)",
    addNewRoom: "नवो कुडो घाल",
    yourSavedRooms: "तुमच्यो सांबाळिल्यो कुडयो",
    newRooms: "नव्यो कुडयो",
    
    // LogUsage page
    dailyUsageLogger: "दैनिक वापर लॉगर",
    clickApplianceLogUsage: "दैनिक वापर लॉग करपाक आनी तत्काळ बिल गणना मेळोवपाक कसल्याय उपकरणाचेर क्लिक करप",
    refresh: "रीफ्रेश",
    
    // Dashboard
    welcomeToWattwise: "WattWise मदें तुका येवकार",
    smartEnergyManagement: "तुमचो स्मार्ट ऊर्जा व्यवस्थापन प्लॅटफॉर्म तुमची ऊर्जा वाचवचे खातीर आनी खर्च उणो करचे खातीर तयार आसा।",
    quickActions: "खर्गोसाणे करप",
    accessFrequentlyUsed: "वारंवार वापरल्या वैशिष्ट्यांचो खर्गोसाणे प्रवेश",
    weeklyUsage: "आठवडेभराचो वापर",
    energyConsumptionPast7Days: "फाटल्या 7 दिसांतलो तुमचो ऊर्जा वापर",
    monthlySavings: "म्हयन्याची बचत",
    trackEnergyCostSavings: "तुमची ऊर्जा खर्च बचत ट्रॅक करात",
    topEnergyConsumers: "व्हड ऊर्जा वापरपी",
    appliancesUsingMostEnergy: "हे म्हयन्यांत चड ऊर्जा वापरपी उपकरणां",
    
    // Common
    save: "सांबाळ",
    cancel: "रद्द कर",
    close: "बंद कर",
    back: "परत",
    next: "फुडें",
    previous: "आदलें",
    submit: "दि",
    edit: "संपादन कर",
    delete: "काडून उडोवप",
    settings: "सेटिंग्स",
    listView: "वळेरी",
    chartView: "चार्ट",
    
    // Quiz
    dailyQuiz: "दैनिक प्रश्नावली",
    startDailyQuiz: "दैनिक प्रश्नावली सुरू कर",
    questionOf: "प्रश्न {current} चो {total}",
    nextQuestion: "फुडलो प्रश्न",
    completeQuiz: "प्रश्नावली पूर्ण कर",
    quizComplete: "प्रश्नावली पूर्ण!",
    youScored: "तुमचो स्कोअर {score} चो {total}",
    backToGoals: "उद्देशांक परत वच",
    
    // Profile
    userProfile: "वापरपी प्रोफाइल",
    roomsAdded: "कुडो घातल्यो",
    appliances: "उपकरणां",
    quizScore: "प्रश्नावली स्कोअर",
    quizStreak: "प्रश्नावली स्ट्रीक",
    accountStatus: "खातो स्थिती",
    memberSince: "सदस्यत्व पासून",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    
    // Leaderboard
    leaderboard: "लीडरबोर्ड",
    appliancesTracked: "उपकरणां ट्रॅक केलीं",
    saved: "बचत",
    streak: "स्ट्रीक",
    
    // Days
    monday: "सोमार",
    tuesday: "मंगळार",
    wednesday: "बुधवार",
    thursday: "गुरुवार",
    friday: "शुक्रवार",
    saturday: "शनिवार",
    sunday: "आयतार"
  }
};

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('english');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('userLanguage') || 'english';
    setLanguageState(storedLanguage);
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('userLanguage', lang);
  };

  const t = (key: string, replacements?: Record<string, string | number>) => {
    const langTranslations = translations[language as keyof typeof translations] || translations.english;
    let translation = langTranslations[key as keyof typeof langTranslations] || key;
    
    // Handle replacements like {current} and {total}
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        translation = translation.replace(`{${placeholder}}`, String(value));
      });
    }
    
    return translation;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    // Fallback for components outside provider
    const getStoredLanguage = () => {
      return localStorage.getItem('userLanguage') || 'english';
    };

    const t = (key: string, replacements?: Record<string, string | number>) => {
      const currentLanguage = getStoredLanguage();
      const langTranslations = translations[currentLanguage as keyof typeof translations] || translations.english;
      let translation = langTranslations[key as keyof typeof langTranslations] || key;
      
      // Handle replacements like {current} and {total}
      if (replacements) {
        Object.entries(replacements).forEach(([placeholder, value]) => {
          translation = translation.replace(`{${placeholder}}`, String(value));
        });
      }
      
      return translation;
    };

    const setLanguage = (language: string) => {
      localStorage.setItem('userLanguage', language);
    };

    return { t, setLanguage, currentLanguage: getStoredLanguage() };
  }
  return context;
};