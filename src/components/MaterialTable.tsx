"use client";

import React from "react";
import { Package, Cable } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function MaterialTable() {
  const { analysisResult, isAnalyzing } = useAppStore();

  if (isAnalyzing) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-8 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <p className="text-sm text-slate-400">
            Skannar ritning efter symboler...
          </p>
          <p className="text-xs text-slate-500">
            Identifierar uttag, strömbrytare, armaturer och kabelvägar
          </p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <p className="text-center text-sm text-slate-500">
          Ladda upp en ritning och kör AI-mängdning för att se resultat
        </p>
      </div>
    );
  }

  const { materials, cables, totalCableMeters } = analysisResult;

  return (
    <div className="space-y-4">
      {/* Materials table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-750 border-b border-slate-700">
          <Package className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Material & Komponenter
          </h3>
          <span className="ml-auto text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">
            {materials.length} typer
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-700">
                <th className="text-left px-4 py-2 font-medium">Symbol</th>
                <th className="text-left px-4 py-2 font-medium">Benämning</th>
                <th className="text-right px-4 py-2 font-medium">Antal</th>
                <th className="text-right px-4 py-2 font-medium">Enhet</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30"
                >
                  <td className="px-4 py-2 text-base">{item.symbol}</td>
                  <td className="px-4 py-2 text-slate-200">{item.name}</td>
                  <td className="px-4 py-2 text-right font-mono text-slate-200">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2 text-right text-slate-400">
                    {item.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cable lengths table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-750 border-b border-slate-700">
          <Cable className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Kabellängder
          </h3>
          <span className="ml-auto text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
            Totalt: {totalCableMeters} m
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-700">
                <th className="text-left px-4 py-2 font-medium">Kabeltyp</th>
                <th className="text-right px-4 py-2 font-medium">Längd (m)</th>
              </tr>
            </thead>
            <tbody>
              {cables.map((cable) => (
                <tr
                  key={cable.id}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30"
                >
                  <td className="px-4 py-2 text-slate-200 font-mono text-xs">
                    {cable.type}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-slate-200">
                    {cable.meters}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
