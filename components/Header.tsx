
import React from 'react';

const DumbbellIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-red-600" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.5 6.5A1.5 1.5 0 018 5h1a1.5 1.5 0 011.5 1.5v11A1.5 1.5 0 019 19H8a1.5 1.5 0 01-1.5-1.5v-11zm11 0A1.5 1.5 0 0016 5h-1a1.5 1.5 0 00-1.5 1.5v11a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-11zM4 9.5A2.5 2.5 0 016.5 7H8v10H6.5A2.5 2.5 0 014 14.5v-5zm16 0A2.5 2.5 0 0017.5 7H16v10h1.5a2.5 2.5 0 002.5-2.5v-5z"/>
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-950/70 backdrop-blur-sm shadow-lg shadow-red-600/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-4">
            <DumbbellIcon />
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-center">
              <span className="text-red-600">AI</span>
              <span className="text-gray-100"> Gym Coach</span>
            </h1>
        </div>
      </div>
    </header>
  );
};
