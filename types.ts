export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  description: string;
}

export type WorkoutPlan = Exercise[];

export type FitnessGoal = 'Build Muscle' | 'Lose Fat' | 'Improve Endurance' | 'Increase Strength';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type AvailableEquipment = 'Full Gym' | 'Dumbbells Only' | 'Bodyweight Only' | 'Basic Home Gym';
export type WorkoutDuration = '30' | '45' | '60' | '90';

export interface WorkoutParams {
  goal: FitnessGoal;
  level: ExperienceLevel;
  equipment: AvailableEquipment;
  duration: WorkoutDuration;
}

export interface CalorieAnalysis {
  dishName: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  notes: string;
}
