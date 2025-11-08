"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserDetailsForm from "@/components/forms/UserDetailsForm";
import WorkoutPlan from "@/components/plan/WorkoutPlan";
import DietPlan from "@/components/plan/DietPlan";
import AITips from "@/components/plan/AITips";
import PlanActions from "@/components/plan/PlanActions";
import ImageModal from "@/components/ImageModal";
import { AnimatedThemeToggler } from "@/components/AnimatedThemeToggler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FitnessPlan, UserFormData } from "@/lib/types";
import { savePlan, getCurrentPlan } from "@/lib/storage";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import jsPDF from "jspdf";

export default function Home() {
  const [currentPlan, setCurrentPlan] = useState<FitnessPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [imageModal, setImageModal] = useState<{ isOpen: boolean; prompt: string; title: string }>({
    isOpen: false,
    prompt: "",
    title: "",
  });
  const [motivationQuote, setMotivationQuote] = useState<string>("");

  useEffect(() => {
    const saved = getCurrentPlan();
    if (saved) {
      setCurrentPlan(saved);
      setShowForm(false);
    }
    loadMotivationQuote();
  }, []);

  const loadMotivationQuote = async () => {
    try {
      const response = await fetch("/api/motivation");
      const data = await response.json();
      if (data.success) {
        setMotivationQuote(data.data.quote);
      }
    } catch (error) {
      console.error("Error loading motivation:", error);
    }
  };

  const handleFormSubmit = async (userData: UserFormData) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to generate plan");

      const data = await response.json();
      if (data.success && data.data) {
        setCurrentPlan(data.data);
        savePlan(data.data);
        setShowForm(false);
        toast.success("Your personalized fitness plan is ready!");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Failed to generate fitness plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setCurrentPlan(null);
    setShowForm(true);
  };

  const handleExerciseClick = (exerciseName: string) => {
    setImageModal({
      isOpen: true,
      prompt: exerciseName,
      title: exerciseName,
    });
  };

  const handleMealClick = (mealName: string) => {
    setImageModal({
      isOpen: true,
      prompt: mealName,
      title: mealName,
    });
  };

  const handleExportPDF = () => {
    if (!currentPlan) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    pdf.setFontSize(20);
    pdf.text("Fitness Plan", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.text(`Name: ${currentPlan.userData.name}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Generated: ${new Date(currentPlan.generatedAt).toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(16);
    pdf.text("Workout Plan", 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    currentPlan.workoutPlan.workouts.forEach((workout) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(12);
      pdf.text(`${workout.day} - ${workout.focus}`, 20, yPosition);
      yPosition += 7;
      pdf.setFontSize(10);
      workout.exercises.forEach((exercise) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`  ${exercise.name}: ${exercise.sets} sets x ${exercise.reps}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    });

    pdf.addPage();
    yPosition = 20;
    pdf.setFontSize(16);
    pdf.text("Diet Plan", 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.text(`Daily Calories: ${currentPlan.dietPlan.dailyCalories}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Daily Protein: ${currentPlan.dietPlan.dailyProtein}`, 20, yPosition);
    yPosition += 10;

    const meals = [
      { name: "Breakfast", data: currentPlan.dietPlan.meals.breakfast },
      { name: "Lunch", data: currentPlan.dietPlan.meals.lunch },
      { name: "Dinner", data: currentPlan.dietPlan.meals.dinner },
    ];

    meals.forEach((meal) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(12);
      pdf.text(`${meal.name}: ${meal.data.name}`, 20, yPosition);
      yPosition += 7;
      pdf.setFontSize(10);
      pdf.text(`Calories: ${meal.data.calories}, Protein: ${meal.data.protein}`, 25, yPosition);
      yPosition += 10;
    });

    pdf.save(`FitnessPlan_${currentPlan.userData.name}_${Date.now()}.pdf`);
    toast.success("PDF exported successfully!");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <AnimatedThemeToggler className="h-10 w-10 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center transition-colors" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Fitness Coach
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personalized workout and nutrition plan, powered by AI
          </p>
        </motion.div>

        {motivationQuote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
              <p className="text-lg font-medium italic">{motivationQuote}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {showForm || !currentPlan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <UserDetailsForm onSubmit={handleFormSubmit} isLoading={isGenerating} />
            </motion.div>
          ) : (
            <motion.div
              key="plan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-center">
                <PlanActions
                  plan={currentPlan}
                  onRegenerate={handleRegenerate}
                  onExportPDF={handleExportPDF}
                />
              </div>

              <Tabs defaultValue="workout" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="workout">Workout Plan</TabsTrigger>
                  <TabsTrigger value="diet">Diet Plan</TabsTrigger>
                  <TabsTrigger value="tips">AI Tips</TabsTrigger>
                </TabsList>

                <TabsContent value="workout" className="mt-6">
                  <WorkoutPlan
                    workoutPlan={currentPlan.workoutPlan}
                    onExerciseClick={handleExerciseClick}
                  />
                </TabsContent>

                <TabsContent value="diet" className="mt-6">
                  <DietPlan dietPlan={currentPlan.dietPlan} onMealClick={handleMealClick} />
                </TabsContent>

                <TabsContent value="tips" className="mt-6">
                  <AITips tips={currentPlan.tips} motivation={currentPlan.motivation} />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={() => setImageModal({ ...imageModal, isOpen: false })}
        prompt={imageModal.prompt}
        title={imageModal.title}
      />
    </main>
  );
}
