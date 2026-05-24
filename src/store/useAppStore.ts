import { create } from "zustand";

export interface MaterialItem {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface CableLength {
  id: string;
  type: string;
  meters: number;
}

export interface AnalysisResult {
  materials: MaterialItem[];
  cables: CableLength[];
  totalCableMeters: number;
}

interface AppState {
  // PDF
  pdfFile: File | null;
  pdfUrl: string | null;
  setPdfFile: (file: File | null) => void;

  // Scale
  scale: string;
  pixelsPerMeter: number;
  setScale: (scale: string) => void;
  setPixelsPerMeter: (ppm: number) => void;

  // Analysis
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  setIsAnalyzing: (val: boolean) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;

  // Calculator
  numElectricians: number;
  avgTimePerUnit: number;
  setNumElectricians: (n: number) => void;
  setAvgTimePerUnit: (t: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // PDF
  pdfFile: null,
  pdfUrl: null,
  setPdfFile: (file) =>
    set({
      pdfFile: file,
      pdfUrl: file ? URL.createObjectURL(file) : null,
      analysisResult: null,
    }),

  // Scale
  scale: "1:50",
  pixelsPerMeter: 100,
  setScale: (scale) => set({ scale }),
  setPixelsPerMeter: (ppm) => set({ pixelsPerMeter: ppm }),

  // Analysis
  isAnalyzing: false,
  analysisResult: null,
  setIsAnalyzing: (val) => set({ isAnalyzing: val }),
  setAnalysisResult: (result) => set({ analysisResult: result }),

  // Calculator
  numElectricians: 2,
  avgTimePerUnit: 0.5,
  setNumElectricians: (n) => set({ numElectricians: n }),
  setAvgTimePerUnit: (t) => set({ avgTimePerUnit: t }),
}));
