import { Workout } from '../types';

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: 'w1',
    clientName: 'YATEL',
    date: '2024-02-01T10:00:00Z',
    routineName: 'PRIME YATEL',
    rating: 5,
    feedback: 'Good start',
    exercises: [
      {
        name: 'PESO MUERTO',
        sets: [
          { reps: '10-12', weight: 30, unit: 'kg' },
          { reps: '10-12', weight: 30, unit: 'kg' },
          { reps: '10-12', weight: 30, unit: 'kg' },
          { reps: '10-12', weight: 30, unit: 'kg' }
        ]
      },
      {
        name: 'SENTADILLA HACK 45°',
        sets: [
          { reps: '10-12', weight: 30, unit: 'kg' },
          { reps: '10-12', weight: 30, unit: 'kg' },
          { reps: '10-12', weight: 30, unit: 'kg' },
          { reps: '10-12', weight: 30, unit: 'kg' }
        ]
      },
      {
        name: 'PRENSA PIERNAS',
        sets: [
          { reps: '12-14', weight: 80, unit: 'kg' },
          { reps: '12-14', weight: 80, unit: 'kg' },
          { reps: '10-12', weight: 90, unit: 'kg' },
          { reps: '10-12', weight: 90, unit: 'kg' }
        ]
      }
    ]
  },
  {
    id: 'w2',
    clientName: 'YATEL',
    date: '2024-02-08T10:00:00Z',
    routineName: 'PRIME YATEL',
    rating: 5,
    feedback: 'Feeling stronger',
    exercises: [
      {
        name: 'PESO MUERTO',
        sets: [
          { reps: '10-12', weight: 35, unit: 'kg' },
          { reps: '10-12', weight: 35, unit: 'kg' },
          { reps: '10-12', weight: 35, unit: 'kg' },
          { reps: '10-12', weight: 35, unit: 'kg' }
        ]
      },
      {
        name: 'SENTADILLA HACK 45°',
        sets: [
          { reps: '10-12', weight: 35, unit: 'kg' },
          { reps: '10-12', weight: 35, unit: 'kg' },
          { reps: '10-12', weight: 35, unit: 'kg' },
          { reps: '10-12', weight: 35, unit: 'kg' }
        ]
      },
      {
        name: 'PRENSA PIERNAS',
        sets: [
          { reps: '12-14', weight: 85, unit: 'kg' },
          { reps: '12-14', weight: 85, unit: 'kg' },
          { reps: '10-12', weight: 95, unit: 'kg' },
          { reps: '10-12', weight: 95, unit: 'kg' }
        ]
      }
    ]
  },
  {
    id: 'w3',
    clientName: 'YATEL',
    date: '2024-02-15T10:00:00Z', // The date from the prompt implies "Day 3" or similar, let's assume it's the latest
    routineName: 'PRIME YATEL',
    rating: 5,
    feedback: 'Sin comentarios',
    exercises: [
      {
        name: 'PESO MUERTO',
        sets: [
          { reps: '10-12', weight: 40, unit: 'kg' },
          { reps: '10-12', weight: 40, unit: 'kg' },
          { reps: '10-12', weight: 40, unit: 'kg' },
          { reps: '10-12', weight: 40, unit: 'kg' }
        ]
      },
      {
        name: 'SENTADILLA HACK 45°',
        sets: [
          { reps: '10-12', weight: 40, unit: 'kg' },
          { reps: '10-12', weight: 40, unit: 'kg' },
          { reps: '10-12', weight: 40, unit: 'kg' },
          { reps: '10-12', weight: 40, unit: 'kg' }
        ]
      },
      {
        name: 'EXTENSION DE PIERNAS',
        sets: [
          { reps: '10-12', weight: 40, unit: 'kg' },
          { reps: '10-12', weight: 40, unit: 'kg' },
          { reps: '8-10', weight: 45, unit: 'kg' },
          { reps: '8-10', weight: 45, unit: 'kg' }
        ],
        notes: 'Terminé con 45,12 repes'
      },
      {
        name: 'CURL TUMBADO',
        sets: [
          { reps: '12-15', weight: 20, unit: 'kg' },
          { reps: '12-15', weight: 20, unit: 'kg' },
          { reps: '12-15', weight: 20, unit: 'kg' }
        ]
      },
      {
        name: 'PRENSA PIERNAS',
        sets: [
          { reps: '12-14', weight: 90, unit: 'kg' },
          { reps: '12-14', weight: 90, unit: 'kg' },
          { reps: '10-12', weight: 100, unit: 'kg' },
          { reps: '10-12', weight: 100, unit: 'kg' }
        ],
        notes: 'La próxima semana 120'
      },
      {
        name: 'EXTENSION PANTORRILLAS',
        sets: [
          { reps: '14-16', weight: 60, unit: 'kg' },
          { reps: '14-16', weight: 60, unit: 'kg' },
          { reps: '14-16', weight: 60, unit: 'kg' }
        ],
        notes: 'La última 70'
      }
    ]
  }
];
