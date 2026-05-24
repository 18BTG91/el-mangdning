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

  // Mock response data
  const mockResult = {
    materials: [
      {
        id: "1",
        symbol: "⚡",
        name: "Enkeluttag (jordat)",
        quantity: 14,
        unit: "st",
      },
      {
        id: "2",
        symbol: "⚡⚡",
        name: "Dubbeluttag (jordat)",
        quantity: 8,
        unit: "st",
      },
      {
        id: "3",
        symbol: "🔘",
        name: "Strömbrytare (1-pol)",
        quantity: 7,
        unit: "st",
      },
      {
        id: "4",
        symbol: "🔘🔘",
        name: "Korsomkopplare",
        quantity: 3,
        unit: "st",
      },
      {
        id: "5",
        symbol: "💡",
        name: "LED-panel (600x600)",
        quantity: 12,
        unit: "st",
      },
      {
        id: "6",
        symbol: "💡",
        name: "Downlight LED",
        quantity: 6,
        unit: "st",
      },
      {
        id: "7",
        symbol: "🔔",
        name: "Brandvarnare (optisk)",
        quantity: 4,
        unit: "st",
      },
      {
        id: "8",
        symbol: "📡",
        name: "RJ45-uttag (Cat6)",
        quantity: 10,
        unit: "st",
      },
      {
        id: "9",
        symbol: "📦",
        name: "Gruppcentral (12 mod)",
        quantity: 1,
        unit: "st",
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
