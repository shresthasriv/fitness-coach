"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Volume2, VolumeX, RefreshCw } from "lucide-react";
import { FitnessPlan } from "@/lib/types";
import { toast } from "sonner";

interface PlanActionsProps {
  plan: FitnessPlan;
  onRegenerate: () => void;
  onExportPDF: () => void;
}

export default function PlanActions({ plan, onRegenerate, onExportPDF }: PlanActionsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);

  const handleTextToSpeech = async (section: "workout" | "diet" | "all") => {
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
      return;
    }

    setIsGeneratingSpeech(true);
    try {
      let text = "";

      if (section === "workout" || section === "all") {
        text += `Workout Plan. ${plan.workoutPlan.weeklySchedule}. `;
        plan.workoutPlan.workouts.forEach((workout) => {
          text += `${workout.day}. ${workout.focus}. `;
          workout.exercises.forEach((exercise) => {
            text += `${exercise.name}. ${exercise.sets} sets of ${exercise.reps} repetitions. `;
          });
        });
      }

      if (section === "diet" || section === "all") {
        text += `Diet Plan. Daily calories: ${plan.dietPlan.dailyCalories}. `;
        text += `Breakfast: ${plan.dietPlan.meals.breakfast.name}. `;
        text += `Lunch: ${plan.dietPlan.meals.lunch.name}. `;
        text += `Dinner: ${plan.dietPlan.meals.dinner.name}. `;
      }

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to generate speech");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      setCurrentAudio(audio);
      setIsPlaying(true);
      audio.play();
      toast.success("Playing your plan");
    } catch (error) {
      console.error("Error generating speech:", error);
      toast.error("Failed to generate speech");
    } finally {
      setIsGeneratingSpeech(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onExportPDF} variant="outline" size="lg">
        <Download className="h-4 w-4 mr-2" />
        Export PDF
      </Button>

      <Button
        onClick={() => handleTextToSpeech("workout")}
        variant="outline"
        size="lg"
        disabled={isGeneratingSpeech}
      >
        {isPlaying ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
        {isGeneratingSpeech ? "Generating..." : "Read Workout"}
      </Button>

      <Button
        onClick={() => handleTextToSpeech("diet")}
        variant="outline"
        size="lg"
        disabled={isGeneratingSpeech}
      >
        {isPlaying ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
        {isGeneratingSpeech ? "Generating..." : "Read Diet"}
      </Button>

      <Button onClick={onRegenerate} variant="outline" size="lg">
        <RefreshCw className="h-4 w-4 mr-2" />
        Regenerate Plan
      </Button>
    </div>
  );
}
