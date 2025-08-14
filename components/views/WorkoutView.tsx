import React, { useState, useCallback } from 'react';
import { WorkoutGenerator } from '../WorkoutGenerator';
import { WorkoutPlanDisplay } from '../WorkoutPlanDisplay';
import { Loader } from '../Loader';
import { Intro } from '../Intro';
import { NotificationScheduler } from '../NotificationScheduler';
import { generateWorkoutPlan } from '../../services/geminiService';
import type { WorkoutPlan, WorkoutParams } from '../../types';

export const WorkoutView: React.FC = () => {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateWorkout = useCallback(async (params: WorkoutParams) => {
    setIsLoading(true);
    setError(null);
    setWorkoutPlan(null);
    try {
      const plan = await generateWorkoutPlan(params);
      setWorkoutPlan(plan);
    } catch (err) {
      console.error(err);
      setError('Failed to generate workout plan. The AI coach might be resting. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-8">
      <WorkoutGenerator onGenerate={handleGenerateWorkout} isLoading={isLoading} />
      <NotificationScheduler />

      {isLoading && <Loader />}
      
      {error && (
        <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
          <p className="font-bold">An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {workoutPlan && !isLoading && (
         <WorkoutPlanDisplay plan={workoutPlan} />
      )}

      {!workoutPlan && !isLoading && !error && <Intro />}
    </div>
  );
};
