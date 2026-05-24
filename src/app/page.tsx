"use client";

import dynamic from "next/dynamic";
import { Bolt } from "lucide-react";
import ScaleCalibration from "@/components/ScaleCalibration";
import AnalysisButton from "@/components/AnalysisButton";
import MaterialTable from "@/components/MaterialTable";
import LaborCalculator from "@/components/LaborCalculator";

const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Bolt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight">
              El-Mängdning
            </h1>
            <p className="text-[10px] text-slate-500 -mt-0.5">
              AI-driven ritningstolkning
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500">v0.1.0</div>
      </header>

      {/* Main split layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left pane: PDF Viewer */}
        <section className="flex-1 p-4 min-w-0 relative">
          <div className="absolute inset-4">
            <PdfViewer />
          </div>
        </section>

        {/* Right pane: Controls & Results */}
        <aside className="w-[420px] border-l border-slate-700/60 bg-slate-900/50 overflow-y-auto p-4 space-y-4">
          <ScaleCalibration />
          <AnalysisButton />
          <MaterialTable />
          <LaborCalculator />
        </aside>
      </main>
    </div>
  );
}
