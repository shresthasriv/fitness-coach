"use client";

import { useState } from "react";
import { WorkoutPlan as WorkoutPlanType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { Dumbbell, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkoutPlanProps {
  workoutPlan: WorkoutPlanType;
  onExerciseClick?: (exerciseName: string) => void;
}

export default function WorkoutPlan({ workoutPlan, onExerciseClick }: WorkoutPlanProps) {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Weekly Schedule</h3>
        <p className="text-sm text-muted-foreground">{workoutPlan.weeklySchedule}</p>
      </div>

      <div className="grid gap-4">
        {workoutPlan.workouts.map((workout, index) => (
          <BlurFade
            key={index}
            delay={index * 0.1}
            inView
          >
            <Card>
              <CardHeader
                className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-xl"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5" />
                      {workout.day}
                    </CardTitle>
                    <CardDescription>{workout.focus}</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                      {workout.totalDuration}
                    </span>
                    {expandedIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
