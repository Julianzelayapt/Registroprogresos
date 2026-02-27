import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ExerciseProgress } from './components/ExerciseProgress';
import { ImportWorkout } from './components/ImportWorkout';
import { CheckIns } from './components/CheckIns';
import { Workout, CheckIn } from './types';
import { calculateProgress } from './utils/parser';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'progress' | 'import' | 'checkins'>('dashboard');

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch Workouts
        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .order('date', { ascending: false });

        if (workoutsError) throw workoutsError;

        // Transform JSONB exercises back to our type if needed
        const formattedWorkouts: Workout[] = (workoutsData || []).map(w => ({
          id: w.id,
          clientName: w.client_name,
          date: w.date,
          routineName: w.routine_name,
          rating: w.rating,
          feedback: w.feedback,
          exercises: w.exercises, // JSONB
          rawText: w.raw_text
        }));
        setWorkouts(formattedWorkouts);

        // Fetch Check-ins
        const { data: checkinsData, error: checkinsError } = await supabase
          .from('checkins')
          .select('*')
          .order('date', { ascending: false });

        if (checkinsError) throw checkinsError;

        const formattedCheckIns: CheckIn[] = (checkinsData || []).map(c => ({
          id: c.id,
          date: c.date,
          notes: c.notes,
          photos: c.photo_urls || []
        }));
        setCheckIns(formattedCheckIns);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const progressData = useMemo(() => calculateProgress(workouts), [workouts]);

  const handleImport = async (newWorkout: Workout) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .insert([{
          client_name: newWorkout.clientName,
          date: newWorkout.date,
          routine_name: newWorkout.routineName,
          rating: newWorkout.rating,
          feedback: newWorkout.feedback,
          exercises: newWorkout.exercises,
          raw_text: newWorkout.rawText
        }]);

      if (error) throw error;

      // Refresh workouts from DB to get the new ID
      const { data } = await supabase.from('workouts').select('*').order('date', { ascending: false });
      const formatted = (data || []).map(w => ({
        id: w.id,
        clientName: w.client_name,
        date: w.date,
        routineName: w.routine_name,
        rating: w.rating,
        feedback: w.feedback,
        exercises: w.exercises,
        rawText: w.raw_text
      }));
      setWorkouts(formatted);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error importing workout:', error);
      alert('Error al guardar el entrenamiento');
    }
  };

  const handleAddCheckIn = async (newCheckIn: CheckIn) => {
    try {
      // NOTE: For now, we save photos as they are (base64 if small or local URLs).
      // We will implement Storage upload in the next step.
      const { error } = await supabase
        .from('checkins')
        .insert([{
          date: newCheckIn.date,
          notes: newCheckIn.notes,
          photo_urls: newCheckIn.photos
        }]);

      if (error) throw error;
      setCheckIns(prev => [newCheckIn, ...prev]);
    } catch (error) {
      console.error('Error adding check-in:', error);
      alert('Error al guardar el check-in');
    }
  };

  const handleDeleteCheckIn = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este check-in?')) {
      try {
        const { error } = await supabase.from('checkins').delete().eq('id', id);
        if (error) throw error;
        setCheckIns(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting check-in:', error);
      }
    }
  };

  const handleResetData = () => {
    alert('Esta función ha sido deshabilitada al conectar con Supabase para proteger tu base de datos real.');
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Cargando datos...</span>
        </div>
      ) : (
        <>
          {currentView === 'dashboard' && (
            <Dashboard workouts={workouts} progressData={progressData} />
          )}
          {currentView === 'progress' && (
            <ExerciseProgress progressData={progressData} />
          )}
          {currentView === 'checkins' && (
            <CheckIns
              checkIns={checkIns}
              onAddCheckIn={handleAddCheckIn}
              onDeleteCheckIn={handleDeleteCheckIn}
            />
          )}
          {currentView === 'import' && (
            <ImportWorkout onImport={handleImport} />
          )}
        </>
      )}

      <div className="mt-8 pt-8 border-t border-border text-center space-y-4">
        <div className="bg-muted/30 p-4 rounded-lg inline-block text-left max-w-md mx-auto">
          <h4 className="text-sm font-semibold mb-2">📲 ¿Cómo descargar la App?</h4>
          <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-1">
            <li>Abre esta página en <strong>Chrome (Android)</strong> o <strong>Safari (iOS)</strong>.</li>
            <li>Toca el menú de opciones (tres puntos o botón compartir).</li>
            <li>Selecciona <strong>"Agregar a la pantalla principal"</strong> o "Instalar App".</li>
            <li>¡Listo! Ahora funcionará como una aplicación nativa.</li>
          </ol>
        </div>

        <div>
          <button
            onClick={handleResetData}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Restablecer datos de ejemplo
          </button>
        </div>
      </div>
    </Layout>
  );
}
