import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo, FiShare2, FiFileText } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];

  const result = location.state?.result;

  const riskLabel = result?.risk_label || 'Low';
  const riskScore = result?.risk_score ?? 0;
  const redFlags = result?.red_flags || [];
  const reasons = language === 'ur' ? (result?.reasons_ur || []) : (result?.reasons_en || []);
  const nextSteps = language === 'ur' ? (result?.next_steps_ur || []) : (result?.next_steps_en || []);
  const message = language === 'ur' ? (result?.message_ur || '') : (result?.message_en || '');

  useEffect(() => {
    if (!result) return;
    const historyEntry = {
      type: location.state?.inputText ? 'offer' : 'image',
      risk: riskLabel,
      text: location.state?.inputText || result.extracted_text || 'Screenshot analysis',
      agencyName: null,
      date: new Date().toISOString()
    };
    const savedHistory = localStorage.getItem('safeMigrateHistory');
    let history = savedHistory ? JSON.parse(savedHistory) : [];
    history.unshift(historyEntry);
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    localStorage.setItem('safeMigrateHistory', JSON.stringify(history));
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <FiAlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Analysis Data</h2>
          <p className="text-gray-600 mb-6">Please go back and analyze an offer first.</p>
          <button
            onClick={() => navigate('/check-offer')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Go to Check Offer
          </button>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return 'green';
      case 'Medium': return 'yellow';
      case 'High': return 'red';
      default: return 'gray';
    }
  };

  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'Low': return FiCheckCircle;
      case 'Medium': return FiAlertTriangle;
      case 'High': return FiXCircle;
      default: return FiInfo;
    }
  };

  const getRiskBgColor = (risk) => {
    switch(risk) {
      case 'Low': return 'bg-green-50 border-green-200';
      case 'Medium': return 'bg-yellow-50 border-yellow-200';
      case 'High': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getRiskTextColor = (risk) => {
    switch(risk) {
      case 'Low': return 'text-green-700';
      case 'Medium': return 'text-yellow-700';
      case 'High': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  const getRiskLabel = (risk) => {
    switch(risk) {
      case 'Low': return t.lowRisk;
      case 'Medium': return t.mediumRisk;
      case 'High': return t.highRisk;
      default: return 'Unknown';
    }
  };

  const RiskIcon = getRiskIcon(riskLabel);

  const handleShare = async () => {
    const flagsText = redFlags.map(f => typeof f === 'string' ? f : f.phrase).join('\n');
    const shareData = {
      title: 'SafeMigrate AI - Risk Result',
      text: `Risk Level: ${riskLabel}\nRisk Score: ${riskScore}%\n\nRed Flags Detected:\n${flagsText}\n\n${message}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const flagsText = redFlags.map(f => typeof f === 'string' ? f : f.phrase).join('\n');
    const textContent = `Risk Level: ${riskLabel}\nRisk Score: ${riskScore}%\n\nRed Flags Detected:\n${flagsText}\n\n${message}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textContent)
        .then(() => alert('Result copied to clipboard!'))
        .catch(() => alert('Could not copy. Please copy the result manually.'));
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = textContent;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        alert('Result copied to clipboard!');
      } catch (err) {
        alert('Could not copy. Please copy the result manually.');
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${
        riskLabel === 'Low' ? 'from-green-600 to-green-800' :
        riskLabel === 'Medium' ? 'from-yellow-600 to-yellow-800' :
        'from-red-600 to-red-800'
      } px-6 pt-12 pb-6 rounded-b-3xl shadow-lg`}>
        <button
          onClick={() => navigate('/check-offer')}
          className="flex items-center text-white mb-4 hover:text-gray-200 transition"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          {t.back}
        </button>
        <h1 className="text-2xl font-bold text-white">{t.analysisResult}</h1>
        <p className="text-white/80 text-sm mt-1">{t.heresWhatFound}</p>
      </div>

      <div className="px-6 py-6">
        <div className={`${getRiskBgColor(riskLabel)} border-2 rounded-2xl p-6 shadow-sm`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${
              riskLabel === 'Low' ? 'bg-green-100' :
              riskLabel === 'Medium' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <RiskIcon className={`h-8 w-8 ${getRiskTextColor(riskLabel)}`} />
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${getRiskTextColor(riskLabel)}`}>
                {getRiskLabel(riskLabel)} {t.risk}
              </h2>
              <p className={`text-sm ${getRiskTextColor(riskLabel)} mt-1`}>
                {t.riskScore}: {riskScore}%
              </p>
              <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    riskLabel === 'Low' ? 'bg-green-500' :
                    riskLabel === 'Medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${riskScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FiInfo className="h-5 w-5 text-blue-600" />
              {t.explanation}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {message}
            </p>
            {reasons.length > 0 && (
              <ul className="mt-3 space-y-1">
                {reasons.map((reason, index) => (
                  <li key={index} className="text-gray-500 text-xs flex items-start gap-2">
                    <span className="text-blue-400 font-bold mt-0.5">{"\u2022"}</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {redFlags.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiAlertTriangle className="h-5 w-5 text-red-600" />
              {t.redFlagsDetected}
            </h3>
            <ul className="space-y-2">
              {redFlags.map((flag, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="text-red-500 font-bold mt-0.5">{"\u2022"}</span>
                  <span className="text-gray-700">{typeof flag === 'string' ? flag : flag.phrase}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.extracted_text && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FiFileText className="h-5 w-5 text-blue-600" />
              Extracted Text from Image
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {result.extracted_text}
            </p>
          </div>
        )}

        {nextSteps.length > 0 && (
          <div className="mt-6 bg-blue-50 rounded-2xl border border-blue-200 p-5">
            <h3 className="font-semibold text-blue-800 mb-2">{t.recommendedNextSteps}</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              {nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate('/check-offer')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {t.checkAnotherOffer}
          </button>

          <button
            onClick={handleShare}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <FiShare2 className="h-5 w-5" />
            Share Result
          </button>

          <button
            onClick={() => navigate('/report-scam')}
            className="w-full border-2 border-red-600 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
          >
            {t.reportThisScam}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
