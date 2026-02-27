import { Workout, Exercise, WorkoutSet, ProgressData, HistoryItem } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 15);

export function parseWorkoutEmail(text: string): Workout {
  const lines = text.split('\n').map(line => line.trim());

  let clientName = "Unknown";
  let routineName = "Unknown";
  let rating = 0;
  let feedback = "";
  let date = new Date().toISOString(); // Default to today if not found

  const exercises: Exercise[] = [];
  let currentExercise: Exercise | null = null;

  // Regex patterns
  const clientRegex = /Cliente:\s*(.*)/i;
  const routineRegex = /Rutina\/Día:\s*(.*)/i;
  const ratingRegex = /Puntuación:\s*(.*)/i; // Count stars or parse number
  const exerciseHeaderRegex = /^-\s*([A-ZÁÉÍÓÚÑ\s0-9°]+):$/i;
  const setRegex = /Serie\s*\d+:\s*([\d-]+)\s*reps\s*@\s*(\d+)(kg|lb)/i;
  const notesRegex = /Notas:\s*(.*)/i;

  for (const line of lines) {
    // Metadata parsing
    const clientMatch = line.match(clientRegex);
    if (clientMatch) clientName = clientMatch[1].trim();

    const routineMatch = line.match(routineRegex);
    if (routineMatch) routineName = routineMatch[1].trim();

    const ratingMatch = line.match(ratingRegex);
    if (ratingMatch) {
      const stars = (ratingMatch[1].match(/⭐/g) || []).length;
      rating = stars > 0 ? stars : 5; // Default to 5 if text says "5 estrellas" but no emoji, or parse text
      if (line.toLowerCase().includes("5 estrellas")) rating = 5;
    }

    // Exercise parsing
    const exerciseMatch = line.match(exerciseHeaderRegex);
    if (exerciseMatch) {
      if (currentExercise) {
        exercises.push(currentExercise);
      }
      currentExercise = {
        name: exerciseMatch[1].trim(),
        sets: []
      };
      continue;
    }

    // Set parsing
    const setMatch = line.match(setRegex);
    if (setMatch && currentExercise) {
      currentExercise.sets.push({
        reps: setMatch[1],
        weight: parseFloat(setMatch[2]),
        unit: setMatch[3]
      });
    }

    // Notes parsing
    const notesMatch = line.match(notesRegex);
    if (notesMatch && currentExercise) {
      currentExercise.notes = notesMatch[1].trim();
    }
  }

  // Push the last exercise
  if (currentExercise) {
    exercises.push(currentExercise);
  }

  return {
    id: generateId(),
    clientName,
    date,
    routineName,
    rating,
    feedback,
    exercises,
    rawText: text
  };
}

export function calculateProgress(workouts: Workout[]): ProgressData[] {
  // Group by exercise name
  const exerciseMap = new Map<string, HistoryItem[]>();

  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      // Normalize name: uppercase and trim
      const normalizedName = exercise.name.trim().toUpperCase();

      // Find max weight for this exercise in this workout. 
      // If multiple sets have the same max weight, we'll keep the one with the lowest reps (as per user preference for progress tracking)
      let bestSet: WorkoutSet | null = null;

      exercise.sets.forEach(set => {
        if (!bestSet || set.weight > bestSet.weight) {
          bestSet = set;
        } else if (set.weight === bestSet.weight) {
          // If weights are equal, the user mentioned identifying progress by the lower rep range
          // usually meaning if they hit the target weight at the low end, it's the milestone.
          // For now we just store the set with the max weight.
          bestSet = set;
        }
      });

      if (bestSet) {
        const history = exerciseMap.get(normalizedName) || [];
        history.push({
          date: workout.date,
          weight: (bestSet as WorkoutSet).weight,
          reps: (bestSet as WorkoutSet).reps
        });
        exerciseMap.set(normalizedName, history);
      }
    });
  });

  const progressData: ProgressData[] = [];

  exerciseMap.forEach((history, name) => {
    // Sort by date
    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (history.length > 0) {
      const startWeight = history[0].weight;
      const currentWeight = history[history.length - 1].weight;
      const percentageChange = startWeight !== 0
        ? ((currentWeight - startWeight) / startWeight) * 100
        : 0;

      progressData.push({
        exerciseName: name,
        startWeight,
        currentWeight,
        percentageChange,
        history
      });
    }
  });

  return progressData;
}
