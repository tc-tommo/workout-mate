
import type { Exercise } from "../types";

interface MetricsFormProps {
  exercise: Exercise;
  onSubmit: (inputData: { [key: string]: number }) => void;
}


export type FormData = {
    sets: Array<{
        [key: string]: number;
    }>;
}



export default function MetricsForm({ exercise, onSubmit }: MetricsFormProps) {

    const getFormValues = (exercise: Exercise) => {
        const ids = document.querySelectorAll('input');
        const formValues: FormData = {
            sets: []
        };
        const form = document.getElementById('metrics-form');
        form?.querySelectorAll('tr').forEach((row, rowIndex) => {  
            const setIndex = rowIndex;
            const setValues: { [key: string]: number } = {};
            row.querySelectorAll('td').forEach((cell, cellIndex) => {
                const metricName = exercise.perSetMetrics[cellIndex].name;
                setValues[metricName] = parseInt(cell.querySelector('input')?.value || '0');
            });
            formValues.sets.push(setValues);
        });
        return formValues;
    }
    
    
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black/70 p-4">
      <div className="bg-white text-black p-6 rounded shadow-md w-full max-w-3xl">
        <h3 className="text-xl font-bold mb-4">Exercise Metrics</h3>
        <div className="overflow-auto">
          <table className="w-full border-collapse" >
            <thead>
                {exercise.perExerciseMetrics?.map((metric, index) => (
                    <th key={index} className="px-4 py-2">{metric.name}</th>
                ))}
              <tr>
                <th className="px-4 py-2">Set</th>
                {exercise.perSetMetrics.map((metric, index) => (
                  <th key={index} className="px-4 py-2">{metric.name.charAt(0).toUpperCase() + metric.name.slice(1)}</th>
                ))}
              </tr>
            </thead>
            <tbody id="metrics-form">
              {Array.from({ length: exercise.sets }, (_, setIndex) => (
                <tr key={setIndex} className={`${setIndex % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}>
                    <td className="text-center">{setIndex + 1}</td>
                    {exercise.perSetMetrics.map((metric, metricIndex) => (
                        <td key={metricIndex} className="text-center">
                            <input 
                                type="text"
                                tabIndex={metricIndex + 1}
                                id={`${exercise.exercise}-${setIndex}-${metric.name}`}
                                value={exercise[metric.name as keyof Exercise]?.toString()}
                                onChange={(e) => {}}
                                className="w-3/4 p-1 m-1 text-center bg-white/50 rounded-md"
                            />
                        </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={() => onSubmit(getFormValues())}
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
        >
          Save &amp; Continue
        </button>
      </div>
    </div>
  );
}


