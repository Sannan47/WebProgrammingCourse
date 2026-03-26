import React, { useEffect, useRef } from 'react';
import './Scoreboard.css';
import { TOTAL_BALLS, MAX_WICKETS } from '../data/gameData';

export default function Scoreboard({
  runs,
  wickets,
  ballsBowled,
  ballsRemaining,
  currentOver,
  ballInOver,
  style,
  lastOutcome,
  scoreFlash,
  clearFlash,
}) {
  const runsRef = useRef(null);

  // Flash the runs display when score changes
  useEffect(() => {
    if (scoreFlash && runsRef.current) {
      runsRef.current.classList.remove('score-flash');
      void runsRef.current.offsetWidth; // reflow
      runsRef.current.classList.add('score-flash');
      const t = setTimeout(() => clearFlash(), 600);
      return () => clearTimeout(t);
    }
  }, [scoreFlash, runs, clearFlash]);

  // Build over dots: filled = bowled, current = active, empty = remaining
  const overDots = Array.from({ length: 6 }, (_, i) => {
    if (i < ballInOver) return 'done';
    if (i === ballInOver && ballsBowled < TOTAL_BALLS) return 'current';
    return 'empty';
  });

  return (
    <div className="scoreboard">
      {/* Main score */}
      <div className="score-main">
        <div className="score-block runs-block">
          <span className="score-number" ref={runsRef}>{runs}</span>
          <span className="score-sub-label">RUNS</span>
        </div>
        <div className="score-divider">
          <span className="score-slash">/</span>
        </div>
        <div className="score-block wickets-block">
          <span className={`score-number wickets-num ${wickets >= MAX_WICKETS ? 'all-out' : ''}`}>
            {wickets}
          </span>
          <span className="score-sub-label">WICKETS</span>
        </div>
      </div>

      {/* Over info */}
      <div className="over-info">
        <div className="over-label-row">
          <span className="over-title">OVER {currentOver}</span>
          <span className="balls-left">{ballsRemaining} balls left</span>
        </div>
        <div className="over-dots-row">
          {overDots.map((state, i) => (
            <div key={i} className={`over-dot over-dot--${state}`} />
          ))}
        </div>
      </div>

      {/* Style indicator */}
      <div className={`style-badge style-badge--${style}`}>
        {style === 'aggressive' ? '⚡ AGGRESSIVE' : '🛡 DEFENSIVE'}
      </div>

      {/* Last outcome badge */}
      {lastOutcome !== null && (
        <div className={`last-outcome outcome--${lastOutcome === 'W' ? 'wicket' : lastOutcome}`}>
          {lastOutcome === 'W' ? 'OUT!' :
           lastOutcome === '0' ? 'DOT' :
           lastOutcome === '4' ? 'FOUR!' :
           lastOutcome === '6' ? 'SIX!' :
           `${lastOutcome} RUN${lastOutcome !== '1' ? 'S' : ''}`}
        </div>
      )}
    </div>
  );
}
