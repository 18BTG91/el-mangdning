"use client";

import React from "react";
import { Package, Cable, Trash2, Ruler } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function MaterialTable() {
  const { analysisResult, isAnalyzing, manualMeasurements, removeManualMeasurement, selectedMaterialId, setSelectedMaterialId } = useAppStore();

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

  if (!analysisResult && manualMeasurements.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <p className="text-center text-sm text-slate-500">
          Ladda upp en ritning och kör AI-mängdning för att se resultat
        </p>
      </div>
    );
  }

  const materials = analysisResult?.materials || [];
  const cables = analysisResult?.cables || [];
  const totalCableMeters = analysisResult?.totalCableMeters || 0;
  const manualTotal = manualMeasurements.reduce((sum, m) => sum + m.meters, 0);
  const grandTotalCable = totalCableMeters + manualTotal;

  return (
    <div className="space-y-4">
      {/* Materials table */}
      {materials.length > 0 && (
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
                {materials.map((item) => {
                  const isSelected = selectedMaterialId === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedMaterialId(item.id)}
                      className={`border-b border-slate-700/50 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-600/20 hover:bg-blue-600/25"
                          : "hover:bg-slate-700/30"
                      }`}
                    >
                      <td className="px-4 py-2 text-base">
                        <span className="relative">
                          {item.symbol}
                          {isSelected && (
                            <span
                              className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full animate-pulse"
                              style={{ backgroundColor: item.color || "#3b82f6" }}
                            />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-200">
                        <span className="flex items-center gap-2">
                          {item.name}
                          {isSelected && (
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: item.color || "#3b82f6" }}
                            />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-slate-200">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-right text-slate-400">
                        {item.unit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cable lengths table */}
      {(cables.length > 0 || manualMeasurements.length > 0) && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-750 border-b border-slate-700">
            <Cable className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Kabellängder
            </h3>
            <span className="ml-auto text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              Totalt: {grandTotalCable.toFixed(1)} m
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-700">
                  <th className="text-left px-4 py-2 font-medium">Kabeltyp</th>
                  <th className="text-left px-4 py-2 font-medium">Källa</th>
                  <th className="text-right px-4 py-2 font-medium">Längd (m)</th>
                  <th className="text-right px-4 py-2 font-medium w-8"></th>
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
                    <td className="px-4 py-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        AI
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-slate-200">
                      {cable.meters}
                    </td>
                    <td className="px-4 py-2"></td>
                  </tr>
                ))}
                {manualMeasurements.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30"
                  >
                    <td className="px-4 py-2 text-slate-200 font-mono text-xs flex items-center gap-1.5">
                      <Ruler className="w-3 h-3 text-emerald-400" />
                      {m.label}
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Manuell
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-slate-200">
                      {m.meters}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => removeManualMeasurement(m.id)}
                        className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                        title="Ta bort"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
