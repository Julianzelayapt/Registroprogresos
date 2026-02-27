import React from 'react';
import { Dumbbell, LayoutDashboard, PlusCircle, TrendingUp, Camera } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'progress' | 'import';
  onNavigate: (view: 'dashboard' | 'progress' | 'import') => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar / Mobile Header */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border p-4 flex flex-col gap-6 sticky top-0 z-10">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">FitProgress</h1>
        </div>

        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              currentView === 'dashboard' 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              currentView === 'progress' 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <TrendingUp className="w-4 h-4" />
            Progreso
          </button>
          <button
            onClick={() => onNavigate('checkins')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              currentView === 'checkins' 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Camera className="w-4 h-4" />
            Check-Ins
          </button>
          <button
            onClick={() => onNavigate('import')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              currentView === 'import' 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <PlusCircle className="w-4 h-4" />
            Importar Email
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// Helper for cn since I can't import it from types.ts if it's not exported or if I messed up.
// Actually, let's fix the import. I'll just redefine it here if needed, but I think I exported it.
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
