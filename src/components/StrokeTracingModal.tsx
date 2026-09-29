import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Volume2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Palette,
  Award,
  Download,
  Share2,
  HelpCircle,
  Play,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { BarakhadiRow } from '../data/barakhadiData';
import { speechEngine } from '../engine/speechEngine';
import confetti from 'canvas-confetti';

interface StrokeTracingModalProps {
  initialLetter: BarakhadiRow;
  allLetters: BarakhadiRow[];
  onClose: () => void;
  onLetterComplete?: (letter: BarakhadiRow, accuracy: number) => void;
}

const BRUSH_COLORS = [
  { name: 'Emerald', hex: '#10b981', ring: 'ring-emerald-400', bg: 'bg-emerald-500' },
  { name: 'Solar Amber', hex: '#f59e0b', ring: 'ring-amber-400', bg: 'bg-amber-500' },
  { name: 'Cyan Glow', hex: '#06b6d4', ring: 'ring-cyan-400', bg: 'bg-cyan-500' },
  { name: 'Neon Rose', hex: '#f43f5e', ring: 'ring-rose-400', bg: 'bg-rose-500' },
  { name: 'Violet', hex: '#a855f7', ring: 'ring-purple-400', bg: 'bg-purple-500' },
];

const BRUSH_SIZES = [
  { label: 'Fine', size: 8 },
  { label: 'Medium', size: 14 },
  { label: 'Marker', size: 20 },
];

type GuideMode = 'ghost' | 'outline' | 'blind';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
}

interface GlyphMaskData {
  width: number;
  height: number;
  isGlyph: Uint8Array;
  isTolerance: Uint8Array;
  glyphPixelCount: number;
}

/**
 * Generate pixel mask of the Ol Chiki glyph to accurately validate user tracing
 * Adapts font stroke weight and tolerance corridor according to selected pen tip size (Fine / Medium / Marker)
 */
