import { FitnessPlan, SavedPlan } from "./types";

const STORAGE_KEY = "fitness_plans";
const CURRENT_PLAN_KEY = "current_fitness_plan";
const THEME_KEY = "fitness_app_theme";

export function savePlan(plan: FitnessPlan): void {
  try {
    const savedPlans = getSavedPlans();
    const newSavedPlan: SavedPlan = {
      id: Date.now().toString(),
      plan,
      savedAt: new Date().toISOString(),
    };

    savedPlans.push(newSavedPlan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans));
    setCurrentPlan(plan);
  } catch (error) {
    console.error("Error saving plan:", error);
  }
}

export function getSavedPlans(): SavedPlan[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting saved plans:", error);
    return [];
  }
}

export function deletePlan(id: string): void {
  try {
    const savedPlans = getSavedPlans();
    const filtered = savedPlans.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting plan:", error);
  }
}

export function clearAllPlans(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_PLAN_KEY);
  } catch (error) {
    console.error("Error clearing plans:", error);
  }
}

export function setCurrentPlan(plan: FitnessPlan): void {
  try {
    localStorage.setItem(CURRENT_PLAN_KEY, JSON.stringify(plan));
  } catch (error) {
    console.error("Error setting current plan:", error);
  }
}

export function getCurrentPlan(): FitnessPlan | null {
  try {
    const data = localStorage.getItem(CURRENT_PLAN_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting current plan:", error);
    return null;
  }
}

export function saveTheme(theme: "light" | "dark"): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error("Error saving theme:", error);
  }
}

export function getTheme(): "light" | "dark" | null {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return theme as "light" | "dark" | null;
  } catch (error) {
    console.error("Error getting theme:", error);
    return null;
  }
}

const IMAGES_CACHE_KEY = "fitness_images_cache";

export interface CachedImage {
  prompt: string;
  url: string;
  cachedAt: string;
}

export function cacheImage(prompt: string, url: string): void {
  try {
    const cache = getImageCache();
    cache[prompt] = {
      prompt,
      url,
      cachedAt: new Date().toISOString(),
    };
    localStorage.setItem(IMAGES_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Error caching image:", error);
  }
}

export function getImageCache(): Record<string, CachedImage> {
  try {
    const data = localStorage.getItem(IMAGES_CACHE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error getting image cache:", error);
    return {};
  }
}

export function getCachedImage(prompt: string): string | null {
  try {
    const cache = getImageCache();
    return cache[prompt]?.url || null;
  } catch (error) {
    console.error("Error getting cached image:", error);
    return null;
  }
}
