import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaBuilding, 
  FaExclamationTriangle,
  FaShieldAlt
} from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const Home = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const features = [
    {
      id: 1,
      title: t.btnCheckOffer,
      description: "Paste text or upload screenshot to detect scams",
      icon: FaFileAlt,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      path: "/check-offer",
      borderColor: "border-blue-200"
    },
    {
      id: 2,
      title: t.btnCheckAgency,
      description: "Verify recruitment agencies from official records",
      icon: FaBuilding,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      path: "/check-agency",
      borderColor: "border-green-200"
    },
    {
      id: 3,
      title: t.btnReportScam,
      description: "Help others by reporting fraudulent agencies",
      icon: FaExclamationTriangle,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      path: "/report-scam",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="h-10 w-10 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t.appName}
              </h1>
              <p className="text-blue-100 text-sm">
                {t.tagline}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-white text-lg font-semibold">
            {t.welcome}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {t.homeSubtitle}
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => navigate(feature.path)}
                className={`${feature.bgColor} border ${feature.borderColor} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${feature.bgColor} border ${feature.borderColor}`}>
                    <IconComponent className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-base">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${feature.color}`} />
              </div>
            );
          })}
        </div>

        {/* About Section */}
        <div className="mt-8">
          <div 
            onClick={() => navigate('/about')}
            className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {t.learnAboutScams}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t.knowWarningSigns}
                </p>
              </div>
              <div className="text-gray-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;