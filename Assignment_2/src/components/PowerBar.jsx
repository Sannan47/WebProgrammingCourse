import React, { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import './PowerBar.css';

/**
 * PowerBar component
 * - Renders colored segments proportional to their probability
 * - Animates a slider using requestAnimationFrame (smooth, not setInterval)
 * - Exposes freeze() method via ref to stop the slider and return its position
 * 
 * Props:
 *   segments: Array of { outcome, start, end, color, label, probability }
 *   isActive: boolean — whether the slider should be moving
 *   onReady: called when bar is mounted and ready
 */
const PowerBar = forwardRef(function PowerBar({ segments, isActive }, ref) {
  const rafRef = useRef(null);
  const posRef = useRef(0);          // 0..1, current slider position
  const dirRef = useRef(1);          // 1 = forward, -1 = backward (bounces)
  const frozenRef = useRef(false);
  const barRef = useRef(null);
  const thumbRef = useRef(null);
  const [frozenPos, setFrozenPos] = useState(null);

  // Speed: completes a full sweep in ~1.2 seconds at 60fps (increased from 0.0055)
  const SPEED = 0.009; // position units per frame at 60fps

  /**
   * Animate the slider position using requestAnimationFrame.
   * Uses pingpong (bounces at 0 and 1) for natural feel.
   */
  const animate = useCallback(() => {
    if (frozenRef.current) return;

    posRef.current += SPEED * dirRef.current;
    if (posRef.current >= 1) {
      posRef.current = 1;
      dirRef.current = -1;
    } else if (posRef.current <= 0) {
      posRef.current = 0;
      dirRef.current = 1;
    }

    // Move the thumb DOM element directly (no React re-render = no jank)
    if (thumbRef.current && barRef.current) {
      const pct = posRef.current * 100;
      thumbRef.current.style.left = `calc(${pct}% - 3px)`;

      // Color the thumb based on current segment
      const seg = segments.find(
        (s) => posRef.current >= s.start && posRef.current < s.end
      ) || segments[segments.length - 1];
      thumbRef.current.style.background = seg.color;
      thumbRef.current.style.boxShadow = `0 0 10px 4px ${seg.color}88`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [segments]);

  /** Start the animation */
  useEffect(() => {
    if (!isActive) return;
    frozenRef.current = false;
    setFrozenPos(null);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, animate]);

  /**
   * freeze() — stops the slider and returns its current position (0..1)
   * Called by parent when "Play Shot" is clicked.
   */
  const freeze = useCallback(() => {
    frozenRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const pos = posRef.current;
    setFrozenPos(pos);
    return pos;
  }, []);

  // Expose freeze via ref
  useImperativeHandle(ref, () => ({ freeze }), [freeze]);

  // Determine which segment the frozen pos lands in (for highlight)
  const frozenSegment = frozenPos !== null
    ? segments.find((s) => frozenPos >= s.start && frozenPos < s.end) || segments[segments.length - 1]
    : null;

  return (
    <div className="powerbar-wrapper">
      <div className="powerbar-header">
        <span className="powerbar-label">POWER BAR — Timing determines outcome</span>
        {frozenSegment && (
          <span
            className="powerbar-result-badge"
            style={{ background: frozenSegment.color }}
          >
            {frozenSegment.label}
          </span>
        )}
      </div>

      {/* Main bar container */}
      <div className="powerbar-track" ref={barRef}>
        {/* Colored segments */}
        {segments.map((seg) => (
          <div
            key={seg.outcome}
            className={`powerbar-segment ${frozenSegment?.outcome === seg.outcome ? 'highlighted' : ''}`}
            style={{
              left: `${seg.start * 100}%`,
              width: `${seg.probability * 100}%`,
              background: seg.color,
            }}
          >
            {/* Always show label on every segment */}
            <span className="seg-label">{seg.label}</span>
          </div>
        ))}

        {/* Slider thumb — moved via direct DOM manipulation for 60fps */}
        <div className="powerbar-thumb" ref={thumbRef} />

        {/* Frozen marker line */}
        {frozenPos !== null && (
          <div
            className="powerbar-frozen-line"
            style={{ left: `${frozenPos * 100}%` }}
          />
        )}
      </div>

      {/* Probability legend */}
      <div className="powerbar-legend">
        {segments.map((seg) => (
          <div key={seg.outcome} className="legend-item">
            <span className="legend-dot" style={{ background: seg.color }} />
            <span className="legend-text">{seg.label}</span>
            <span className="legend-pct">{(seg.probability * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PowerBar;
