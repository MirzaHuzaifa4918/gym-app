import React, { useState } from 'react';
import type { Exercise } from '../types';
import { generateExerciseImage } from '../services/geminiService';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

const getIconForExercise = (name: string) => {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes('warm-up')) return '🔥';
    if (lowerCaseName.includes('cool-down') || lowerCaseName.includes('stretch')) return '❄️';
    if (lowerCaseName.includes('squat') || lowerCaseName.includes('lunge')) return '🦵';
    if (lowerCaseName.includes('press') || lowerCaseName.includes('push-up')) return '💪';
    if (lowerCaseName.includes('deadlift') || lowerCaseName.includes('row')) return '🏋️';
    if (lowerCaseName.includes('plank') || lowerCaseName.includes('core')) return '🤸';
    if (lowerCaseName.includes('run') || lowerCaseName.includes('cardio')) return '🏃';
    return '⚡';
};

const ImageModal: React.FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
        <div className="bg-gray-900 p-4 rounded-lg shadow-xl max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 id="image-modal-title" className="text-lg font-semibold text-white mb-2 sr-only">{alt}</h3>
            <img src={src} alt={alt} className="w-full h-auto object-contain rounded-md bg-black max-h-[80vh]" />
            <button onClick={onClose} className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500">Close</button>
        </div>
    </div>
);

const DemoLoader: React.FC = () => (
    <div className="flex items-center space-x-2 text-sm text-gray-400">
        <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span>Generating Animated Picture...</span>
    </div>
);


export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  const [demoState, setDemoState] = useState<{ imageUrl: string | null; isLoading: boolean; error: string | null }>({ imageUrl: null, isLoading: false, error: null });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowImage = async () => {
      if (demoState.imageUrl) {
          setIsModalOpen(true);
          return;
      }

      setDemoState({ imageUrl: null, isLoading: true, error: null });
      try {
          const url = await generateExerciseImage(exercise.name);
          setDemoState({ imageUrl: url, isLoading: false, error: null });
          setIsModalOpen(true);
      } catch (err) {
          console.error(err);
          setDemoState({ imageUrl: null, isLoading: false, error: 'Failed to load demo picture.' });
      }
  };

  return (
    <>
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 transition-all duration-300 hover:border-red-600 hover:shadow-lg hover:shadow-red-600/10">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex items-center gap-4 flex-shrink-0">
            <span className="text-4xl" aria-hidden="true">{getIconForExercise(exercise.name)}</span>
            <div className="md:w-60">
                <h3 className="text-lg font-bold text-white capitalize">{exercise.name}</h3>
                <div className="flex items-center space-x-4 mt-1 text-red-400 font-semibold">
                    <span>{exercise.sets} SETS</span>
                    <span aria-hidden="true">&times;</span>
                    <span>{exercise.reps} REPS</span>
                </div>
            </div>
        </div>
        <div className="md:border-l md:border-gray-600 md:pl-4 flex-1 space-y-3">
            <p className="text-gray-300 text-sm">
                {exercise.description}
            </p>
            <div>
                {demoState.isLoading ? (
                    <DemoLoader />
                ) : demoState.error ? (
                    <p className="text-red-500 text-sm" role="alert">{demoState.error}</p>
                ) : (
                    <button onClick={handleShowImage} className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 rounded">
                        {demoState.imageUrl ? 'View Picture Demonstration' : 'Show Picture Demonstration'}
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
    {isModalOpen && demoState.imageUrl && (
        <ImageModal src={demoState.imageUrl} alt={`Picture Demonstration of ${exercise.name}`} onClose={() => setIsModalOpen(false)} />
    )}
    </>
  );
};