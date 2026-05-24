"use client";

import React from "react";
import { Calculator, Users, Clock, CalendarDays } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function LaborCalculator() {
  const {
    analysisResult,
    numElectricians,
    avgTimePerUnit,
    setNumElectricians,
    setAvgTimePerUnit,
  } = useAppStore();

  // Calculate totals
  const totalUnits = analysisResult
    ? analysisResult.materials.reduce((sum, m) => sum + m.quantity, 0)
    : 0;
  const totalCableMeters = analysisResult?.totalCableMeters || 0;

  // Time calculations (hours)
  const unitHours = totalUnits * avgTimePerUnit;
  const cableHours = totalCableMeters * 0.15; // 0.15h per meter cable
  const totalManHours = unitHours + cableHours;

  // Project duration
  const hoursPerDay = 8;
  const totalDays =
    numElectricians > 0
      ? Math.ceil(totalManHours / (numElectricians * hoursPerDay))
      : 0;
  const totalWeeks = Math.ceil(totalDays / 5);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
        <Calculator className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-slate-200">
          Kalkylator – Tid & Arbete
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 flex items-center gap-1 mb-1.5">
              <Users className="w-3 h-3" />
              Antal elektriker
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={numElectricians}
              onChange={(e) => setNumElectricians(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 flex items-center gap-1 mb-1.5">
              <Clock className="w-3 h-3" />
              Snitt-tid per enhet (h)
            </label>
            <input
              type="number"
              min={0.1}
              max={10}
              step={0.1}
              value={avgTimePerUnit}
              onChange={(e) => setAvgTimePerUnit(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Results */}
        {analysisResult && (
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="bg-slate-900 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Mantimmar</p>
              <p className="text-xl font-bold text-purple-400">
                {totalManHours.toFixed(1)}
              </p>
              <p className="text-[10px] text-slate-500">timmar totalt</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Projekttid</p>
              <p className="text-xl font-bold text-blue-400">{totalDays}</p>
              <p className="text-[10px] text-slate-500">arbetsdagar</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Veckor</p>
              <p className="text-xl font-bold text-emerald-400">
                {totalWeeks}
              </p>
              <p className="text-[10px] text-slate-500">
                v. ({numElectricians} pers)
              </p>
            </div>
          </div>
        )}

        {!analysisResult && (
          <p className="text-xs text-slate-500 text-center py-2">
            Kör AI-mängdning för att beräkna tider
          </p>
        )}

        {/* Breakdown */}
        {analysisResult && (
          <div className="border-t border-slate-700 pt-3">
            <p className="text-xs text-slate-400 mb-2 font-medium">
              Beräkningsunderlag
            </p>
            <div className="space-y-1 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Enheter ({totalUnits} st × {avgTimePerUnit}h)</span>
                <span className="text-slate-300">{unitHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span>Kabel ({totalCableMeters}m × 0.15h/m)</span>
                <span className="text-slate-300">
                  {cableHours.toFixed(1)}h
                </span>
              </div>
              <div className="flex justify-between font-medium border-t border-slate-700 pt-1">
                <span className="text-slate-300">Totalt</span>
                <span className="text-purple-400">
                  {totalManHours.toFixed(1)} mantimmar
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
