import React, { useState } from 'react';
import { ProgressData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';

interface ExerciseProgressProps {
  progressData: ProgressData[];
}

export function ExerciseProgress({ progressData }: ExerciseProgressProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const toggleExpand = (name: string) => {
    setExpandedExercise(expandedExercise === name ? null : name);
  };

  if (progressData.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay datos de progreso suficientes. Registra al menos dos entrenamientos para ver tendencias.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Progreso por Ejercicio</h2>
        <p className="text-muted-foreground">Analiza tu evolución de fuerza semana a semana.</p>
      </div>

      <div className="grid gap-4">
        {progressData.map((data) => (
          <div key={data.exerciseName} className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/50">
            <div 
              className="p-6 cursor-pointer flex items-center justify-between"
              onClick={() => toggleExpand(data.exerciseName)}
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{data.exerciseName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Inicio: {data.startWeight}kg</span>
                    <span>→</span>
                    <span>Actual: {data.currentWeight}kg</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className={`text-right ${data.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  <div className="text-2xl font-bold">
                    {data.percentageChange > 0 ? '+' : ''}{data.percentageChange.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Mejora Total</div>
                </div>
                {expandedExercise === data.exerciseName ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedExercise === data.exerciseName && (
              <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="h-[300px] w-full mt-4 bg-muted/20 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#888" 
                        tickFormatter={(date) => format(new Date(date), 'd MMM', { locale: es })}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#888" 
                        tick={{ fontSize: 12 }}
                        domain={['dataMin - 5', 'dataMax + 5']}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff' }}
                        labelFormatter={(date) => format(new Date(date), "d 'de' MMMM", { locale: es })}
                        formatter={(value: number) => [`${value} kg`, 'Peso Máximo']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#bef264" 
                        strokeWidth={3}
                        activeDot={{ r: 6, fill: '#bef264' }}
                        name="Peso Máximo (kg)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.history.map((entry, index) => (
                    <div key={index} className="bg-muted/30 p-3 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        {format(new Date(entry.date), 'd MMM', { locale: es })}
                      </div>
                      <div className="font-mono font-bold text-lg text-foreground">
                        {entry.weight} <span className="text-xs font-normal text-muted-foreground">kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
