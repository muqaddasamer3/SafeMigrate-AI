import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiHome, FiAlertTriangle } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const Onboarding = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: FiFileText,
      title: t.btnCheckOffer,
      description: "Paste your job offer text or upload a screenshot to verify if it's genuine or a scam"
    },
    {
      icon: FiHome,
      title: t.btnCheckAgency,
      description: "Search and verify recruitment agencies against the official government verified list"
    },
    {
      icon: FiAlertTriangle,
      title: t.btnReportScam,
      description: "Help others by reporting fraudulent agencies and scam experiences"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      window.location.href = '/home';
    }
  };

  const handleSkip = () => {
    console.log('Skip button clicked!');
    window.location.href = '/home';
  };

  const IconComponent = slides[currentSlide].icon;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Skip Button - Added padding-right for language toggle */}
      <div className="flex justify-end p-6 pr-24">
        <button
          onClick={handleSkip}
          type="button"
          className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition cursor-pointer"
        >
          {t.skip}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        <div className="bg-blue-50 p-8 rounded-full mb-8">
          <IconComponent className="h-24 w-24 text-blue-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          {slides[currentSlide].title}
        </h2>
        <p className="text-gray-600 text-center text-lg max-w-sm">
          {slides[currentSlide].description}
        </p>

        {/* Dots Indicator */}
        <div className="flex gap-2 mt-10">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="p-6 pb-10">
        <button
          onClick={handleNext}
          type="button"
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          {currentSlide === slides.length - 1 ? t.getStarted : t.next}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;