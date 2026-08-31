import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const Splash = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800">
      <div className="text-center">
        <div className="bg-white/20 p-6 rounded-full inline-block mb-6">
          <FaShieldAlt className="h-28 w-28 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight">
          {t.appName}
        </h1>
        <p className="text-xl text-blue-100 mt-3">
          {t.tagline}
        </p>
        <div className="mt-8">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;