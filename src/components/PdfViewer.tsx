"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ZoomIn, ZoomOut, RotateCcw, Maximize2, Ruler } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import MeasureOverlay from "./MeasureOverlay";
import SymbolOverlay from "./SymbolOverlay";

export default function PdfViewer() {
  const { pdfFile, pdfUrl, setPdfFile, isMeasuring, setIsMeasuring } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const pdfDocRef = useRef<any>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setPdfFile(acceptedFiles[0]);
      }
    },
    [setPdfFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  useEffect(() => {
    if (!pdfUrl) return;

    const loadPdf = async () => {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      setNumPages(pdf.numPages);
      setPageNum(1);
      renderPage(pdf, 1, zoom);
    };

    loadPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(pdfDocRef.current, pageNum, zoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, pageNum]);

  const renderPage = async (pdf: any, page: number, scale: number) => {
    const pageObj = await pdf.getPage(page);
    const viewport = pageObj.getViewport({ scale: scale * 1.5 });
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    setCanvasSize({ width: viewport.width, height: viewport.height });

    await pageObj.render({ canvasContext: context, viewport }).promise;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMeasuring) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMeasuring) return;
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  if (!pdfFile) {
    return (
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-600 bg-slate-800/50 hover:border-slate-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-16 h-16 text-slate-400 mb-4" />
        <p className="text-lg font-medium text-slate-300">
          Släpp PDF-ritning här
        </p>
        <p className="text-sm text-slate-500 mt-2">
          eller klicka för att välja fil
        </p>
        <p className="text-xs text-slate-600 mt-4">Stödjer: .pdf</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700 rounded-t-lg">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.3, z - 0.2))}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
            title="Zooma ut"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(4, z + 0.2))}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
            title="Zooma in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 ml-2"
            title="Återställ vy"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300"
            title="Anpassa"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-600 mx-1" />
          <button
            onClick={() => setIsMeasuring(!isMeasuring)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
              isMeasuring
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-700 text-slate-300"
            }`}
            title="Aktivera manuell mätning"
          >
            <Ruler className="w-3.5 h-3.5" />
            {isMeasuring ? "Mätning aktiv" : "Mät"}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {numPages > 1 && (
            <>
              <button
                onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                disabled={pageNum <= 1}
                className="px-2 py-1 rounded hover:bg-slate-700 disabled:opacity-30"
              >
                ‹
              </button>
              <span>
                Sida {pageNum} / {numPages}
              </span>
              <button
                onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
                disabled={pageNum >= numPages}
                className="px-2 py-1 rounded hover:bg-slate-700 disabled:opacity-30"
              >
                ›
              </button>
            </>
          )}
          <button
            onClick={() => setPdfFile(null)}
            className="ml-2 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
          >
            Byt fil
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className={`flex-1 overflow-hidden bg-slate-900 rounded-b-lg relative ${
          isMeasuring ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100%",
          }}
        >
          <div className="relative">
            <canvas ref={canvasRef} className="max-w-none" />
            {canvasSize.width > 0 && (
              <>
                <SymbolOverlay
                  canvasWidth={canvasSize.width}
                  canvasHeight={canvasSize.height}
                  zoom={zoom * 1.5}
                />
                <MeasureOverlay
                  canvasWidth={canvasSize.width}
                  canvasHeight={canvasSize.height}
                  zoom={zoom * 1.5}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
