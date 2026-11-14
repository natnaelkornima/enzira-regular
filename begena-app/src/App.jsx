import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './lib/LanguageContext';
import { LocationProvider } from './lib/LocationContext';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import MarqueeGallery from './components/MarqueeGallery'
import RegistrationForm from './components/RegistrationForm'
import Footer from './components/Footer'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import CheckStatus from './components/CheckStatus'
import Pricing from './components/Pricing'
import TermsModal from './components/TermsModal'

const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};

function App() {
  const [selectedTierId, setSelectedTierId] = useState(null);

  return (
    <Router>
      <ScrollManager />
      <LocationProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-dark-950">
            <TermsModal />
            <Routes>
              <Route path="/" element={
                <>
                  <Navbar />
                  <Hero />
                  <About />
                  <MarqueeGallery />
                  <Pricing selectedTierId={selectedTierId} onSelectPlanTier={setSelectedTierId} />
                  <RegistrationForm selectedTierId={selectedTierId} onSelectPlanTier={setSelectedTierId} />
                  <Footer />
                </>
              } />
              <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/status" element={<CheckStatus />} />
              <Route path="/index.html" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </LanguageProvider>
      </LocationProvider>
    </Router>
  )
}

export default App

