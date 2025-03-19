import { useState, useRef, useEffect } from 'react';
import type { Exercise } from '../types.ts';
import Timer from './Timer.tsx';
import MetricsForm from './MetricsForm.tsx';

interface WorkoutViewProps {
  exercises: Exercise[];
}

enum WorkoutPhase {
  Warmup = 'warmup',
  Rest = 'rest',
  Active = 'active',
  Tracking = 'tracking',
}

type WorkoutState = {
  phase: WorkoutPhase;
  currentExercise: number;
  currentSet: number;
  restProgress: number;
  metricData: { [key: string]: number };
}

export default function WorkoutView({ exercises }: WorkoutViewProps) {
  const [workoutState, setWorkoutState] = useState<WorkoutState>({
    phase: WorkoutPhase.Warmup,
    currentExercise: 0,
    currentSet: 1,
    restProgress: 100,
    metricData: {},
  });

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // Minimum swipe distance for exercise navigation
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    // if (workoutState.phase === WorkoutPhase.Tracking) return;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // if (workoutState.phase === WorkoutPhase.Tracking) return;
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    // if (workoutState.phase === WorkoutPhase.Tracking || workoutState.phase === WorkoutPhase.Warmup) return;
    if (touchStart.current === null || touchEnd.current === null) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && workoutState.currentExercise < exercises.length - 1) {
      setWorkoutState(prevState => ({
        ...prevState,
        currentExercise: prevState.currentExercise + 1,
        currentSet: 1,
      }));
    }
    if (isRightSwipe && workoutState.currentExercise > 0) {
      setWorkoutState(prevState => ({
        ...prevState,
        currentExercise: prevState.currentExercise - 1,
        currentSet: 1,
      }));
    }
    touchStart.current = null;
    touchEnd.current = null;
  };

  const startRestPhase = () => {
    setWorkoutState(prevState => ({
      ...prevState,
      phase: WorkoutPhase.Rest,
      restProgress: 100,
    }));
  };

  const completeRestPhase = () => {
    setWorkoutState(prevState => {
      const exercise = exercises[prevState.currentExercise];
      // If more sets remain in the exercise, simply advance the set.
      if (prevState.currentSet < exercise.sets) {
        return {
          ...prevState,
          phase: WorkoutPhase.Active,
          currentSet: prevState.currentSet + 1,
          restProgress: 100,
        };
      } else {
        // End of the exercise: prepare and show the tracking view.
        
        return {
          ...prevState,
          phase: WorkoutPhase.Tracking,
          restProgress: 100,
          metricData: {},
        };
      }
    });
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (workoutState.phase === WorkoutPhase.Rest) {
      const startTime = Date.now();
      const exercise = exercises[workoutState.currentExercise];
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000; // seconds
        const newProgress = Math.max(100 - (elapsed / exercise.rest) * 100, 0);
        setWorkoutState(prevState => ({
          ...prevState,
          restProgress: newProgress,
        }));
        if (elapsed >= exercise.rest) {
          clearInterval(interval);
          completeRestPhase();
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [workoutState.phase, workoutState.currentExercise, exercises]);

  const handleScreenTap = (e: React.MouseEvent) => {
    // if (workoutState.phase === WorkoutPhase.Tracking) return;

    const { clientX } = e;
    const screenWidth = window.innerWidth;

    // Tapping on the right side ends the active phase (or skips remaining rest).
    if (clientX > screenWidth / 2) {
      if (workoutState.phase === WorkoutPhase.Rest) {
        completeRestPhase();
        return;
      }
      if (workoutState.phase === WorkoutPhase.Active) {
        startRestPhase();
        return;
      }
      // if (workoutState.phase === WorkoutPhase.Tracking) {
      //   setWorkoutState(prevState => ({
      //     ...prevState,
      //     exercise: exercises[prevState.currentExercise + 1],
      //     currentExercise: prevState.currentExercise + 1,
      //     currentSet: 1,
      //     phase: WorkoutPhase.Active,
      //   }));
      //   return;
      // }
      if (workoutState.phase === WorkoutPhase.Warmup) {
        setWorkoutState(prevState => ({
          ...prevState,
          phase: WorkoutPhase.Active,
        }));
        return;
      }
    } else {
      // Tapping on the left side navigates backwards.
      if (workoutState.phase === WorkoutPhase.Rest) {
        setWorkoutState(prevState => ({
          ...prevState,
          phase: WorkoutPhase.Active,
        }));
        return;
      }
      if (workoutState.phase === WorkoutPhase.Active) {
        if (workoutState.currentSet > 1) {
          setWorkoutState(prevState => ({
            ...prevState,
            currentSet: prevState.currentSet - 1,
          }));
        } else if (workoutState.currentExercise > 0) {
          const previousExercise = exercises[workoutState.currentExercise - 1];
          setWorkoutState(prevState => ({
            ...prevState,
            currentExercise: prevState.currentExercise - 1,
            currentSet: previousExercise.sets,
          }));
        } else {
          setWorkoutState(prevState => ({
            ...prevState,
            phase: WorkoutPhase.Warmup,
          }));
        }
      }
    }
  };

  const exercise = exercises[workoutState.currentExercise];
  const isTimeBased = typeof exercise.reps === 'string';

  const handleTrackingSubmit = (inputData: { [key: string]: number }) => {
    console.log("Tracking data for exercise:", exercise.exercise, inputData);
    setWorkoutState(prevState => {
      if (prevState.currentExercise < exercises.length - 1) {
        return {
          phase: WorkoutPhase.Active,
          currentExercise: prevState.currentExercise + 1,
          currentSet: 1,
          restProgress: 100,
          metricData: inputData,
        };
      } else {
        console.log("Workout complete!");
        return prevState;  // Alternatively, you may want to reset or navigate away.
      }
    });
  };

  return (
    <div 
      className="h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleScreenTap}
    >
      {/* Background */}
      {workoutState.phase === WorkoutPhase.Rest ? (
        <div className="absolute inset-0 z-0 bg-gray-800"></div>
      ) : (
        exercise.video && (
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
        )
      )}

      {/* Exercise Info Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10">
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <h2 className="text-4xl font-bold">{exercise.exercise}</h2>
            {workoutState.phase === WorkoutPhase.Warmup ? (
              <p className="text-2xl">Warmup</p>
            ) : (
              <p className="text-2xl">Set {workoutState.currentSet} of {exercise.sets}</p>
            )}
          </div>

          <div className="text-center text-4xl font-bold">
            {workoutState.phase === WorkoutPhase.Rest ? (
              <div>Rest: {Math.ceil((exercise.rest * workoutState.restProgress) / 100)} sec</div>
            ) : 
              workoutState.phase === WorkoutPhase.Warmup ? (
                <p className="text-4xl">Warmup</p>
              ) : (
                isTimeBased ? (
                  <Timer 
                    duration={exercise.reps.toString()} 
                  onComplete={() => {
                    if (workoutState.phase === WorkoutPhase.Active) {
                      startRestPhase();
                    }
                  }} 
                />
              ) : (
                <div>{exercise.reps} reps</div>
              )
            )}
          </div>

          {/* Multi-level Progress Bars */}
          <div className="flex flex-col gap-2">
            {/* Individual phase progress bars */}
            <div className="flex gap-2">
              {Array.from({ length: workoutState.phase === WorkoutPhase.Warmup ? 1 : exercise.sets }, (_, index) => {
                if (index < workoutState.currentSet - 1) {
                  return (
                    <div key={index} className="flex-1 h-2 bg-gray-300 rounded-full">
                      <div className="h-full rounded-full bg-white" style={{ width: '100%' }} />
                    </div>
                  );
                } else if (index === workoutState.currentSet - 1) {
                  return (
                    <div key={index} className="flex-1 h-2 bg-gray-300 rounded-full">
                      {workoutState.phase === WorkoutPhase.Rest ? (
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${workoutState.restProgress}%` }}
                        />
                      ) : workoutState.phase === WorkoutPhase.Warmup ? (
                        <div
                          className="h-full rounded-full bg-red-500 animate-pulse transition-colors duration-300"
                          style={{ width: '100%' }}
                        />
                      ) : (
                        <div
                          className="h-full rounded-full bg-yellow-500 animate-pulse transition-colors duration-300"
                          style={{ width: '100%' }}
                        />
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="flex-1 h-2 bg-gray-300 rounded-full">
                      <div
                        className="h-full rounded-full bg-gray-500"
                        style={{ width: '100%' }}
                      />
                    </div>
                  );
                }
              })}
            </div>

            {/* Whole workout progress bar */}
            <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ 
                  width: `${((workoutState.currentExercise * exercise.sets) + workoutState.currentSet) / (exercises.length * exercise.sets) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tracking View Overlay */}
      {workoutState.phase === WorkoutPhase.Tracking && (
        <MetricsForm 
          exercise={exercise}
          onSubmit={handleTrackingSubmit}
        />
      )}
    </div>
  );
} 