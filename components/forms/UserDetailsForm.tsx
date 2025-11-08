"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { UserFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(13, "Must be at least 13 years old").max(100, "Invalid age"),
  gender: z.enum(["male", "female", "other"]),
  height: z.number().min(100, "Height must be at least 100cm").max(250, "Invalid height"),
  weight: z.number().min(30, "Weight must be at least 30kg").max(300, "Invalid weight"),
  fitnessGoal: z.enum(["weight_loss", "muscle_gain", "general_fitness", "endurance", "flexibility"]),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
  workoutLocation: z.enum(["home", "gym", "outdoor"]),
  dietaryPreference: z.enum(["vegetarian", "non_vegetarian", "vegan", "keto"]),
  medicalHistory: z.string().optional(),
  stressLevel: z.enum(["low", "medium", "high"]).optional(),
});

interface UserDetailsFormProps {
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

export default function UserDetailsForm({ onSubmit, isLoading }: UserDetailsFormProps) {
  const [formStep, setFormStep] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
      fitnessGoal: "general_fitness",
      fitnessLevel: "beginner",
      workoutLocation: "home",
      dietaryPreference: "vegetarian",
    },
  });

  const formValues = watch();

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Create Your Fitness Plan</CardTitle>
        <CardDescription>Fill in your details to get a personalized workout and diet plan</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your name"
                  disabled={isLoading}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  placeholder="Enter your age"
                  disabled={isLoading}
                />
                {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formValues.gender}
                  onValueChange={(value) => setValue("gender", value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  {...register("height", { valueAsNumber: true })}
                  placeholder="170"
                  disabled={isLoading}
                />
                {errors.height && <p className="text-sm text-red-500">{errors.height.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  {...register("weight", { valueAsNumber: true })}
                  placeholder="70"
                  disabled={isLoading}
                />
                {errors.weight && <p className="text-sm text-red-500">{errors.weight.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                <Select
                  value={formValues.fitnessGoal}
                  onValueChange={(value) => setValue("fitnessGoal", value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="general_fitness">General Fitness</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Fitness Level</Label>
                <Select
                  value={formValues.fitnessLevel}
                  onValueChange={(value) => setValue("fitnessLevel", value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workoutLocation">Workout Location</Label>
                <Select
                  value={formValues.workoutLocation}
                  onValueChange={(value) => setValue("workoutLocation", value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryPreference">Dietary Preference</Label>
                <Select
                  value={formValues.dietaryPreference}
                  onValueChange={(value) => setValue("dietaryPreference", value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stressLevel">Stress Level (Optional)</Label>
              <Select
                value={formValues.stressLevel}
                onValueChange={(value) => setValue("stressLevel", value as any)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stress level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
              <Textarea
                id="medicalHistory"
                {...register("medicalHistory")}
                placeholder="Any injuries, conditions, or medical concerns..."
                rows={4}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Generating Your Plan..." : "Generate My Fitness Plan"}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
