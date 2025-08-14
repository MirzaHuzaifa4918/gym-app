
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950/50 mt-12 py-4">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Gym Coach. All Rights Reserved.</p>
        <p>Powered by <span className="font-semibold text-gray-400">Google Gemini</span></p>
      </div>
    </footer>
  );
};
