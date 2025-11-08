// app/api/speech-to-text/route.ts
import { NextRequest } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // parse uploaded file
    console.log(req,"req from the user voice =====================================>")
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    console.log(file,"file ========================================>")
    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    // convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = path.join("/tmp", file.name);
    fs.writeFileSync(tempPath, buffer);

    // call OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
    });
    console.log(transcription,"transcrption from the api =====================================>")
    return new Response(JSON.stringify({ text: transcription.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Speech-to-text error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to transcribe audio" }),
      { status: 500 }
    );
  }
}
