import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import PublicGallery from './components/PublicGallery';
import Footer from './components/Footer';
import LaboranView from './components/dashboards/LaboranView';
import LecturerView from './components/dashboards/LecturerView';
import StudentView from './components/dashboards/StudentView';
import LoginPage from './components/pages/LoginPage';
import ShowcasePage from './components/pages/ShowcasePage';
import InfoPage from './components/pages/InfoPage';

// Inner component to handle routing logic
const MainContent: React.FC = () => {
  const { user, currentPage } = useApp();

  // If user is logged in, show their specific dashboard via Dashboard Layouts
  if (user) {
    if (user.role === 'laboran') return <LaboranView />;
    if (user.role === 'dosen') return <LecturerView />;
    if (user.role === 'mahasiswa') return <StudentView />;
  }

  // Public Routes (Only show standard layout components here)
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
       <TopBar />
       <Navbar />
       
       <main className="flex-grow">
        {currentPage === 'login' && <LoginPage />}
        {currentPage === 'showcase' && <ShowcasePage />}
        {currentPage === 'info' && <InfoPage />}
        {(currentPage === 'home' || !currentPage) && (
          <>
            <Hero />
            <Features />
            <PublicGallery />
          </>
        )}
       </main>

       <Footer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
       <MainContent />
    </AppProvider>
  );
}

export default App;