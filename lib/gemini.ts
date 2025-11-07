import { UserFormData, FitnessPlan } from "./types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_IMAGE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function generateFitnessPlan(userData: UserFormData): Promise<FitnessPlan> {
  const prompt = createFitnessPlanPrompt(userData);

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
  const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;

  const planData = JSON.parse(jsonText);

  return {
    ...planData,
    generatedAt: new Date().toISOString(),
    userData,
  };
}

function createFitnessPlanPrompt(userData: UserFormData): string {
  return `You are an expert fitness coach and nutritionist. Create a comprehensive, personalized fitness and diet plan based on the following user information:

Name: ${userData.name}
Age: ${userData.age}
Gender: ${userData.gender}
Height: ${userData.height} cm
Weight: ${userData.weight} kg
Fitness Goal: ${userData.fitnessGoal.replace("_", " ")}
Fitness Level: ${userData.fitnessLevel}
Workout Location: ${userData.workoutLocation}
Dietary Preference: ${userData.dietaryPreference.replace("_", " ")}
${userData.medicalHistory ? `Medical History: ${userData.medicalHistory}` : ""}
${userData.stressLevel ? `Stress Level: ${userData.stressLevel}` : ""}

Create a detailed plan in VALID JSON format with the following structure:

{
  "workoutPlan": {
    "weeklySchedule": "Brief overview of the weekly schedule",
    "workouts": [
      {
        "day": "Day 1 (e.g., Monday)",
        "focus": "Focus area (e.g., Upper Body)",
        "totalDuration": "Total time in minutes",
        "exercises": [
          {
            "name": "Exercise name",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "instructions": "Brief instructions",
            "muscleGroup": "Primary muscle group"
          }
        ]
      }
    ]
  },
  "dietPlan": {
    "dailyCalories": "Target calories",
    "dailyProtein": "Target protein in grams",
    "hydration": "Water intake recommendation",
    "notes": "Important dietary notes",
    "meals": {
      "breakfast": {
        "name": "Meal name",
        "items": ["Item 1", "Item 2"],
        "calories": "Approximate calories",
        "protein": "Protein content",
        "carbs": "Carbs content",
        "fats": "Fats content",
        "instructions": "Preparation tips"
      },
      "lunch": { },
      "dinner": { },
      "snacks": [
        {
          "name": "Snack name",
          "items": ["Item"],
          "calories": "Calories",
          "protein": "Protein",
          "carbs": "Carbs",
          "fats": "Fats"
        }
      ]
    }
  },
  "tips": {
    "lifestyle": ["Tip 1", "Tip 2", "Tip 3"],
    "posture": ["Posture tip 1", "Posture tip 2"],
    "recovery": ["Recovery tip 1", "Recovery tip 2"]
  },
  "motivation": "A personalized, inspiring motivational message for the user"
}

Important:
- Create 5-6 days of workouts suitable for ${userData.fitnessLevel} level
- Adjust exercises based on ${userData.workoutLocation}
- Ensure diet matches ${userData.dietaryPreference} preferences
- Consider the fitness goal of ${userData.fitnessGoal}
- Make it realistic and achievable
- Return ONLY valid JSON, no markdown or extra text
`;
}

export async function generateImage(prompt: string): Promise<string> {
  const imagePrompt = `Create a realistic, high-quality image of: ${prompt}. Style: professional fitness photography, well-lit, motivating.`;

  const response = await fetch(`${GEMINI_IMAGE_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: imagePrompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini Image API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export async function generateMotivation(): Promise<string> {
  const prompt = "Generate a short, powerful, and inspiring fitness motivation quote. Make it unique and energizing. Return only the quote, no extra text.";

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 100,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.replace(/^["']|["']$/g, "").trim();
}
