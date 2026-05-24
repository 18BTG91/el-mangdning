"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";

interface SymbolOverlayProps {
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
}

export default function SymbolOverlay({
  canvasWidth,
  canvasHeight,
  zoom,
}: SymbolOverlayProps) {
  const { analysisResult, selectedMaterialId } = useAppStore();

  if (!analysisResult || !selectedMaterialId) return null;

  const selected = analysisResult.materials.find(
    (m) => m.id === selectedMaterialId
  );
  if (!selected || !selected.positions || selected.positions.length === 0)
    return null;

  const color = selected.color || "#3b82f6";
  const scaledW = canvasWidth / zoom;
  const scaledH = canvasHeight / zoom;

  return (
    <svg
      className="absolute inset-0 z-[5] pointer-events-none"
      style={{ width: canvasWidth, height: canvasHeight }}
      viewBox={`0 0 ${scaledW} ${scaledH}`}
    >
      {selected.positions.map((pos, i) => {
        const cx = pos.x * scaledW;
        const cy = pos.y * scaledH;
        const r = 14 / zoom;

        return (
          <g key={i}>
            {/* Pulsing ring */}
            <circle
              cx={cx}
              cy={cy}
              r={r * 1.8}
              fill="none"
              stroke={color}
              strokeWidth={1.5 / zoom}
              opacity={0.3}
            >
              <animate
                attributeName="r"
                from={r * 1.2}
                to={r * 2.2}
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.5"
                to="0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Solid marker */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={color}
              fillOpacity={0.2}
              stroke={color}
              strokeWidth={2 / zoom}
            />
            {/* Center dot */}
            <circle cx={cx} cy={cy} r={3 / zoom} fill={color} />
            {/* Index label */}
            <text
              x={cx}
              y={cy - r - 4 / zoom}
              textAnchor="middle"
              fontSize={10 / zoom}
              fill={color}
              fontWeight="bold"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
