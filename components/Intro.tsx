
import React from 'react';

export const Intro: React.FC = () => {
  return (
    <div className="mt-12 text-center animate-fade-in p-6 bg-gray-800/30 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white">Welcome to Your AI-Powered Gym</h2>
      <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
        Ready to transform your fitness journey? Simply select your goal, experience level, available equipment, and desired workout duration above. 
        Your personal AI coach will instantly design a custom workout plan tailored just for you.
      </p>
      <div className="mt-6 text-red-500 font-semibold">
        No more guessing. Just results.
      </div>
    </div>
  );
};
