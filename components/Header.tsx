"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/AnimatedThemeToggler";
import { Download, Volume2, VolumeX, RefreshCw, Sparkles } from "lucide-react";
import { FitnessPlan } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useScroll } from "@/components/ui/use-scroll";

interface HeaderProps {
  plan?: FitnessPlan | null;
  onRegenerate?: () => void;
  onExportPDF?: () => void;
  motivationQuote?: string;
}

export function Header({ plan, onRegenerate, onExportPDF, motivationQuote }: HeaderProps) {
  const scrolled = useScroll(50);
  const [playingSection, setPlayingSection] = useState<"workout" | "diet" | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [generatingSection, setGeneratingSection] = useState<"workout" | "diet" | null>(null);

  const handleTextToSpeech = async (section: "workout" | "diet") => {
    if (!plan) return;

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
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-7xl transition-all duration-500 ease-in-out",
        {
          "bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-lg border border-border shadow-lg md:top-4 md:max-w-6xl md:rounded-2xl":
            scrolled,
          "bg-transparent border-b border-transparent": !scrolled,
        }
      )}
    >
      <nav
        className={cn(
          "flex h-16 w-full items-center justify-between px-6 transition-all duration-500 ease-in-out",
          {
            "md:px-6 md:h-14": scrolled,
          }
        )}
      >
        <div className="flex items-center gap-2 min-w-fit">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Fitness Coach
          </h1>
        </div>

        <div className="hidden lg:flex flex-1 justify-center px-8 max-w-2xl mx-auto overflow-hidden">
          <p
            className={cn(
              "text-sm text-muted-foreground italic text-center line-clamp-1 transition-all duration-500",
              {
                "opacity-0 translate-y-2": scrolled || !motivationQuote,
                "opacity-100 translate-y-0": !scrolled && motivationQuote,
              }
            )}
          >
            {motivationQuote && `"${motivationQuote}"`}
          </p>
        </div>

        <div className="flex items-center gap-3 min-w-fit">
          {plan && (
            <>
              <Button
                onClick={onExportPDF}
                variant="ghost"
                size={scrolled ? "sm" : "default"}
                className="hidden md:flex transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>

              <Button
                onClick={() => handleTextToSpeech("workout")}
                variant="ghost"
                size={scrolled ? "sm" : "default"}
                disabled={generatingSection !== null}
                className="hidden lg:flex transition-all duration-300"
              >
                {playingSection === "workout" ? (
                  <VolumeX className="h-4 w-4 mr-2" />
                ) : (
                  <Volume2 className="h-4 w-4 mr-2" />
                )}
                {generatingSection === "workout"
                  ? "..."
                  : playingSection === "workout"
                  ? "Stop"
                  : "Workout"}
              </Button>

              <Button
                onClick={() => handleTextToSpeech("diet")}
                variant="ghost"
                size={scrolled ? "sm" : "default"}
                disabled={generatingSection !== null}
                className="hidden lg:flex transition-all duration-300"
              >
                {playingSection === "diet" ? (
                  <VolumeX className="h-4 w-4 mr-2" />
                ) : (
                  <Volume2 className="h-4 w-4 mr-2" />
                )}
                {generatingSection === "diet"
                  ? "..."
                  : playingSection === "diet"
                  ? "Stop"
                  : "Diet"}
              </Button>

              <Button
                onClick={onRegenerate}
                variant="ghost"
                size={scrolled ? "sm" : "default"}
                className="hidden md:flex transition-all duration-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </>
          )}

          <AnimatedThemeToggler className="h-9 w-9 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center transition-colors" />
        </div>
      </nav>
    </header>
  );
}
