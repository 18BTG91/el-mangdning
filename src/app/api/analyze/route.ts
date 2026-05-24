import { NextRequest, NextResponse } from "next/server";

/**
 * Mock AI analysis endpoint.
 * Replace the body of this function with a call to your actual
 * Python/FastAPI backend or OpenAI/Claude Vision API.
 *
 * Expected flow:
 * 1. Receive PDF file (or base64 image) + scale info
 * 2. Send to vision model for symbol detection
 * 3. Return structured material list + cable lengths
 */
export async function POST(req: NextRequest) {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // --- PLACEHOLDER: Replace with actual API call ---
  // const formData = await req.formData();
  // const file = formData.get("file") as File;
  // const scale = formData.get("scale") as string;
  //
  // const response = await fetch("https://your-fastapi-backend.com/analyze", {
  //   method: "POST",
  //   body: formData,
  // });
  // const result = await response.json();
  // return NextResponse.json(result);
  // --- END PLACEHOLDER ---

  // Mock response data with symbol positions (normalized 0-1 coords relative to page)
  const mockResult = {
    materials: [
      {
        id: "1",
        symbol: "⚡",
        name: "Enkeluttag (jordat)",
        quantity: 14,
        unit: "st",
        color: "#3b82f6",
        positions: [
          { x: 0.12, y: 0.25 }, { x: 0.12, y: 0.42 }, { x: 0.12, y: 0.58 },
          { x: 0.12, y: 0.75 }, { x: 0.35, y: 0.20 }, { x: 0.35, y: 0.48 },
          { x: 0.35, y: 0.72 }, { x: 0.55, y: 0.22 }, { x: 0.55, y: 0.50 },
          { x: 0.55, y: 0.78 }, { x: 0.75, y: 0.25 }, { x: 0.75, y: 0.45 },
          { x: 0.75, y: 0.65 }, { x: 0.88, y: 0.35 },
        ],
      },
      {
        id: "2",
        symbol: "⚡⚡",
        name: "Dubbeluttag (jordat)",
        quantity: 8,
        unit: "st",
        color: "#8b5cf6",
        positions: [
          { x: 0.18, y: 0.30 }, { x: 0.18, y: 0.55 }, { x: 0.40, y: 0.30 },
          { x: 0.40, y: 0.60 }, { x: 0.60, y: 0.30 }, { x: 0.60, y: 0.65 },
          { x: 0.80, y: 0.30 }, { x: 0.80, y: 0.55 },
        ],
      },
      {
        id: "3",
        symbol: "🔘",
        name: "Strömbrytare (1-pol)",
        quantity: 7,
        unit: "st",
        color: "#f59e0b",
        positions: [
          { x: 0.14, y: 0.22 }, { x: 0.14, y: 0.55 }, { x: 0.37, y: 0.18 },
          { x: 0.37, y: 0.70 }, { x: 0.57, y: 0.20 }, { x: 0.57, y: 0.76 },
          { x: 0.77, y: 0.23 },
        ],
      },
      {
        id: "4",
        symbol: "🔘🔘",
        name: "Korsomkopplare",
        quantity: 3,
        unit: "st",
        color: "#ef4444",
        positions: [
          { x: 0.30, y: 0.40 }, { x: 0.50, y: 0.40 }, { x: 0.70, y: 0.40 },
        ],
      },
      {
        id: "5",
        symbol: "💡",
        name: "LED-panel (600x600)",
        quantity: 12,
        unit: "st",
        color: "#10b981",
        positions: [
          { x: 0.20, y: 0.35 }, { x: 0.30, y: 0.35 }, { x: 0.40, y: 0.35 },
          { x: 0.20, y: 0.50 }, { x: 0.30, y: 0.50 }, { x: 0.40, y: 0.50 },
          { x: 0.60, y: 0.35 }, { x: 0.70, y: 0.35 }, { x: 0.80, y: 0.35 },
          { x: 0.60, y: 0.50 }, { x: 0.70, y: 0.50 }, { x: 0.80, y: 0.50 },
        ],
      },
      {
        id: "6",
        symbol: "💡",
        name: "Downlight LED",
        quantity: 6,
        unit: "st",
        color: "#06b6d4",
        positions: [
          { x: 0.25, y: 0.82 }, { x: 0.35, y: 0.82 }, { x: 0.45, y: 0.82 },
          { x: 0.55, y: 0.82 }, { x: 0.65, y: 0.82 }, { x: 0.75, y: 0.82 },
        ],
      },
      {
        id: "7",
        symbol: "🔔",
        name: "Brandvarnare (optisk)",
        quantity: 4,
        unit: "st",
        color: "#f43f5e",
        positions: [
          { x: 0.25, y: 0.15 }, { x: 0.50, y: 0.15 }, { x: 0.75, y: 0.15 },
          { x: 0.50, y: 0.85 },
        ],
      },
      {
        id: "8",
        symbol: "📡",
        name: "RJ45-uttag (Cat6)",
        quantity: 10,
        unit: "st",
        color: "#a855f7",
        positions: [
          { x: 0.15, y: 0.28 }, { x: 0.15, y: 0.48 }, { x: 0.15, y: 0.68 },
          { x: 0.38, y: 0.25 }, { x: 0.38, y: 0.55 }, { x: 0.58, y: 0.25 },
          { x: 0.58, y: 0.55 }, { x: 0.78, y: 0.28 }, { x: 0.78, y: 0.48 },
          { x: 0.78, y: 0.68 },
        ],
      },
      {
        id: "9",
        symbol: "📦",
        name: "Gruppcentral (12 mod)",
        quantity: 1,
        unit: "st",
        color: "#f97316",
        positions: [
          { x: 0.08, y: 0.10 },
        ],
      },
    ],
    cables: [
      { id: "c1", type: "EKK 3x1.5mm²", meters: 85 },
      { id: "c2", type: "EKK 3x2.5mm²", meters: 42 },
      { id: "c3", type: "EKK 5x2.5mm²", meters: 18 },
      { id: "c4", type: "EKLK 2x0.75mm²", meters: 35 },
      { id: "c5", type: "Cat6 U/UTP", meters: 64 },
    ],
    totalCableMeters: 244,
  };

  return NextResponse.json(mockResult);
}
