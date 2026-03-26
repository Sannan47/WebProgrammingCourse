import React, { useEffect, useRef, useState } from 'react';
import './Ground.css';

/**
 * Ground component
 * Renders a 2D side-view cricket ground with:
 * - Ball animation: bowler → crease (CSS transition via JS)
 * - Bat swing animation triggered at ball arrival
 * - Wickets visual
 * 
 * animationPhase: 'waiting' | 'bowling' | 'batting' | 'showing'
 */
export default function Ground({ animationPhase, lastOutcome, wickets }) {
  const ballRef = useRef(null);
  const [batSwing, setBatSwing] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [ballVisible, setBallVisible] = useState(false);
  const [ballPhase, setBallPhase] = useState('reset'); // 'reset' | 'travel' | 'hit' | 'fly'
  const [flyDirection, setFlyDirection] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (animationPhase === 'bowling') {
      // Start the bowling sequence
      setBatSwing(false);
      setShowImpact(false);
      setBallPhase('reset');
      setBallVisible(true);

      // Small delay then start travel
      const t1 = setTimeout(() => {
        setBallPhase('travel');
      }, 80);

      // Ball arrives at batsman — trigger bat swing
      const t2 = setTimeout(() => {
        setBatSwing(true);
        setShowImpact(true);
        setBallPhase('hit');
      }, 880); // matches CSS transition duration

      // Impact flash off
      const t3 = setTimeout(() => setShowImpact(false), 1100);

      // Ball flies away (if not wicket/dot)
      const t4 = setTimeout(() => {
        setBallPhase('fly');
        setFlyDirection({ x: 200 + Math.random() * 100, y: -(60 + Math.random() * 80) });
      }, 1050);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    if (animationPhase === 'waiting') {
      setBallVisible(false);
      setBallPhase('reset');
      setBatSwing(false);
      setShowImpact(false);
    }
  }, [animationPhase]);

  const isWicket = lastOutcome === 'W';
  const isBoundary = lastOutcome === '4' || lastOutcome === '6';

  return (
    <div className="ground-wrapper">
      {/* Sky / background */}
      <div className="ground-sky">
        {/* Stars */}
        {Array.from({ length: 28 }, (_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${(i * 37 + i * 13) % 100}%`,
              top: `${(i * 23 + i * 7) % 60}%`,
              animationDelay: `${(i * 0.4) % 3}s`,
              width: i % 3 === 0 ? '3px' : '2px',
              height: i % 3 === 0 ? '3px' : '2px',
            }}
          />
        ))}
      </div>

      {/* Stadium lights */}
      <div className="stadium-lights">
        <div className="light-post left-post">
          <div className="light-head">
            <div className="light-bulb" /><div className="light-bulb" /><div className="light-bulb" />
          </div>
          <div className="post-column" />
        </div>
        <div className="light-post right-post">
          <div className="light-head">
            <div className="light-bulb" /><div className="light-bulb" /><div className="light-bulb" />
          </div>
          <div className="post-column" />
        </div>
      </div>

      {/* Outfield */}
      <div className="ground-outfield">
        {/* Pitch strip */}
        <div className="pitch-strip">
          {/* Crease lines */}
          <div className="crease batting-crease" />
          <div className="crease bowling-crease" />
          {/* Pitch texture stripes */}
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="pitch-stripe" style={{ left: `${10 + i * 18}%` }} />
          ))}
        </div>

        {/* Bowler (right side) */}
        <div className="bowler-figure">
          <div className="figure-head bowler-head" />
          <div className="figure-body bowler-body" />
          <div className={`figure-arm bowler-arm ${animationPhase === 'bowling' ? 'bowling-action' : ''}`} />
          <div className="figure-legs">
            <div className="leg bowler-leg-l" />
            <div className="leg bowler-leg-r" />
          </div>
        </div>

        {/* Batsman (left side) */}
        <div className="batsman-figure">
          <div className="figure-head batsman-head" />
          <div className="figure-body batsman-body" />
          <div className={`figure-arm bat-arm ${batSwing ? 'swing-up' : ''}`}>
            <div className="bat-shape" />
          </div>
          <div className="figure-legs">
            <div className={`leg batsman-leg-l ${batSwing ? 'step-forward' : ''}`} />
            <div className="leg batsman-leg-r" />
          </div>
        </div>

        {/* Wickets */}
        <div className={`wickets-set batsman-wickets ${isWicket && animationPhase === 'showing' ? 'fallen' : ''}`}>
          <div className="stump" /><div className="stump" /><div className="stump" />
          <div className="bail bail-left" /><div className="bail bail-right" />
        </div>
        <div className="wickets-set bowler-wickets">
          <div className="stump" /><div className="stump" /><div className="stump" />
          <div className="bail bail-left" /><div className="bail bail-right" />
        </div>

        {/* Cricket Ball */}
        {ballVisible && (
          <div
            ref={ballRef}
            className={`cricket-ball ball-phase-${ballPhase}`}
            style={
              ballPhase === 'fly'
                ? { '--fly-x': `${flyDirection.x}px`, '--fly-y': `${flyDirection.y}px` }
                : {}
            }
          >
            <div className="ball-seam" />
          </div>
        )}

        {/* Impact flash */}
        {showImpact && (
          <div className={`impact-flash ${isBoundary ? 'impact-boundary' : isWicket ? 'impact-wicket' : 'impact-normal'}`}>
            {isWicket ? '💥' : isBoundary ? '⚡' : '✦'}
          </div>
        )}

        {/* Boundary/Six text */}
        {animationPhase === 'showing' && (lastOutcome === '4' || lastOutcome === '6') && (
          <div className={`boundary-text ${lastOutcome === '6' ? 'six-text' : 'four-text'}`}>
            {lastOutcome === '6' ? 'SIX!' : 'FOUR!'}
          </div>
        )}
      </div>
    </div>
  );
}
