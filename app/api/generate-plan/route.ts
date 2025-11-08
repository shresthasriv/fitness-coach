import { NextRequest, NextResponse } from "next/server";
import { generateFitnessPlan } from "@/lib/gemini";
import { UserFormData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userData: UserFormData = body;

    if (!userData.name || !userData.age || !userData.height || !userData.weight) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plan = await generateFitnessPlan(userData);

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error("Error generating fitness plan:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to generate fitness plan" },
      { status: 500 }
    );
  }
}
