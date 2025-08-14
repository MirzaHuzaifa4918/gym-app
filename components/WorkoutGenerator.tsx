
import React, { useState } from 'react';
import type { WorkoutParams, FitnessGoal, ExperienceLevel, AvailableEquipment, WorkoutDuration } from '../types';

interface WorkoutGeneratorProps {
  onGenerate: (params: WorkoutParams) => void;
  isLoading: boolean;
}

const GeneratorButton: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:bg-red-900 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300 transform hover:scale-105"
    >
      {isLoading ? (
        <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Your Workout...
        </>
      ) : (
        'Unleash Your Potential'
      )}
    </button>
);


const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ label, id, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="block w-full pl-3 pr-10 py-2 text-base bg-gray-800 border-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md text-white transition-colors"
        >
            {children}
        </select>
    </div>
);

export const WorkoutGenerator: React.FC<WorkoutGeneratorProps> = ({ onGenerate, isLoading }) => {
  const [goal, setGoal] = useState<FitnessGoal>('Build Muscle');
  const [level, setLevel] = useState<ExperienceLevel>('Intermediate');
  const [equipment, setEquipment] = useState<AvailableEquipment>('Full Gym');
  const [duration, setDuration] = useState<WorkoutDuration>('60');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ goal, level, equipment, duration });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-6">Customize Your Session</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="Primary Goal" id="goal" value={goal} onChange={(e) => setGoal(e.target.value as FitnessGoal)}>
                <option>Build Muscle</option>
                <option>Lose Fat</option>
                <option>Improve Endurance</option>
                <option>Increase Strength</option>
            </SelectField>

            <SelectField label="Experience Level" id="level" value={level} onChange={(e) => setLevel(e.target.value as ExperienceLevel)}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
            </SelectField>

            <SelectField label="Available Equipment" id="equipment" value={equipment} onChange={(e) => setEquipment(e.target.value as AvailableEquipment)}>
                <option>Full Gym</option>
                <option>Basic Home Gym</option>
                <option>Dumbbells Only</option>
                <option>Bodyweight Only</option>
            </SelectField>

            <SelectField label="Workout Duration (minutes)" id="duration" value={duration} onChange={(e) => setDuration(e.target.value as WorkoutDuration)}>
                <option>30</option>
                <option>45</option>
                <option>60</option>
                <option>90</option>
            </SelectField>
        </div>
        <div className="pt-4">
            <GeneratorButton isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
};
