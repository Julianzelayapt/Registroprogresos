import React, { useState, useRef } from 'react';
import { CheckIn } from '../types';
import { Camera, Calendar, Save, Trash2, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '../lib/supabase';

interface CheckInsProps {
  checkIns: CheckIn[];
  onAddCheckIn: (checkIn: CheckIn) => void;
  onDeleteCheckIn: (id: string) => void;
}

export function CheckIns({ checkIns, onAddCheckIn, onDeleteCheckIn }: CheckInsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const uploadPromises = (Array.from(files) as File[]).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `checkins/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('progress-photos')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          return null;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('progress-photos')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      const filteredUrls = urls.filter((url): url is string => url !== null);
      setSelectedImages(prev => [...prev, ...filteredUrls]);
    }
  };

  const handleSave = () => {
    if (!notes && selectedImages.length === 0) return;

    const newCheckIn: CheckIn = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      notes,
      photos: selectedImages
    };

    onAddCheckIn(newCheckIn);
    setIsAdding(false);
    setNotes('');
    setSelectedImages([]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Check-Ins & Fotos</h2>
          <p className="text-muted-foreground">Registra tus cambios visuales y sensaciones.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {isAdding ? 'Cancelar' : 'Nuevo Check-In'}
          {isAdding ? <X className="ml-2 h-4 w-4" /> : <Plus className="ml-2 h-4 w-4" />}
        </button>
      </div>

      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mejoras / Cambios Notorios</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Me veo más definido en los hombros, la ropa me queda más holgada..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fotos de Progreso</label>
            <div className="flex flex-wrap gap-4">
              {selectedImages.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs">Agregar</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Nota: Las fotos se guardan en la nube (Supabase Storage).
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Check-In
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {checkIns.length === 0 && !isAdding ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay check-ins registrados. ¡Sube tu primera foto de progreso!
          </div>
        ) : (
          checkIns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((checkIn) => (
            <div key={checkIn.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    {format(new Date(checkIn.date), "d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteCheckIn(checkIn.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {checkIn.notes && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm italic text-foreground">"{checkIn.notes}"</p>
                  </div>
                )}

                {checkIn.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {checkIn.photos.map((photo, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-border bg-black">
                        <img
                          src={photo}
                          alt={`Progreso ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