function generateGlyphMask(
  glyph: string,
  brushSize: number = 14,
  guideMode: GuideMode = 'ghost',
  width: number = 340,
  height: number = 340
): GlyphMaskData | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  const fontSize = brushSize <= 8 ? 185 : brushSize === 14 ? 200 : 215;
  const fontWeight = brushSize <= 8 ? '400' : brushSize === 14 ? 'bold' : '900';

  ctx.font = `${fontWeight} ${fontSize}px "Noto Sans Ol Chiki", system-ui, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // For thicker Marker pen tips, stroke the base glyph to match marker width
  if (brushSize >= 20) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeText(glyph, width / 2, height / 2);
  }

  ctx.fillText(glyph, width / 2, height / 2);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const totalPixels = width * height;
  const isGlyph = new Uint8Array(totalPixels);
  let glyphPixelCount = 0;

  for (let i = 0; i < totalPixels; i++) {
    // Check luminance of the white glyph body
    if (data[i * 4] > 40) {
      isGlyph[i] = 1;
      glyphPixelCount++;
    }
  }

  // Snug tolerance corridor scaled to pen tip size:
  // Fine (size 8): radius = 11px (blind: 17px)
  // Medium (size 14): radius = 16px (blind: 22px)
  // Marker (size 20): radius = 22px (blind: 28px)
  const baseRadius = brushSize <= 8 ? 11 : brushSize === 14 ? 16 : 22;
  const radius = guideMode === 'blind' ? baseRadius + 6 : baseRadius;
  const isTolerance = new Uint8Array(totalPixels);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (isGlyph[idx]) {
        const minY = Math.max(0, y - radius);
        const maxY = Math.min(height - 1, y + radius);
        const minX = Math.max(0, x - radius);
        const maxX = Math.min(width - 1, x + radius);
        for (let dy = minY; dy <= maxY; dy++) {
          const rowOffset = dy * width;
          for (let dx = minX; dx <= maxX; dx++) {
            isTolerance[rowOffset + dx] = 1;
          }
        }
      }
    }
  }

  return {
    width,
    height,
    isGlyph,
    isTolerance,
    glyphPixelCount: Math.max(1, glyphPixelCount),
  };
}

/**
 * Compare drawn user strokes against the authentic Ol Chiki glyph mask
 */
function evaluateUserStrokes(
  strokesList: Stroke[],
  mask: GlyphMaskData | null,
  brushSize: number = 14,
  guideMode: GuideMode = 'ghost'
) {
  if (!mask || strokesList.length === 0) {
    return { coverage: 0, accuracy: 0, score: 0, offTargetCount: 0, isOffTarget: false };
  }

  const canvas = document.createElement('canvas');
  canvas.width = mask.width;
  canvas.height = mask.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { coverage: 0, accuracy: 0, score: 0, offTargetCount: 0, isOffTarget: false };

  ctx.clearRect(0, 0, mask.width, mask.height);

  for (const stroke of strokesList) {
    if (stroke.points.length === 0) continue;
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = stroke.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (stroke.points.length === 1) {
      ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        const xc = (stroke.points[i - 1].x + stroke.points[i].x) / 2;
        const yc = (stroke.points[i - 1].y + stroke.points[i].y) / 2;
        ctx.quadraticCurveTo(stroke.points[i - 1].x, stroke.points[i - 1].y, xc, yc);
      }
      ctx.lineTo(stroke.points[stroke.points.length - 1].x, stroke.points[stroke.points.length - 1].y);
      ctx.stroke();
    }
  }

  const imgData = ctx.getImageData(0, 0, mask.width, mask.height);
  const data = imgData.data;
  const totalPixels = mask.width * mask.height;

  let userDrawnPixels = 0;
  let onTargetUserPixels = 0;
  let offTargetUserPixels = 0;
  let coveredGlyphPixels = 0;

  for (let i = 0; i < totalPixels; i++) {
    const isUserPixel = data[i * 4 + 3] > 30;
    if (isUserPixel) {
      userDrawnPixels++;
      if (mask.isTolerance[i]) {
        onTargetUserPixels++;
      } else {
        offTargetUserPixels++;
      }
    }
    if (mask.isGlyph[i] && isUserPixel) {
      coveredGlyphPixels++;
    }
  }

  if (userDrawnPixels === 0) {
    return { coverage: 0, accuracy: 0, score: 0, offTargetCount: 0, isOffTarget: false };
  }

  // Raw glyph overlap percentage
  const rawCoverage = (coveredGlyphPixels / mask.glyphPixelCount) * 100;

  // Normalized Coverage:
  // Fine pen (8px) draws a single slender line through a thick glyph body (~20% raw fill).
  // Scaling by pen footprint ensures drawing the complete letter shape reaches 100%.
  const brushScale = brushSize <= 8 ? 2.8 : brushSize === 14 ? 1.7 : 1.1;
  const modeScale = guideMode === 'blind' ? 1.5 : 1.0;
  const coverage = Math.min(100, Math.round(rawCoverage * brushScale * modeScale));

  // Accuracy / Line Precision:
  // Stray ink drawn in outer area directly penalizes precision.
  const strayRatio = offTargetUserPixels / userDrawnPixels;

  // Non-linear penalty: Outer stray ink drops precision
  const penaltyFactor = guideMode === 'blind' ? 1.6 : 2.2;
  const precisionFactor = Math.max(0, 1 - strayRatio * penaltyFactor);
  const accuracy = Math.round(Math.pow(precisionFactor, 1.8) * 100);

  // Score requires BOTH coverage and precision
  const score = Math.round((coverage * accuracy) / 100);

  // Outer area stray ink detection (accommodates freehand position variations in blind mode)
  const isOffTarget =
    guideMode === 'blind'
      ? offTargetUserPixels > 160 && (strayRatio > 0.32 || offTargetUserPixels > 450)
      : offTargetUserPixels > 80 && (strayRatio > 0.18 || offTargetUserPixels > 250);

  return {
    coverage,
    accuracy,
    score,
    offTargetCount: offTargetUserPixels,
    isOffTarget,
  };
}

export const StrokeTracingModal: React.FC<StrokeTracingModalProps> = ({
  initialLetter,
  allLetters,
  onClose,
  onLetterComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(() => {
    const idx = allLetters.findIndex(l => l.devaConsonant === initialLetter.devaConsonant);
    return idx >= 0 ? idx : 0;
  });

  const letter = allLetters[currentIdx] || initialLetter;

  // Drawing customization
  const [brushColor, setBrushColor] = useState<string>(BRUSH_COLORS[0].hex);
  const [brushSize, setBrushSize] = useState<number>(14);
  const [guideMode, setGuideMode] = useState<GuideMode>('ghost');
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);

  // Real Metric Scores
  const [metrics, setMetrics] = useState({
    coverage: 0,
    accuracy: 0,
    score: 0,
    isOffTarget: false,
  });

  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const glyphMaskRef = useRef<GlyphMaskData | null>(null);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const strokesRef = useRef<Stroke[]>([]);

  // Synchronize strokesRef
  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

  // Compute accurate metrics whenever strokes change
  const evaluateMetrics = useCallback(() => {
    const allStrokes = currentStrokeRef.current
      ? [...strokesRef.current, currentStrokeRef.current]
      : strokesRef.current;

    const res = evaluateUserStrokes(allStrokes, glyphMaskRef.current, brushSize, guideMode);
    setMetrics({
      coverage: res.coverage,
      accuracy: res.accuracy,
      score: res.score,
      isOffTarget: res.isOffTarget,
    });
  }, [brushSize, guideMode]);

  // Setup High-DPI canvas & redraw
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width || 340;
    const displayHeight = rect.height || 340;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Draw all completed strokes
    for (const stroke of strokesRef.current) {
      if (stroke.points.length === 0) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = stroke.color;
      ctx.shadowBlur = 4;

      if (stroke.points.length === 1) {
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.color;
        ctx.fill();
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          const xc = (stroke.points[i - 1].x + stroke.points[i].x) / 2;
          const yc = (stroke.points[i - 1].y + stroke.points[i].y) / 2;
          ctx.quadraticCurveTo(stroke.points[i - 1].x, stroke.points[i - 1].y, xc, yc);
        }
        ctx.lineTo(stroke.points[stroke.points.length - 1].x, stroke.points[stroke.points.length - 1].y);
        ctx.stroke();
      }
    }

    // Draw active stroke
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      const stroke = currentStrokeRef.current;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = stroke.color;
      ctx.shadowBlur = 4;

      if (stroke.points.length === 1) {
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.color;
        ctx.fill();
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          const xc = (stroke.points[i - 1].x + stroke.points[i].x) / 2;
          const yc = (stroke.points[i - 1].y + stroke.points[i].y) / 2;
          ctx.quadraticCurveTo(stroke.points[i - 1].x, stroke.points[i - 1].y, xc, yc);
        }
        ctx.lineTo(stroke.points[stroke.points.length - 1].x, stroke.points[stroke.points.length - 1].y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }, []);

  // Generate Glyph Mask whenever letter, brushSize, or guideMode changes
  useEffect(() => {
    // Ensure web fonts are rendered before creating mask
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        glyphMaskRef.current = generateGlyphMask(letter.olchikiBase, brushSize, guideMode, 340, 340);
        evaluateMetrics();
      });
    } else {
      glyphMaskRef.current = generateGlyphMask(letter.olchikiBase, brushSize, guideMode, 340, 340);
      evaluateMetrics();
    }
  }, [letter.olchikiBase, brushSize, guideMode, evaluateMetrics]);

  // Reset when switching letter
  useEffect(() => {
    setStrokes([]);
    strokesRef.current = [];
    currentStrokeRef.current = null;
    isDrawingRef.current = false;
    setMetrics({ coverage: 0, accuracy: 0, score: 0, isOffTarget: false });
    setHasCompleted(false);
    redrawCanvas();
  }, [currentIdx, redrawCanvas]);

  // Redraw and recompute metrics
  useEffect(() => {
    redrawCanvas();
    evaluateMetrics();
  }, [strokes, redrawCanvas, evaluateMetrics]);

  // Pointer event handlers with coordinate scaling
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = 340 / rect.width;
    const scaleY = 340 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (hasCompleted) {
      setHasCompleted(false);
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isDrawingRef.current = true;
    const pt = getCanvasCoords(e);
    currentStrokeRef.current = {
      points: [pt],
      color: brushColor,
      size: brushSize,
    };
    redrawCanvas();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    e.preventDefault();
    const pt = getCanvasCoords(e);
    currentStrokeRef.current.points.push(pt);
    redrawCanvas();
    evaluateMetrics();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      const newStrokes = [...strokesRef.current, currentStrokeRef.current];
      setStrokes(newStrokes);
    }
    currentStrokeRef.current = null;
    evaluateMetrics();
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    setHasCompleted(false);
    setStrokes(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
    strokesRef.current = [];
    currentStrokeRef.current = null;
    setMetrics({ coverage: 0, accuracy: 0, score: 0, isOffTarget: false });
    setHasCompleted(false);
    redrawCanvas();
  };

  const handleSpeak = () => {
    speechEngine.speakSantaliText(letter.olchikiBase, 'sat_Olck');
  };

  // Automated Stroke Demo Animation
  const handlePlayDemo = () => {
    if (isDemoPlaying) return;
    setIsDemoPlaying(true);
    speechEngine.speakSantaliText(letter.olchikiBase, 'sat_Olck');
    setTimeout(() => {
      setIsDemoPlaying(false);
    }, 2800);
  };

  // Adaptive thresholds based on Guideline Mode
  // Blind mode tests pure freehand memory recall: required coverage is 25% and accuracy is 45%
  const requiredCoverage = guideMode === 'blind' ? 25 : 50;
  const requiredAccuracy = guideMode === 'blind' ? 45 : 55;

  const handleFinish = () => {
    // Only allow finishing if required coverage and precision for the active mode are met with no outer stray strokes
    if (
      metrics.coverage < requiredCoverage ||
      metrics.accuracy < requiredAccuracy ||
      metrics.isOffTarget ||
      strokes.length === 0
    ) {
      return;
    }

    setHasCompleted(true);
    confetti({
      particleCount: guideMode === 'blind' ? 100 : 75,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#a855f7'],
    });
    speechEngine.playMandarDrumBeat();
    speechEngine.speakSantaliText(letter.olchikiBase, 'sat_Olck');
    if (onLetterComplete) {
      const finalScore = guideMode === 'blind' ? Math.min(100, metrics.score + 15) : metrics.score;
      onLetterComplete(letter, finalScore);
    }
  };

  const handleNextLetter = () => {
    if (currentIdx < allLetters.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrevLetter = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Star Ratings based on active mode coverage and accuracy without outer area stray ink
  const starsCount =
    guideMode === 'blind'
      ? metrics.coverage >= 45 && metrics.accuracy >= 65 && !metrics.isOffTarget
        ? 3
        : metrics.coverage >= 30 && metrics.accuracy >= 55 && !metrics.isOffTarget
        ? 2
        : metrics.coverage >= 20 && metrics.accuracy >= 45 && !metrics.isOffTarget
        ? 1
        : 0
      : metrics.coverage >= 75 && metrics.accuracy >= 75 && !metrics.isOffTarget
      ? 3
      : metrics.coverage >= 60 && metrics.accuracy >= 60 && !metrics.isOffTarget
      ? 2
      : metrics.coverage >= 45 && metrics.accuracy >= 50 && !metrics.isOffTarget
      ? 1
      : 0;

  // Letter is ready to submit when user meets required coverage and precision with zero outer stray ink
  const isReadyToSubmit =
    metrics.coverage >= requiredCoverage &&
    metrics.accuracy >= requiredAccuracy &&
    !metrics.isOffTarget &&
    strokes.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="glass-card max-w-2xl w-full rounded-3xl p-5 sm:p-7 border-2 border-emerald-500/40 shadow-2xl space-y-5 my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Ol Chiki Stroke Tracing Practice
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  {currentIdx + 1} / {allLetters.length}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Foundational letter tracing with real-time glyph precision & coverage scoring
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer border border-transparent hover:border-slate-700"
            title="Close Practice Modal"
          >
            ✕
          </button>
        </div>

        {/* Letter Quick Info & Navigation Bar */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevLetter}
              disabled={currentIdx === 0}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition cursor-pointer border border-slate-800"
              title="Previous Consonant"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextLetter}
              disabled={currentIdx === allLetters.length - 1}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition cursor-pointer border border-slate-800"
              title="Next Consonant"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-baseline gap-2 pl-2">
              <span className="text-2xl font-extrabold text-amber-300 font-olchiki">
                {letter.olchikiBase}
              </span>
              <span className="text-base font-bold text-white">
                {letter.devaConsonant}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({letter.roman} • {letter.sound})
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {letter.varga}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Stroke Watch Demo */}
            <button
              onClick={handlePlayDemo}
              disabled={isDemoPlaying}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title="Watch stroke guide demonstration"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isDemoPlaying ? 'Showing Stroke...' : 'Watch Demo'}</span>
            </button>

            {/* Audio Listen Button */}
            <button
              onClick={handleSpeak}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Pronounce this Ol Chiki letter"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Phonics Audio</span>
            </button>
          </div>
        </div>

        {/* Real-time Guidance Feedback Banner */}
        {metrics.isOffTarget ? (
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center gap-2 text-rose-300 text-xs animate-shake">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Outer area stray strokes detected! Stay inside the letter lines — stray strokes outside the glyph are rejected.</span>
          </div>
        ) : metrics.coverage < requiredCoverage && strokes.length > 0 ? (
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {guideMode === 'blind'
                ? `Draw the full letter from memory (${metrics.coverage}% of ${requiredCoverage}% required).`
                : `Keep tracing to cover the remaining letter strokes (${metrics.coverage}% of ${requiredCoverage}% required).`}
            </span>
          </div>
        ) : isReadyToSubmit && !hasCompleted ? (
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {guideMode === 'blind'
                ? '🎯 Brilliant recall from memory! Letter recognized accurately. Ready to submit!'
                : 'Great precision! All strokes are within the letter. Ready to submit!'}
            </span>
          </div>
        ) : null}

        {/* Main Canvas & Guideline Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-1">
          
          {/* Tracing Board with 4-Line Calligraphy Grid & Guide Layer */}
          <div className="relative w-[320px] sm:w-[340px] h-[320px] sm:h-[340px] rounded-3xl border-4 border-emerald-500/40 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center select-none">
            
            {/* 4-Line Calligraphy Ruling Grid */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 opacity-35">
              <div className="border-b border-rose-500/60 w-full flex justify-between items-center text-[9px] text-rose-400 font-mono tracking-wider">
                <span>ASCENDER / TOP</span>
                <span>4-LINE GRID</span>
              </div>
              <div className="border-b border-cyan-500/50 border-dashed w-full flex justify-between items-center text-[9px] text-cyan-400 font-mono tracking-wider">
                <span>WAIST / MID</span>
                <span>CENTER</span>
              </div>
              <div className="border-b-2 border-emerald-500/70 w-full flex justify-between items-center text-[9px] text-emerald-400 font-mono tracking-wider">
                <span>BASELINE</span>
                <span>GROUND</span>
              </div>
              <div className="border-b border-purple-500/50 border-dotted w-full flex justify-between items-center text-[9px] text-purple-400 font-mono tracking-wider">
                <span>DESCENDER</span>
                <span>TAIL</span>
              </div>
            </div>

            {/* Target Ol Chiki Glyph Guideline Layer - Dynamic Sizing based on Pen Tip */}
            {guideMode !== 'blind' && (
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
                  guideMode === 'ghost'
                    ? brushSize <= 8
                      ? 'opacity-35'
                      : brushSize === 14
                      ? 'opacity-45'
                      : 'opacity-60'
                    : 'opacity-30'
                }`}
              >
                <span
                  className="font-olchiki tracking-normal select-none leading-none transition-all duration-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  style={{
                    fontSize: brushSize <= 8 ? '185px' : brushSize === 14 ? '200px' : '215px',
                    fontWeight: brushSize <= 8 ? '400' : brushSize === 14 ? '700' : '900',
                    WebkitTextStroke:
                      guideMode === 'outline'
                        ? brushSize <= 8
                          ? '1.8px #10b981'
                          : brushSize === 14
                          ? '3.2px #10b981'
                          : '5.5px #10b981'
                        : brushSize >= 20
                        ? '4px rgba(255, 255, 255, 0.45)'
                        : 'none',
                    color:
                      guideMode === 'outline'
                        ? 'transparent'
                        : brushSize <= 8
                        ? 'rgba(255, 255, 255, 0.35)'
                        : brushSize === 14
                        ? 'rgba(255, 255, 255, 0.45)'
                        : 'rgba(255, 255, 255, 0.60)',
                  }}
                >
                  {letter.olchikiBase}
                </span>
              </div>
            )}

            {/* Demo Stroke Tracer Glow */}
            {isDemoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse">
                <span className="font-olchiki text-[200px] font-bold text-amber-300 drop-shadow-[0_0_30px_#f59e0b] opacity-80">
                  {letter.olchikiBase}
                </span>
              </div>
            )}

            {/* Starting Stroke Hint Indicator (Glowing Pulse Dot) */}
            <div className="absolute top-[28%] left-[42%] pointer-events-none flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/40 animate-pulse z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
              <span className="text-[10px] text-emerald-300 font-bold uppercase">Start</span>
            </div>

            {/* Interactive Drawing Canvas Layer */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* Right Control Sidepanel */}
          <div className="flex flex-col justify-between w-full md:w-56 space-y-3.5">
            
            {/* Guide Mode Toggle */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Guideline Mode
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setGuideMode('ghost')}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    guideMode === 'ghost'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Ghost
                </button>
                <button
                  onClick={() => setGuideMode('outline')}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    guideMode === 'outline'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Outline
                </button>
                <button
                  onClick={() => setGuideMode('blind')}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    guideMode === 'blind'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Test letter recall from memory"
                >
                  Blind
                </button>
              </div>
            </div>

            {/* Brush Colors */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pen Ink Color
              </label>
              <div className="flex items-center gap-2">
                {BRUSH_COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setBrushColor(c.hex)}
                    className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer ${
                      brushColor === c.hex ? 'ring-3 ring-white scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Brush Size */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pen Tip Size
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {BRUSH_SIZES.map(s => (
                  <button
                    key={s.size}
                    onClick={() => setBrushSize(s.size)}
                    className={`px-2 py-1 rounded-xl text-xs font-medium transition cursor-pointer ${
                      brushSize === s.size
                        ? 'bg-slate-700 text-white border border-emerald-500/50'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Precision & Coverage Gauges */}
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2.5">
              
              {/* Coverage (How much of the letter was traced) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">Glyph Coverage</span>
                  <span className="font-mono font-bold text-emerald-400">{metrics.coverage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${metrics.coverage}%` }}
                  />
                </div>
              </div>

              {/* Accuracy (How well you stayed within the lines) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">Line Precision</span>
                  <span
                    className={`font-mono font-bold ${
                      metrics.accuracy >= 70
                        ? 'text-emerald-400'
                        : metrics.accuracy >= 40
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {metrics.accuracy}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      metrics.accuracy >= 70
                        ? 'bg-emerald-500'
                        : metrics.accuracy >= 40
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${metrics.accuracy}%` }}
                  />
                </div>
              </div>

              {/* Stars Badge */}
              <div className="flex justify-center gap-1.5 pt-1">
                {[1, 2, 3].map(star => (
                  <span
                    key={star}
                    className={`text-base transition-transform duration-300 ${
                      star <= starsCount ? 'text-amber-400 scale-125 drop-shadow' : 'text-slate-700 opacity-40'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={strokes.length === 0}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border border-slate-800"
              title="Undo last stroke"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>

            <button
              onClick={handleClear}
              disabled={strokes.length === 0}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 disabled:opacity-40 text-xs font-semibold transition cursor-pointer border border-slate-800"
              title="Clear all strokes"
            >
              Clear Canvas
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleFinish}
              disabled={!isReadyToSubmit || hasCompleted}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition cursor-pointer ${
                hasCompleted
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-950/60'
                  : isReadyToSubmit
                  ? 'btn-shimmer bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/60'
                  : 'bg-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {hasCompleted
                  ? guideMode === 'blind'
                    ? 'Memory Mastered! (+25 XP)'
                    : 'Mastered! (+15 XP)'
                  : metrics.isOffTarget
                  ? 'Outer stray strokes detected'
                  : strokes.length === 0
                  ? guideMode === 'blind'
                    ? 'Draw from memory to begin'
                    : 'Trace the letter to begin'
                  : metrics.coverage < requiredCoverage
                  ? `Cover letter shape (${metrics.coverage}% / ${requiredCoverage}%)`
                  : metrics.accuracy < requiredAccuracy
                  ? `Improve line precision (${metrics.accuracy}% / ${requiredAccuracy}%)`
                  : guideMode === 'blind'
                  ? 'Verify Recall (+25 XP)'
                  : 'Check Stroke (+10 XP)'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
