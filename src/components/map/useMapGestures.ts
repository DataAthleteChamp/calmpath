import { useState, useRef, useCallback, PointerEvent as ReactPointerEvent } from 'react';

interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const DEFAULT_VB: ViewBox = { x: 0, y: 0, w: 420, h: 650 };
const MIN_ZOOM = 0.5; // viewBox can be 2x default → 0.5x zoom
const MAX_ZOOM = 3;   // viewBox can be 1/3 default → 3x zoom

export interface MapGestureHandlers {
  onPointerDown: (e: ReactPointerEvent) => void;
  onPointerMove: (e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
  onPointerCancel: (e: ReactPointerEvent) => void;
}

export interface UseMapGesturesReturn {
  viewBox: string;
  handlers: MapGestureHandlers;
  zoomIn: () => void;
  zoomOut: () => void;
  recenter: () => void;
  focusOnPoint: (x: number, y: number, zoom?: number) => void;
}

interface PointerState {
  id: number;
  x: number;
  y: number;
}

export function useMapGestures(): UseMapGesturesReturn {
  const [vb, setVb] = useState<ViewBox>(DEFAULT_VB);

  // Pointer tracking refs (no re-renders during gesture)
  const pointersRef = useRef<PointerState[]>([]);
  const lastPanRef = useRef<{ x: number; y: number } | null>(null);
  const lastPinchDistRef = useRef<number | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);
  const svgRectRef = useRef<DOMRect | null>(null);

  const clampViewBox = useCallback((box: ViewBox): ViewBox => {
    const minW = DEFAULT_VB.w / MAX_ZOOM;
    const maxW = DEFAULT_VB.w / MIN_ZOOM;
    const w = Math.max(minW, Math.min(maxW, box.w));
    const h = (w / DEFAULT_VB.w) * DEFAULT_VB.h;
    // Keep viewBox within bounds
    const x = Math.max(-w * 0.3, Math.min(DEFAULT_VB.w - w * 0.7, box.x));
    const y = Math.max(-h * 0.3, Math.min(DEFAULT_VB.h - h * 0.7, box.y));
    return { x, y, w, h };
  }, []);

  const zoomBy = useCallback((factor: number, cx?: number, cy?: number) => {
    setVb(prev => {
      const centerX = cx ?? prev.x + prev.w / 2;
      const centerY = cy ?? prev.y + prev.h / 2;
      const newW = prev.w / factor;
      const newH = prev.h / factor;
      return clampViewBox({
        x: centerX - (centerX - prev.x) / factor,
        y: centerY - (centerY - prev.y) / factor,
        w: newW,
        h: newH,
      });
    });
  }, [clampViewBox]);

  const zoomIn = useCallback(() => zoomBy(1.4), [zoomBy]);
  const zoomOut = useCallback(() => zoomBy(1 / 1.4), [zoomBy]);
  const recenter = useCallback(() => setVb(DEFAULT_VB), []);

  const focusOnPoint = useCallback((x: number, y: number, zoom = 1.5) => {
    const w = DEFAULT_VB.w / zoom;
    const h = DEFAULT_VB.h / zoom;
    setVb(clampViewBox({ x: x - w / 2, y: y - h / 2, w, h }));
  }, [clampViewBox]);

  // Convert screen coords to SVG coords
  const screenToSvg = useCallback((sx: number, sy: number, currentVb: ViewBox): { x: number; y: number } => {
    const rect = svgRectRef.current;
    if (!rect) return { x: sx, y: sy };
    const rx = (sx - rect.left) / rect.width;
    const ry = (sy - rect.top) / rect.height;
    return {
      x: currentVb.x + rx * currentVb.w,
      y: currentVb.y + ry * currentVb.h,
    };
  }, []);

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    // Capture the SVG bounding rect once per gesture start
    const target = e.currentTarget as SVGSVGElement;
    svgRectRef.current = target.getBoundingClientRect();
    target.setPointerCapture(e.pointerId);

