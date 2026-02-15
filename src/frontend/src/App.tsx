import { useState, useEffect } from 'react';
import TopNav from './components/site/TopNav';
import HeroSection from './components/site/sections/HeroSection';
import ServicesSection from './components/site/sections/ServicesSection';
import AboutSection from './components/site/sections/AboutSection';
import GallerySection from './components/site/sections/GallerySection';
import ContactSection from './components/site/sections/ContactSection';
import Footer from './components/site/Footer';
import AdminInquiriesPage from './pages/AdminInquiriesPage';
import AdminGalleryPage from './pages/AdminGalleryPage';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin-inquiries' | 'admin-gallery'>(
    'home'
  );

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin/gallery') {
        setCurrentView('admin-gallery');
      } else if (hash.startsWith('#/admin')) {
        setCurrentView('admin-inquiries');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentView === 'admin-gallery') {
    return <AdminGalleryPage />;
  }

  if (currentView === 'admin-inquiries') {
    return <AdminInquiriesPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
