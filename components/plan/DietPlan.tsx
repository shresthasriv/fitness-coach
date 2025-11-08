"use client";

import { DietPlan as DietPlanType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Utensils, Coffee, Sun, Moon, Apple } from "lucide-react";

interface DietPlanProps {
  dietPlan: DietPlanType;
  onMealClick?: (mealName: string) => void;
}

export default function DietPlan({ dietPlan, onMealClick }: DietPlanProps) {
  const mealIcons = {
    breakfast: Coffee,
    lunch: Sun,
    dinner: Moon,
    snacks: Apple,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Daily Calories</p>
              <p className="text-2xl font-bold">{dietPlan.dailyCalories}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Daily Protein</p>
              <p className="text-2xl font-bold">{dietPlan.dailyProtein}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Hydration</p>
              <p className="text-2xl font-bold">{dietPlan.hydration}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Plan Type</p>
              <p className="text-lg font-bold">Custom</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {dietPlan.notes && (
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm">{dietPlan.notes}</p>
        </div>
      )}

      <div className="grid gap-4">
        {Object.entries(dietPlan.meals).map(([mealType, mealData], index) => {
          if (Array.isArray(mealData)) {
            return (
              <motion.div
                key={mealType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {mealIcons[mealType as keyof typeof mealIcons] && (
                        <span className="text-primary">
                          {(() => {
                            const Icon = mealIcons[mealType as keyof typeof mealIcons];
                            return <Icon className="h-5 w-5" />;
                          })()}
                        </span>
                      )}
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mealData.map((snack, snackIndex) => (
                        <div
                          key={snackIndex}
                          onClick={() => onMealClick?.(snack.name)}
                          className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                        >
                          <h4 className="font-semibold mb-2">{snack.name}</h4>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {snack.items.map((item: string, itemIndex: number) => (
                              <span key={itemIndex} className="text-xs bg-secondary px-2 py-1 rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Cal:</span>
                              <span className="ml-1">{snack.calories}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">P:</span>
                              <span className="ml-1">{snack.protein}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">C:</span>
                              <span className="ml-1">{snack.carbs}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">F:</span>
                              <span className="ml-1">{snack.fats}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          }

          const meal = mealData;
          const Icon = mealIcons[mealType as keyof typeof mealIcons];

          return (
            <motion.div
              key={mealType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {Icon && <Icon className="h-5 w-5 text-primary" />}
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </CardTitle>
                  <CardDescription>{meal.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    onClick={() => onMealClick?.(meal.name)}
                    className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {meal.items.map((item: string, itemIndex: number) => (
                        <span key={itemIndex} className="text-sm bg-secondary px-3 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Calories:</span>
                        <p className="font-medium">{meal.calories}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Protein:</span>
                        <p className="font-medium">{meal.protein}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Carbs:</span>
                        <p className="font-medium">{meal.carbs}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fats:</span>
                        <p className="font-medium">{meal.fats}</p>
                      </div>
                    </div>
                    {meal.instructions && (
                      <p className="text-sm text-muted-foreground">{meal.instructions}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
