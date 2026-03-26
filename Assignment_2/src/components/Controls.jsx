import React from 'react';
import './Controls.css';

/**
 * Controls component
 * - Aggressive / Defensive toggle
 * - Play Shot button (disabled when not in 'waiting' phase)
 * - Restart Game button
 */
export default function Controls({
  style,
  onStyleChange,
  onPlayShot,
  onRestart,
  animationPhase,
  isGameOver,
  ballsRemaining,
  wickets,
}) {
  const canPlay = animationPhase === 'waiting' && !isGameOver && ballsRemaining > 0;
  const canRestart = true;

  return (
    <div className="controls-wrapper">
      {/* Style selector */}
      {!isGameOver && (
        <div className="style-selector">
          <button
            className={`style-btn aggressive-btn ${style === 'aggressive' ? 'active' : ''}`}
            onClick={() => onStyleChange('aggressive')}
            disabled={!canPlay}
            title="High risk, high reward — more fours, sixes and wickets"
          >
            <span className="btn-text">Aggressive</span>
            <span className="btn-sub">High Risk</span>
          </button>

          <button
            className={`style-btn defensive-btn ${style === 'defensive' ? 'active' : ''}`}
            onClick={() => onStyleChange('defensive')}
            disabled={!canPlay}
            title="Conservative — more singles and twos, fewer risks"
          >
            <span className="btn-text">Defensive</span>
            <span className="btn-sub">Low Risk</span>
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="action-buttons">
        {!isGameOver && (
          <button
            className={`play-shot-btn ${canPlay ? 'ready' : 'busy'}`}
            onClick={onPlayShot}
            disabled={!canPlay}
          >
            {animationPhase === 'waiting' ? (
              <span>PLAY SHOT</span>
            ) : animationPhase === 'bowling' || animationPhase === 'batting' ? (
              <span>BOWLING...</span>
            ) : (
              <span>NEXT BALL</span>
            )}
          </button>
        )}

        <button className="restart-btn" onClick={onRestart}>
          <span>↺ RESTART</span>
        </button>
      </div>
    </div>
  );
}
