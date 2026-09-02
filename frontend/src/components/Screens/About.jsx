import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiShield, 
  FiAlertTriangle, 
  FiDollarSign, 
  FiClock, 
  FiFileText, 
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const About = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const warningSigns = [
    {
      icon: FiDollarSign,
      title: "Upfront Payment Requests",
      description: "Legitimate agencies never ask for processing fees before you get a job offer. This is a major red flag."
    },
    {
      icon: FiAlertTriangle,
      title: "Unrealistic Salary Offers",
      description: "If the salary seems too good to be true, it probably is. Research market rates for your profession."
    },
    {
      icon: FiClock,
      title: "Extreme Urgency Pressure",
      description: "Scammers create false urgency to prevent you from thinking clearly. 'Pay now or lose the offer' is a common tactic."
    },
    {
      icon: FiFileText,
      title: "Poor Quality Documents",
      description: "Fake offer letters often have spelling mistakes, grammatical errors, and unprofessional formatting."
    },
    {
      icon: FiMessageSquare,
      title: "WhatsApp Only Communication",
      description: "Legitimate agencies use official email and have proper contact information, not just WhatsApp numbers."
    },
    {
      icon: FiXCircle,
      title: "Unverified Agency",
      description: "Always check if the agency is in the official government verified list. If not, be extremely cautious."
    }
  ];

  const safetyTips = [
    {
      icon: FiCheckCircle,
      title: "Verify Through Official Channels",
      description: "Always cross-check agency information with the Bureau of Emigration website or local authorities."
    },
    {
      icon: FiShield,
      title: "Never Send Money Without Verification",
      description: "Do not pay any fees until you have confirmed the agency is legitimate and the offer is verified."
    },
    {
      icon: FiFileText,
      title: "Keep All Documents Safe",
      description: "Save copies of all communications, agreements, and receipts in case you need to report a scam."
    },
    {
      icon: FiAlertTriangle,
      title: "Trust Your Instincts",
      description: "If something feels wrong, it probably is. Take your time and seek advice from trusted sources."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-white mb-4 hover:text-blue-200 transition"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          {t.back}
        </button>
        <h1 className="text-2xl font-bold text-white">{t.aboutTitle}</h1>
        <p className="text-blue-100 text-sm mt-1">{t.knowWarningSigns}</p>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t.protectYourself}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{t.aboutDescription}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
            {t.commonScamWarningSigns}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warningSigns.map((sign, index) => {
              const IconComponent = sign.icon;
              return (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{sign.title}</h4>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">{sign.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiShield className="h-6 w-6 text-green-600" />
            {t.safetyTips}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{tip.title}</h4>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-5 text-center">
          <h4 className="font-semibold text-blue-800 mb-1">{t.needHelp}</h4>
          <p className="text-sm text-blue-700">{t.contactBEOE}</p>
          <button
            onClick={() => window.open('https://beoe.gov.pk', '_blank')}
            className="mt-3 px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {t.visitWebsite}
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;