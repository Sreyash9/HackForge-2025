import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useTranslation } from '../utils/translations';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const { setLanguage } = useTranslation();

  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'marathi', name: 'मराठी', flag: '🇮🇳' },
    { code: 'konkani', name: 'कोंकणी', flag: '🇮🇳' }
  ];

  useEffect(() => {
    // Get user's preferred language from profile
    fetchUserLanguage();
  }, []);

  const fetchUserLanguage = async () => {
    try {
      const response = await api.get('/energy/user/profile');
      if (response.data.preferred_language) {
        setSelectedLanguage(response.data.preferred_language);
      }
    } catch (error) {
      console.error('Failed to fetch user language:', error);
    }
  };

  const handleLanguageSelect = async (languageCode: string) => {
    setLoading(true);
    try {
      await api.put('/energy/user/language', { language: languageCode });
      setSelectedLanguage(languageCode);
      setLanguage(languageCode);
      setIsOpen(false);
      
      if (onLanguageChange) {
        onLanguageChange(languageCode);
      }
    } catch (error) {
      console.error('Failed to update language:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-gray-700">{selectedLang.flag}</span>
        <span className="text-gray-700 hidden sm:inline">{selectedLang.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
              onClick={closeModal}
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-xl p-6 w-80 max-w-[90vw] relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Select Language
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Language Options */}
                <div className="space-y-2">
                  {languages.map((language, index) => (
                    <motion.button
                      key={language.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleLanguageSelect(language.code)}
                      disabled={loading}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 rounded-lg transition-colors disabled:opacity-50 ${
                        selectedLanguage === language.code ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-gray-700 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-xl">{language.flag}</span>
                      <span className="font-medium flex-1">{language.name}</span>
                      {selectedLanguage === language.code && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-blue-600 text-xl"
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </div>

                {loading && (
                  <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LanguageSelector;