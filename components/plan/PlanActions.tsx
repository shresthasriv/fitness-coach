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
  const [playingSection, setPlayingSection] = useState<"workout" | "diet" | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [generatingSection, setGeneratingSection] = useState<"workout" | "diet" | null>(null);

  const handleTextToSpeech = async (section: "workout" | "diet") => {
    // Stop if currently playing this section
    if (playingSection === section && currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingSection(null);
      return;
    }

    // Stop any other audio that's playing
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingSection(null);
    }

    setGeneratingSection(section);
    try {
      let text = "";

      if (section === "workout") {
        text += `Workout Plan. ${plan.workoutPlan.weeklySchedule}. `;
        plan.workoutPlan.workouts.forEach((workout) => {
          text += `${workout.day}. ${workout.focus}. `;
          workout.exercises.forEach((exercise) => {
            text += `${exercise.name}. ${exercise.sets} sets of ${exercise.reps} repetitions. `;
          });
        });
      }

      if (section === "diet") {
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
        setPlayingSection(null);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      setCurrentAudio(audio);
      setPlayingSection(section);
      audio.play();
      toast.success(`Playing ${section} plan`);
    } catch (error) {
      console.error("Error generating speech:", error);
      toast.error("Failed to generate speech");
    } finally {
      setGeneratingSection(null);
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
        disabled={generatingSection !== null}
      >
        {playingSection === "workout" ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
        {generatingSection === "workout" ? "Generating..." : playingSection === "workout" ? "Stop Workout" : "Read Workout"}
      </Button>

      <Button
        onClick={() => handleTextToSpeech("diet")}
        variant="outline"
        size="lg"
        disabled={generatingSection !== null}
      >
        {playingSection === "diet" ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
        {generatingSection === "diet" ? "Generating..." : playingSection === "diet" ? "Stop Diet" : "Read Diet"}
      </Button>

      <Button onClick={onRegenerate} variant="outline" size="lg">
        <RefreshCw className="h-4 w-4 mr-2" />
        Regenerate Plan
      </Button>
    </div>
  );
}
