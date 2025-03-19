import { useState, useRef } from 'react';
import type { Exercise } from '../types.ts';
import Timer from './Timer.tsx';

interface WorkoutViewProps {
  exercises: Exercise[];
}

export default function WorkoutView({ exercises }: WorkoutViewProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // Minimum swipe distance for exercise navigation
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setCurrentSet(1);
    }
    if (isRightSwipe && currentExercise > 0) {
      setCurrentExercise(prev => prev - 1);
      setCurrentSet(1);
    }

    touchStart.current = null;
    touchEnd.current = null;
  };

  const handleScreenTap = (e: React.MouseEvent) => {
    const { clientX } = e;
    const screenWidth = window.innerWidth;
    
    // Right side tap
    if (clientX > screenWidth / 2) {
      if (currentSet < exercises[currentExercise].sets) {
        setCurrentSet(prev => prev + 1);
      } else if (currentExercise < exercises.length - 1) {
        setCurrentExercise(prev => prev + 1);
        setCurrentSet(1);
      }
    }
    // Left side tap
    else {
      if (currentSet > 1) {
        setCurrentSet(prev => prev - 1);
      } else if (currentExercise > 0) {
        setCurrentExercise(prev => prev - 1);
        setCurrentSet(exercises[currentExercise - 1].sets);
      }
    }
  };

  const exercise = exercises[currentExercise];
  const isTimeBased = typeof exercise.reps === 'string';

  return (
    <div 
      className="h-screen w-screen bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleScreenTap}
    >
      {/* Video Background */}
      {exercise.video && (
        <div className="absolute inset-0 z-0">
          <video 
            src={exercise.video} 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
          />
        </div>
      )}

      {/* Exercise Info Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10">
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <h2 className="text-2xl font-bold">{exercise.exercise}</h2>
            <p className="text-lg">Set {currentSet} of {exercise.sets}</p>
          </div>

          <div className="text-center text-4xl font-bold">
            {isTimeBased ? (
              <Timer duration={exercise.reps.toString()} onComplete={() => {
                // Auto advance after timer completes
                if (currentSet < exercise.sets) {
                  setCurrentSet(prev => prev + 1);
                }
              }} />
            ) : (
              <div>{exercise.reps} reps</div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ 
                width: `${(currentExercise * exercise.sets + currentSet) / 
                  (exercises.length * exercise.sets) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 