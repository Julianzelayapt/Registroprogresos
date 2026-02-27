import React from 'react';
import { Workout, ProgressData } from '../types';
import { TrendingUp, Calendar, Dumbbell, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardProps {
  workouts: Workout[];
  progressData: ProgressData[];
}

export function Dashboard({ workouts, progressData }: DashboardProps) {
  // Calculate total progress (average of all percentage changes)
  const totalProgress = progressData.length > 0
    ? progressData.reduce((acc, curr) => acc + curr.percentageChange, 0) / progressData.length
    : 0;

  // Find top gain
  const topGain = progressData.length > 0
    ? progressData.reduce((prev, current) => (prev.percentageChange > current.percentageChange) ? prev : current)
    : null;

  // Recent workouts (last 3)
  const recentWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Resumen de progreso y entrenamientos recientes.</p>
        <p className="text-sm text-muted-foreground/80 italic">
          Tip: Importa tus reportes de email para actualizar tu progreso.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Progreso Total (Mes)</h3>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-foreground">+{totalProgress.toFixed(1)}%</div>
            <span className="text-xs text-muted-foreground">promedio general</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Mejor Mejora</h3>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-foreground">
              {topGain ? `+${topGain.percentageChange.toFixed(1)}%` : 'N/A'}
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {topGain ? topGain.exerciseName : 'Sin datos suficientes'}
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Entrenamientos</h3>
            <Dumbbell className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-foreground">{workouts.length}</div>
            <span className="text-xs text-muted-foreground">registrados este mes</span>
          </div>
        </div>
      </div>

      {/* Recent Workouts List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">Entrenamientos Recientes</h3>
        <div className="grid gap-4">
          {recentWorkouts.map((workout) => (
            <div key={workout.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{workout.routineName}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {format(new Date(workout.date), "EEEE, d 'de' MMMM", { locale: es })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{workout.exercises.length} Ejercicios</div>
                <div className="text-xs text-muted-foreground">
                  {workout.rating} ⭐
                </div>
              </div>
            </div>
          ))}
          {recentWorkouts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay entrenamientos registrados. Importa un email para comenzar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
