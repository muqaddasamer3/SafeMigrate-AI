import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition text-white text-sm font-semibold"
    >
      <span className="uppercase">{language === 'en' ? 'EN' : 'UR'}</span>
      <span className="text-xs opacity-60">|</span>
      <span className="uppercase text-xs opacity-60">
        {language === 'en' ? 'UR' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;