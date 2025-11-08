import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const imageUrl = await generateImage(prompt);

    return NextResponse.json({ success: true, data: { imageUrl } });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 }
    );
  }
}
