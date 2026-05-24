"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useAppStore, Point } from "@/store/useAppStore";

interface MeasureOverlayProps {
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
}

function calcDistance(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

function calcPolylineLength(points: Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += calcDistance(points[i - 1], points[i]);
  }
  return total;
}

export default function MeasureOverlay({
  canvasWidth,
  canvasHeight,
  zoom,
}: MeasureOverlayProps) {
  const {
    isMeasuring,
    pixelsPerMeter,
    manualMeasurements,
    addManualMeasurement,
  } = useAppStore();

  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [mousePos, setMousePos] = useState<Point | null>(null);
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const [completedPixelLength, setCompletedPixelLength] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showLabelInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showLabelInput]);

  // Reset drawing state when measuring mode is toggled off
  useEffect(() => {
    if (!isMeasuring) {
      setCurrentPoints([]);
      setMousePos(null);
      setShowLabelInput(false);
    }
  }, [isMeasuring]);

  const getRelativeCoords = useCallback(
    (e: React.MouseEvent<SVGSVGElement>): Point => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      };
    },
    [zoom]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isMeasuring || showLabelInput) return;
      e.stopPropagation();
      e.preventDefault();

      const point = getRelativeCoords(e);
      setCurrentPoints((prev) => [...prev, point]);
    },
    [isMeasuring, showLabelInput, getRelativeCoords]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isMeasuring || currentPoints.length < 2) return;
      e.stopPropagation();
      e.preventDefault();

      const pixelLength = calcPolylineLength(currentPoints);
      setCompletedPixelLength(pixelLength);
      setShowLabelInput(true);
    },
    [isMeasuring, currentPoints]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isMeasuring || showLabelInput) return;
      const point = getRelativeCoords(e);
      setMousePos(point);
    },
    [isMeasuring, showLabelInput, getRelativeCoords]
  );

  const handleLabelSubmit = useCallback(() => {
    if (!labelValue.trim()) return;

    const meters = completedPixelLength / pixelsPerMeter;

    addManualMeasurement({
      id: `manual-${Date.now()}`,
      label: labelValue.trim(),
      points: [...currentPoints],
      meters: Math.round(meters * 10) / 10,
    });

    setCurrentPoints([]);
    setShowLabelInput(false);
    setLabelValue("");
    setCompletedPixelLength(0);
  }, [
    labelValue,
    completedPixelLength,
    pixelsPerMeter,
    currentPoints,
    addManualMeasurement,
  ]);

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLabelSubmit();
    if (e.key === "Escape") {
      setShowLabelInput(false);
      setCurrentPoints([]);
      setLabelValue("");
    }
  };

  // Calculate current length for tooltip
  const currentPixelLength =
    currentPoints.length > 0 && mousePos
      ? calcPolylineLength([...currentPoints, mousePos])
      : calcPolylineLength(currentPoints);
  const currentMeters = currentPixelLength / pixelsPerMeter;

  if (!isMeasuring && manualMeasurements.length === 0) return null;

  const scaledWidth = canvasWidth / zoom;
  const scaledHeight = canvasHeight / zoom;

  return (
    <>
      <svg
        ref={svgRef}
        className="absolute inset-0 z-10"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          pointerEvents: isMeasuring ? "all" : "none",
          cursor: isMeasuring ? "crosshair" : "default",
        }}
        viewBox={`0 0 ${scaledWidth} ${scaledHeight}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
      >
        {/* Previously completed measurements */}
        {manualMeasurements.map((m) => (
          <g key={m.id}>
            <polyline
              points={m.points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#22c55e"
              strokeWidth={2 / zoom}
              strokeDasharray={`${4 / zoom} ${3 / zoom}`}
              opacity={0.7}
            />
            {m.points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={3 / zoom}
                fill="#22c55e"
                opacity={0.7}
              />
            ))}
            {/* Label at midpoint */}
            {m.points.length >= 2 && (
              <text
                x={m.points[Math.floor(m.points.length / 2)].x}
                y={m.points[Math.floor(m.points.length / 2)].y - 8 / zoom}
                fontSize={11 / zoom}
                fill="#86efac"
                textAnchor="middle"
              >
                {m.label} ({m.meters}m)
              </text>
            )}
          </g>
        ))}

        {/* Current drawing polyline */}
        {currentPoints.length > 0 && (
          <g>
            <polyline
              points={[
                ...currentPoints,
                ...(mousePos && !showLabelInput ? [mousePos] : []),
              ]
                .map((p) => `${p.x},${p.y}`)
                .join(" ")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2 / zoom}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {currentPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4 / zoom}
                fill="#3b82f6"
                stroke="#1d4ed8"
                strokeWidth={1.5 / zoom}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Tooltip showing accumulated length */}
      {isMeasuring && mousePos && currentPoints.length > 0 && !showLabelInput && (
        <div
          className="absolute z-20 pointer-events-none bg-slate-900/90 border border-blue-500 rounded px-2 py-1 text-xs font-mono text-blue-300 whitespace-nowrap"
          style={{
            left: mousePos.x * zoom + 16,
            top: mousePos.y * zoom - 8,
          }}
        >
          {currentMeters.toFixed(1)} m
        </div>
      )}

      {/* Label input popover */}
      {showLabelInput && currentPoints.length > 0 && (
        <div
          className="absolute z-30 bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-3 w-64"
          style={{
            left: currentPoints[currentPoints.length - 1].x * zoom + 16,
            top: currentPoints[currentPoints.length - 1].y * zoom - 20,
          }}
        >
          <p className="text-xs text-slate-400 mb-1">
            Längd:{" "}
            <span className="text-blue-400 font-mono">
              {(completedPixelLength / pixelsPerMeter).toFixed(1)} m
            </span>
          </p>
          <label className="text-xs text-slate-300 block mb-1.5">
            Etikett / Kabeltyp
          </label>
          <input
            ref={inputRef}
            type="text"
            value={labelValue}
            onChange={(e) => setLabelValue(e.target.value)}
            onKeyDown={handleLabelKeyDown}
            placeholder="t.ex. EKKJ 4x10 eller Matning C1"
            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleLabelSubmit}
              className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded font-medium"
            >
              Spara
            </button>
            <button
              onClick={() => {
                setShowLabelInput(false);
                setCurrentPoints([]);
                setLabelValue("");
              }}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </>
  );
}
