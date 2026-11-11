import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './lib/LanguageContext';
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
  return (
    <Router>
      <ScrollManager />
      <LanguageProvider>
        <div className="min-h-screen bg-dark-950">
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <Hero />
                <About />
                <MarqueeGallery />
                <RegistrationForm />
                <Footer />
              </>
            } />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/status" element={<CheckStatus />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </LanguageProvider>
    </Router>
  )
}

export default App

