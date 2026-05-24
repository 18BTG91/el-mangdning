"use client";

import React from "react";
import { Zap, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function AnalysisButton() {
  const { pdfFile, isAnalyzing, setIsAnalyzing, setAnalysisResult } =
    useAppStore();

  const handleAnalyze = async () => {
    if (!pdfFile || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // --- PLACEHOLDER: Send actual file to your backend ---
      // const formData = new FormData();
      // formData.append("file", pdfFile);
      // formData.append("scale", scale);
      //
      // const res = await fetch("/api/analyze", {
      //   method: "POST",
      //   body: formData,
      // });
      // --- END PLACEHOLDER ---

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: pdfFile.name }),
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <button
      onClick={handleAnalyze}
      disabled={!pdfFile || isAnalyzing}
      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
        !pdfFile
          ? "bg-slate-700 text-slate-500 cursor-not-allowed"
          : isAnalyzing
          ? "bg-amber-600/80 text-white cursor-wait"
          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40"
      }`}
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Analyserar ritning...
        </>
      ) : (
        <>
          <Zap className="w-5 h-5" />
          Kör AI-Mängdning
        </>
      )}
    </button>
  );
}
