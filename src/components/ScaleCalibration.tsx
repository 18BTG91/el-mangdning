"use client";

import React from "react";
import { Ruler } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const PRESET_SCALES = ["1:20", "1:50", "1:100", "1:200"];

export default function ScaleCalibration() {
  const { scale, setScale, pixelsPerMeter, setPixelsPerMeter } = useAppStore();

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <Ruler className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-slate-200">
          Skala & Kalibrering
        </h3>
      </div>

      <div className="space-y-3">
        {/* Scale presets */}
        <div>
          <label className="text-xs text-slate-400 block mb-1.5">
            Ritningsskala
          </label>
          <div className="flex gap-1.5">
            {PRESET_SCALES.map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
                  scale === s
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Custom scale input */}
        <div>
          <label className="text-xs text-slate-400 block mb-1.5">
            Anpassad skala
          </label>
          <input
            type="text"
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            placeholder="t.ex. 1:75"
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Pixels per meter calibration */}
        <div>
          <label className="text-xs text-slate-400 block mb-1.5">
            Pixlar per meter (kalibrering)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={pixelsPerMeter}
              onChange={(e) => setPixelsPerMeter(Number(e.target.value))}
              min={1}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-slate-500 whitespace-nowrap">
              px = 1m
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Mät ett känt avstånd i ritningen för att kalibrera
          </p>
        </div>
      </div>
    </div>
  );
}
