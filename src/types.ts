type metric = {
    name: string;
    units: string;
}

type Exercise = {
    exercise: string;
    sets: number;
    reps: number;
    rest: number;
    equipment: string | null;
    video: string | null;
    notes: string | null;
    perExerciseMetrics: metric[];
    perSetMetrics: metric[];
};

export type { Exercise };
