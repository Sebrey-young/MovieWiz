// File: app/api/ai-analysis/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 1) Parse the JSON body (should be { prompt: string, mode: "analysis"|"confidence" })
  let body: { prompt?: string; mode?: "analysis" | "confidence" };
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { prompt, mode } = body;
  if (typeof prompt !== "string" || !(mode === "analysis" || mode === "confidence")) {
    return NextResponse.json(
      { error: "Missing or invalid `prompt` / `mode`" },
      { status: 400 }
    );
  }

  // 2) Load your Google API key from the environment
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log(">>> [ai-analysis] GOOGLE_API_KEY loaded? ", apiKey ? "yes" : "no");
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google API key not configured. Please set GOOGLE_API_KEY." },
      { status: 500 }
    );
  }

  // 3) Prepend a small "system" message based on mode
  const systemMessage =
    mode === "analysis"
      ? "You are a helpful movie critic.\n"
      : "You are a helpful data scientist.\n";

  // 4) Call the current Google Generative AI API endpoint
  try {
    // Updated to use the current v1beta API with Gemini model
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    // Updated JSON body structure for the current API
    const requestBody = {
      contents: [{
        parts: [{
          text: systemMessage + prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 256,
        candidateCount: 1
      }
    };

    const googleRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!googleRes.ok) {
      // If Google returns non-2xx, log and propagate
      const errorText = await googleRes.text();
      console.error(
        "[ai-analysis] Google returned error status:",
        googleRes.status,
        errorText
      );
      return NextResponse.json(
        { error: `Google API error: ${errorText}` },
        { status: 500 }
      );
    }

    // 5) Return the raw Google JSON payload back to the client
    const parsedJson = await googleRes.json();
    return NextResponse.json(parsedJson);
  } catch (err) {
    console.error("[ai-analysis] Exception calling Google:", err);
    return NextResponse.json(
      { error: "Internal server error calling Google API." },
      { status: 500 }
    );
  }
}