    const ptrs = pointersRef.current;
    ptrs.push({ id: e.pointerId, x: e.clientX, y: e.clientY });

    if (ptrs.length === 1) {
      lastPanRef.current = { x: e.clientX, y: e.clientY };

      // Double-tap detection
      const now = Date.now();
      const lastTap = lastTapRef.current;
      if (lastTap && now - lastTap.time < 350 &&
          Math.abs(e.clientX - lastTap.x) < 30 &&
          Math.abs(e.clientY - lastTap.y) < 30) {
        setVb(prev => {
          const svgPt = screenToSvg(e.clientX, e.clientY, prev);
          // If already zoomed in, reset; otherwise zoom 2x
          const isZoomed = prev.w < DEFAULT_VB.w * 0.9;
          if (isZoomed) return DEFAULT_VB;
          const newW = prev.w / 2;
          const newH = prev.h / 2;
          return clampViewBox({
            x: svgPt.x - newW / 2,
            y: svgPt.y - newH / 2,
            w: newW,
            h: newH,
          });
        });
        lastTapRef.current = null;
      } else {
        lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };
      }
    }

    if (ptrs.length === 2) {
      const dx = ptrs[0].x - ptrs[1].x;
      const dy = ptrs[0].y - ptrs[1].y;
      lastPinchDistRef.current = Math.sqrt(dx * dx + dy * dy);
      lastPanRef.current = null; // Cancel pan during pinch
    }
  }, [clampViewBox, screenToSvg]);

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    const ptrs = pointersRef.current;
    const idx = ptrs.findIndex(p => p.id === e.pointerId);
    if (idx === -1) return;
    ptrs[idx] = { id: e.pointerId, x: e.clientX, y: e.clientY };

    // Pinch zoom
    if (ptrs.length === 2 && lastPinchDistRef.current !== null) {
      const dx = ptrs[0].x - ptrs[1].x;
      const dy = ptrs[0].y - ptrs[1].y;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const scale = newDist / lastPinchDistRef.current;
      lastPinchDistRef.current = newDist;

      const midX = (ptrs[0].x + ptrs[1].x) / 2;
      const midY = (ptrs[0].y + ptrs[1].y) / 2;

      setVb(prev => {
        const svgMid = screenToSvg(midX, midY, prev);
        const newW = prev.w / scale;
        const newH = prev.h / scale;
        return clampViewBox({
          x: svgMid.x - (svgMid.x - prev.x) / scale,
          y: svgMid.y - (svgMid.y - prev.y) / scale,
          w: newW,
          h: newH,
        });
      });
      return;
    }

    // Single-finger pan
    if (ptrs.length === 1 && lastPanRef.current) {
      const dx = e.clientX - lastPanRef.current.x;
      const dy = e.clientY - lastPanRef.current.y;
      lastPanRef.current = { x: e.clientX, y: e.clientY };

      setVb(prev => {
        const rect = svgRectRef.current;
        if (!rect) return prev;
        const scaleX = prev.w / rect.width;
        const scaleY = prev.h / rect.height;
        return clampViewBox({
          ...prev,
          x: prev.x - dx * scaleX,
          y: prev.y - dy * scaleY,
        });
      });
    }
  }, [clampViewBox, screenToSvg]);

  const onPointerUp = useCallback((e: ReactPointerEvent) => {
    pointersRef.current = pointersRef.current.filter(p => p.id !== e.pointerId);
    if (pointersRef.current.length === 0) {
      lastPanRef.current = null;
      lastPinchDistRef.current = null;
    }
  }, []);

  const onPointerCancel = useCallback((e: ReactPointerEvent) => {
    pointersRef.current = pointersRef.current.filter(p => p.id !== e.pointerId);
    if (pointersRef.current.length === 0) {
      lastPanRef.current = null;
      lastPinchDistRef.current = null;
    }
  }, []);

  return {
    viewBox: `${vb.x} ${vb.y} ${vb.w} ${vb.h}`,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
    zoomIn,
    zoomOut,
    recenter,
    focusOnPoint,
  };
}
