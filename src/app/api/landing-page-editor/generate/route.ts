import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFileContent } from "@/app/lib/githubClient";
import { verifyWizard } from "@/app/lib/verifyWizard";

const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY!);

const LANDING_PAGE_PATH = "src/app/(main)/page.tsx";

const SYSTEM_PROMPT = `You are an expert React/Next.js developer. You will be given the current source code of a landing page component (a .tsx file) and a user instruction describing what to change.

Your job is to return the COMPLETE modified file — not a diff, not a snippet, but the entire file from the first line to the last.

Rules:
1. Preserve ALL imports, type definitions, constants, and the component structure.
2. Only modify the parts the user asks for (text content, styles, layout, sections).
3. Keep all existing functionality (scroll behavior, state management, refs, etc.) intact.
4. The output must be valid TypeScript JSX that compiles without errors.
5. Do NOT wrap your output in markdown code fences. Return raw code only.
6. Do NOT add any comments explaining your changes.
7. Do NOT remove or modify the Early Access step components (Step1 through Step8).
8. Do NOT remove or modify the HomeLoggedInPage conditional rendering.
9. You are allowed to modify text, headings, paragraphs, styles, add/remove sections of static content, reorder content, and change Tailwind CSS classes.`;

export async function POST(request: NextRequest) {
  console.log("REQUESTING....");
  const auth = await verifyWizard(request);
  if (auth.error) return auth.error;

  console.log("1");
  try {
    const { prompt } = await request.json();

    console.log("2");
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 },
      );
    }

    console.log("3");
    // Fetch the current file from GitHub main branch
    const file = await getFileContent(LANDING_PAGE_PATH, "main");

    console.log("4");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("5");
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      {
        text: `Here is the current source code of the landing page:\n\n${file.content}`,
      },
      {
        text: `User instruction: ${prompt}`,
      },
    ]);

    console.log("6");
    const modifiedContent = result.response.text();

    console.log("7");
    // Strip any accidental markdown fences the model might add
    const cleaned = modifiedContent
      .replace(/^```(?:tsx?|javascript|jsx)?\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();

    console.log("8");
    return NextResponse.json({
      modifiedContent: cleaned,
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
