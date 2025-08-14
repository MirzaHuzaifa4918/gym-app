import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WorkoutView } from './components/views/WorkoutView';
import { CalorieCounterView } from './components/views/CalorieCounterView';
import { InstallView } from './components/views/InstallView';

type ActiveView = 'workout' | 'nutrition' | 'install';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-all duration-300 focus:outline-none ${
      isActive
        ? 'bg-gray-800/50 border-b-2 border-red-500 text-white'
        : 'text-gray-400 hover:text-white'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {label}
  </button>
);


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('workout');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);


  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
            <div className="border-b border-gray-700 mb-8 flex justify-center space-x-2 md:space-x-4">
                <TabButton label="AI Coach" isActive={activeView === 'workout'} onClick={() => setActiveView('workout')} />
                <TabButton label="Nutrition AI" isActive={activeView === 'nutrition'} onClick={() => setActiveView('nutrition')} />
                <TabButton label="Install App" isActive={activeView === 'install'} onClick={() => setActiveView('install')} />
            </div>

            <div role="tabpanel" hidden={activeView !== 'workout'}>
              {activeView === 'workout' && <WorkoutView />}
            </div>
            <div role="tabpanel" hidden={activeView !== 'nutrition'}>
              {activeView === 'nutrition' && <CalorieCounterView />}
            </div>
            <div role="tabpanel" hidden={activeView !== 'install'}>
              {activeView === 'install' && <InstallView deferredPrompt={deferredPrompt} />}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;