import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaBuilding, 
  FaExclamationTriangle,
  FaShieldAlt,
  FaChartLine,
  FaCheckCircle,
  FaUserCheck,
  FaHistory
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

  // Stats data
  const stats = [
    {
      icon: FaChartLine,
      value: "1,247+",
      label: "Scams Detected",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: FaCheckCircle,
      value: "156+",
      label: "Verified Agencies",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: FaUserCheck,
      value: "98%",
      label: "Accuracy Rate",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
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
                {t.tagline || "Check Before You Go"}
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

      {/* Stats Section */}
      <div className="px-6 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-3 text-center">
                <div className={`inline-flex p-2 rounded-lg ${stat.bgColor} mb-1`}>
                  <IconComponent className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => navigate(feature.path)}
                className={`${feature.bgColor} border ${feature.borderColor} rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${feature.bgColor} border ${feature.borderColor}`}>
                    <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-xs mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className={`mt-3 h-0.5 w-full rounded-full bg-gradient-to-r ${feature.color}`} />
              </div>
            );
          })}
        </div>

        {/* History Button - NEW */}
        <div className="mt-4">
          <div 
            onClick={() => navigate('/history')}
            className="bg-white border border-purple-200 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition hover:border-purple-400"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-xl">
                  <FaHistory className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    View History
                  </h3>
                  <p className="text-gray-600 text-xs">
                    See your past scam checks and verifications
                  </p>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-4">
          <div 
            onClick={() => navigate('/about')}
            className="bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {t.learnAboutScams}
                </h3>
                <p className="text-gray-600 text-xs">
                  {t.knowWarningSigns}
                </p>
              </div>
              <div className="text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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