"use client";

import { WorkoutPlan as WorkoutPlanType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

interface WorkoutPlanProps {
  workoutPlan: WorkoutPlanType;
  onExerciseClick?: (exerciseName: string) => void;
}

export default function WorkoutPlan({ workoutPlan, onExerciseClick }: WorkoutPlanProps) {
  return (
    <div className="space-y-6">
      <div className="bg-primary/10 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Weekly Schedule</h3>
        <p className="text-sm text-muted-foreground">{workoutPlan.weeklySchedule}</p>
      </div>

      <div className="grid gap-4">
        {workoutPlan.workouts.map((workout, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5" />
                      {workout.day}
                    </CardTitle>
                    <CardDescription>{workout.focus}</CardDescription>
                  </div>
                  <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                    {workout.totalDuration}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workout.exercises.map((exercise, exIndex) => (
                    <div
                      key={exIndex}
                      onClick={() => onExerciseClick?.(exercise.name)}
                      className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{exercise.name}</h4>
                        {exercise.muscleGroup && (
                          <span className="text-xs bg-secondary px-2 py-1 rounded">
                            {exercise.muscleGroup}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                        <div>
                          <span className="text-muted-foreground">Sets:</span>
                          <span className="ml-1 font-medium">{exercise.sets}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Reps:</span>
                          <span className="ml-1 font-medium">{exercise.reps}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rest:</span>
                          <span className="ml-1 font-medium">{exercise.rest}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
