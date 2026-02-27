import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface WorkoutSet {
  reps: string; // e.g., "10-12"
  weight: number; // e.g., 40
  unit: string; // e.g., "kg"
}

export interface Exercise {
  name: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  clientName: string;
  date: string; // ISO string
  routineName: string;
  rating: number; // 1-5
  feedback?: string;
  exercises: Exercise[];
  rawText?: string; // Store the original text for reference
}

export interface HistoryItem {
  date: string;
  weight: number;
  reps: string;
}

export interface ProgressData {
  exerciseName: string;
  startWeight: number;
  currentWeight: number;
  percentageChange: number;
  history: HistoryItem[];
}

export interface CheckIn {
  id: string;
  date: string;
  notes: string; // "Mejoras / Cambios notorios"
  photos: string[]; // Base64 strings of images
}
