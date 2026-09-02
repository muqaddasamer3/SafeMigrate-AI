import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';

// Components
import Layout from './components/Layout/Layout';
import Splash from './components/Screens/Splash';
import Onboarding from './components/Screens/Onboarding';
import Home from './components/Screens/Home';
import CheckOffer from './components/Screens/CheckOffer';
import Result from './components/Screens/Result';
import AgencySearch from './components/Screens/AgencySearch';
import AgencyResult from './components/Screens/AgencyResult';
import ReportScam from './components/Screens/ReportScam';
import About from './components/Screens/About';
import History from './components/Screens/History';
import NotFound from './components/Screens/NotFound';  // ← ADD THIS

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/check-offer" element={<CheckOffer />} />
            <Route path="/result" element={<Result />} />
            <Route path="/check-agency" element={<AgencySearch />} />
            <Route path="/agency-result" element={<AgencyResult />} />
            <Route path="/report-scam" element={<ReportScam />} />
            <Route path="/about" element={<About />} />
            <Route path="/history" element={<History />} />
            
            {/* 404 Catch-All Route - Must be LAST */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;