import { NextRequest, NextResponse } from "next/server";
import { generateMotivation } from "@/lib/gemini";

export async function GET(request: NextRequest) {
  try {
    const quote = await generateMotivation();

    return NextResponse.json({ success: true, data: { quote } });
  } catch (error) {
    console.error("Error generating motivation:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to generate motivation" },
      { status: 500 }
    );
  }
}
