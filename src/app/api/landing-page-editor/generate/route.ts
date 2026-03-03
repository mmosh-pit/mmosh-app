import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFileContent } from "@/app/lib/githubClient";
import { verifyWizard } from "@/app/lib/verifyWizard";

const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY!);

const LANDING_PAGE_PATH = "src/app/(main)/page.tsx";

const SYSTEM_PROMPT = `You are an expert React/Next.js developer. You will be given the current source code of a landing page component (a .tsx file) and a user instruction describing what to change.

You MUST return a valid JSON object with exactly two keys:

1. "tsx" — the COMPLETE modified .tsx file (from the first import to the last line). This will be committed to GitHub.
2. "changes" — an array of objects describing EVERY text change you made, in the format: { "find": "exact original text", "replace": "new text" }. These are used for a live preview.

CRITICAL RULES:
1. Be EXTREMELY conservative. Only change EXACTLY what the user asks for. Do NOT touch anything else.
2. Preserve EVERY import, type definition, constant, variable, component, section, paragraph, and line of code that the user did not ask to change.
3. Keep ALL existing functionality (scroll behavior, state management, refs, event handlers, etc.) intact.
4. The "tsx" output must be valid TypeScript JSX that compiles without errors.
5. Do NOT remove or modify the Early Access step components (Step1 through Step8).
6. Do NOT remove or modify the HomeLoggedInPage conditional rendering.
7. Do NOT remove or modify the WizardEditButton or AiPageEditor imports/rendering.
8. Do NOT remove or modify the header navigation, KinshipBots logo, or LandingPageDrawer.
9. Do NOT change colors, fonts, spacing, or CSS classes unless the user explicitly asks for it.
10. Do NOT remove or shorten any paragraphs or sections unless the user explicitly asks for it.
11. The "changes" array must list ONLY the actual text differences. Each "find" value must be an exact substring of the original file that you changed, and "replace" must be what you changed it to. For example, if changing a heading: { "find": "Welcome Home", "replace": "Welcome to Kinship" }.
12. For color changes, include the class change: { "find": "bg-[#EB8000]", "replace": "bg-[#FF0000]" }.
13. For section removal, set "replace" to "" and "find" to the key identifying text of that section.

IMPORTANT: Return ONLY the JSON object. No markdown fences, no explanation. The response must start with { and end with }.`;

export async function POST(request: NextRequest) {
  const auth = await verifyWizard(request);
  if (auth.error) return auth.error;

  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 },
      );
    }

    // Fetch the current file from GitHub main branch
    const file = await getFileContent(LANDING_PAGE_PATH, "main");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      {
        text: `Here is the current source code of the landing page:\n\n${file.content}`,
      },
      {
        text: `User instruction: ${prompt}`,
      },
    ]);

    const rawResponse = result.response.text();

    // Strip any accidental markdown fences
    const cleaned = rawResponse
      .replace(/^```(?:json|tsx?|javascript|jsx)?\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    // Parse the JSON response
    let parsed: {
      tsx: string;
      changes: Array<{ find: string; replace: string }>;
    };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // If JSON parsing fails, treat the whole response as TSX (backward compat)
      console.warn(
        "AI did not return valid JSON. Falling back to raw TSX mode.",
      );
      parsed = { tsx: cleaned, changes: [] };
    }

    if (!parsed.tsx || typeof parsed.tsx !== "string") {
      return NextResponse.json(
        { error: "AI response missing 'tsx' field" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      modifiedContent: parsed.tsx,
      changes: parsed.changes || [],
      originalSha: file.sha,
    });
  } catch (error) {
    console.error("Landing page AI generate error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
