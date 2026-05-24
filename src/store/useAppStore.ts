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
  manual?: boolean;
}

export interface AnalysisResult {
  materials: MaterialItem[];
  cables: CableLength[];
  totalCableMeters: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface ManualMeasurement {
  id: string;
  label: string;
  points: Point[];
  meters: number;
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

  // Manual Measurement
  isMeasuring: boolean;
  manualMeasurements: ManualMeasurement[];
  setIsMeasuring: (val: boolean) => void;
  addManualMeasurement: (measurement: ManualMeasurement) => void;
  removeManualMeasurement: (id: string) => void;
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

  // Manual Measurement
  isMeasuring: false,
  manualMeasurements: [],
  setIsMeasuring: (val) => set({ isMeasuring: val }),
  addManualMeasurement: (measurement) =>
    set((state) => ({
      manualMeasurements: [...state.manualMeasurements, measurement],
    })),
  removeManualMeasurement: (id) =>
    set((state) => ({
      manualMeasurements: state.manualMeasurements.filter((m) => m.id !== id),
    })),
}));
