import React, { useState } from 'react';
import { parseWorkoutEmail } from '../utils/parser';
import { Workout } from '../types';
import { CheckCircle, AlertCircle, FileText, ArrowRight, Mail, Info } from 'lucide-react';

interface ImportWorkoutProps {
  onImport: (workout: Workout) => void;
}

export function ImportWorkout({ onImport }: ImportWorkoutProps) {
  const [text, setText] = useState('');
  const [parsedWorkout, setParsedWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAutoInfo, setShowAutoInfo] = useState(false);

  const handleParse = () => {
    try {
      if (!text.trim()) {
        setError('Por favor pega el contenido del email primero.');
        return;
      }
      const workout = parseWorkoutEmail(text);
      if (workout.exercises.length === 0) {
        setError('No se encontraron ejercicios. Verifica el formato del texto.');
        return;
      }
      setParsedWorkout(workout);
      setError(null);
    } catch (err) {
      setError('Error al procesar el texto. Intenta nuevamente.');
      console.error(err);
    }
  };

  const handleConfirm = () => {
    if (parsedWorkout) {
      onImport(parsedWorkout);
      setText('');
      setParsedWorkout(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Importar Entrenamiento</h2>
        <p className="text-muted-foreground">Pega el reporte de email recibido para agregar un nuevo entrenamiento.</p>
        
        <div className="flex justify-center mt-2">
          <button 
            onClick={() => setShowAutoInfo(!showAutoInfo)}
            className="text-xs flex items-center gap-1 text-primary hover:underline"
          >
            <Info className="w-3 h-3" />
            ¿Cómo conectar mi email automáticamente?
          </button>
        </div>

        {showAutoInfo && (
          <div className="bg-card border border-primary/20 p-4 rounded-lg text-left text-sm space-y-2 animate-in fade-in slide-in-from-top-2 mt-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Opciones de Conexión
            </h4>
            <p className="text-muted-foreground">
              Actualmente, la forma más segura y privada es <strong>copiar y pegar</strong> el texto aquí.
            </p>
            <p className="text-muted-foreground">
              Para una conexión automática real, necesitaríamos integrar la <strong>API de Gmail</strong>. 
              Esto requeriría que inicies sesión con Google y concedas permisos para leer tus correos.
            </p>
            <div className="bg-muted p-2 rounded text-xs text-muted-foreground mt-2">
              <strong>Nota técnica:</strong> Si eres dueño del sistema que envía los correos (EmailJS), 
              podríamos configurar un "Webhook" para enviar los datos directamente a esta App sin pasar por el email.
            </div>
          </div>
        )}

        <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground text-left max-w-lg mx-auto border border-border/50 mt-4">
          <p className="font-semibold mb-1">Formato esperado:</p>
          <code className="block whitespace-pre-wrap font-mono">
            - NOMBRE EJERCICIO:<br/>
            Serie 1: 10-12 reps @ 40kg<br/>
            ...
          </code>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="space-y-2">
          <label htmlFor="email-content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Contenido del Email
          </label>
          <textarea
            id="email-content"
            className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono text-xs"
            placeholder="Pega aquí el texto del correo..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleParse}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <FileText className="mr-2 h-4 w-4" />
            Procesar Texto
          </button>
        </div>
      </div>

      {parsedWorkout && (
        <div className="bg-card border border-primary/50 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Vista Previa
            </h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              {parsedWorkout.exercises.length} Ejercicios Detectados
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">Cliente</span>
                <span className="font-medium">{parsedWorkout.clientName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Rutina</span>
                <span className="font-medium">{parsedWorkout.routineName}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              {parsedWorkout.exercises.map((ex, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                  <span className="font-medium">{ex.name}</span>
                  <span className="text-muted-foreground">{ex.sets.length} series (Max: {Math.max(...ex.sets.map(s => s.weight))}kg)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setParsedWorkout(null)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Confirmar e Importar
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
