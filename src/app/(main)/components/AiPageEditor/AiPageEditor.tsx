"use client";

import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { isAiEditorOpen } from "@/app/store";
import client from "@/app/lib/internalHttpClient";

type EditorState =
  | "idle"
  | "generating"
  | "preview-ready"
  | "committing"
  | "deployed"
  | "merging"
  | "error";

const AiPageEditor = () => {
  const [isOpen, setIsOpen] = useAtom(isAiEditorOpen);
  const [state, setState] = useState<EditorState>("idle");
  const [prompt, setPrompt] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [modifiedContent, setModifiedContent] = useState("");
  const [originalSha, setOriginalSha] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [errorText, setErrorText] = useState("");

  // Check for pending preview on mount
  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const checkStatus = async () => {
    try {
      const res = await client.get("/api/landing-page-editor/status");
      if (res.data?.hasPendingPreview) {
        setGithubUrl(res.data.githubUrl || "");
        setState("deployed");
      }
    } catch {
      // No pending preview, stay idle
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setState("generating");
    setErrorText("");

    try {
      const res = await client.post("/api/landing-page-editor/generate", {
        prompt: prompt.trim(),
      });
      setModifiedContent(res.data.modifiedContent);
      setOriginalSha(res.data.originalSha);
      setCommitMessage(`AI edit: ${prompt.trim().slice(0, 80)}`);
      setState("preview-ready");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate";
      setErrorText(message);
      setState("error");
    }
  };

  const handleCommit = async () => {
    setState("committing");
    setErrorText("");

    try {
      const res = await client.post("/api/landing-page-editor/commit", {
        content: modifiedContent,
        message: commitMessage || "AI-edited landing page",
      });
      setGithubUrl(res.data.githubUrl || "");
      setState("deployed");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to commit";
      setErrorText(message);
      setState("error");
    }
  };

  const handleMerge = async () => {
    setState("merging");
    setErrorText("");

    try {
      await client.post("/api/landing-page-editor/merge", {});
      setState("idle");
      setPrompt("");
      setModifiedContent("");
      setGithubUrl("");
      alert("✅ Changes merged to production! Vercel will deploy shortly.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to merge";
      setErrorText(message);
      setState("error");
    }
  };

  const handleDiscard = async () => {
    // Attempt to delete the preview branch if it exists
    try {
      await client.post("/api/landing-page-editor/merge", {
        discard: true,
      });
    } catch {
      // Ignore — branch may not exist
    }
    setState("idle");
    setPrompt("");
    setModifiedContent("");
    setGithubUrl("");
    setErrorText("");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[480px] h-full bg-[#0a0d2e] border-l border-[#FFFFFF1A] shadow-2xl overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0d2e] border-b border-[#FFFFFF1A] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl">✏️</span>
            <h2 className="text-white font-bold text-lg font-poppinsNew">
              AI Page Editor
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${state === "idle"
                  ? "bg-green-400"
                  : state === "generating" ||
                    state === "committing" ||
                    state === "merging"
                    ? "bg-yellow-400 animate-pulse"
                    : state === "deployed"
                      ? "bg-blue-400"
                      : state === "error"
                        ? "bg-red-400"
                        : "bg-orange-400"
                }`}
            />
            <span className="text-white/60 text-sm font-avenir">
              {state === "idle" && "Ready"}
              {state === "generating" && "Generating with AI…"}
              {state === "preview-ready" && "Preview ready"}
              {state === "committing" && "Committing to GitHub…"}
              {state === "deployed" && "Preview branch deployed"}
              {state === "merging" && "Merging to production…"}
              {state === "error" && "Error"}
            </span>
          </div>

          {/* Error display */}
          {errorText && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 text-sm font-avenir">{errorText}</p>
              <button
                onClick={() => {
                  setErrorText("");
                  setState("idle");
                }}
                className="mt-2 text-xs text-red-300 underline hover:text-red-200"
              >
                Try again
              </button>
            </div>
          )}

          {/* IDLE: Prompt input */}
          {(state === "idle" || state === "generating") && (
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-semibold font-avenir block mb-2">
                  Describe what you want to change
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='e.g. "Change the hero heading to Welcome to Kinship" or "Add a new section about our team below the origin story"'
                  className="w-full h-40 bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-xl px-4 py-3 text-white text-sm font-avenir placeholder:text-white/30 resize-none focus:outline-none focus:border-[#EB8000] transition-colors"
                  disabled={state === "generating"}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || state === "generating"}
                className="w-full py-3 rounded-xl font-bold text-white text-sm font-avenir transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#EB8000] hover:bg-[#d47200] active:scale-[0.98]"
              >
                {state === "generating" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    AI is editing the page…
                  </span>
                ) : (
                  "🪄 Generate Changes"
                )}
              </button>
            </div>
          )}

          {/* PREVIEW READY: Review and commit */}
          {(state === "preview-ready" || state === "committing") && (
            <div className="space-y-4">
              <div className="bg-[#FFFFFF08] border border-[#FFFFFF1A] rounded-xl p-4">
                <p className="text-green-400 text-sm font-avenir font-semibold mb-2">
                  ✅ AI generated changes successfully
                </p>
                <p className="text-white/60 text-xs font-avenir">
                  Review the commit message below, then deploy a preview to
                  Vercel.
                </p>
              </div>

              <div>
                <label className="text-white/80 text-sm font-semibold font-avenir block mb-2">
                  Commit message
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-xl px-4 py-3 text-white text-sm font-avenir focus:outline-none focus:border-[#EB8000] transition-colors"
                  disabled={state === "committing"}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDiscard}
                  disabled={state === "committing"}
                  className="flex-1 py-3 rounded-xl font-bold text-white/70 text-sm font-avenir border border-[#FFFFFF1A] hover:bg-[#FFFFFF0A] transition-all disabled:opacity-40"
                >
                  Discard
                </button>
                <button
                  onClick={handleCommit}
                  disabled={state === "committing"}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-sm font-avenir bg-[#EB8000] hover:bg-[#d47200] transition-all disabled:opacity-40"
                >
                  {state === "committing" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Deploying…
                    </span>
                  ) : (
                    "🚀 Deploy Preview"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* DEPLOYED: Preview link + merge */}
          {(state === "deployed" || state === "merging") && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-400 text-sm font-avenir font-semibold mb-2">
                  🌐 Preview branch is live
                </p>
                <p className="text-white/60 text-xs font-avenir mb-3">
                  Vercel will automatically deploy this branch. Check your
                  Vercel dashboard for the preview URL, or view the changes on
                  GitHub:
                </p>
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#EB8000] text-sm font-avenir underline hover:text-[#ff9920] transition-colors"
                  >
                    View on GitHub ↗
                  </a>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDiscard}
                  disabled={state === "merging"}
                  className="flex-1 py-3 rounded-xl font-bold text-white/70 text-sm font-avenir border border-[#FFFFFF1A] hover:bg-[#FFFFFF0A] transition-all disabled:opacity-40"
                >
                  Discard
                </button>
                <button
                  onClick={handleMerge}
                  disabled={state === "merging"}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-sm font-avenir bg-green-600 hover:bg-green-700 transition-all disabled:opacity-40"
                >
                  {state === "merging" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Merging…
                    </span>
                  ) : (
                    "✅ Merge to Production"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Info footer */}
          <div className="pt-4 border-t border-[#FFFFFF0A]">
            <p className="text-white/30 text-xs font-avenir leading-relaxed">
              Changes are committed to the{" "}
              <code className="text-white/50">landing-page-preview</code>{" "}
              branch. Vercel will deploy a preview automatically. Merging pushes
              changes to production.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AiPageEditor;
