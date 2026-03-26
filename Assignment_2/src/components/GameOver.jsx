import React from 'react';
import './GameOver.css';

export default function GameOver({ runs, wickets, reason, onRestart }) {
  // Performance rating
  const rating =
    runs >= 80 ? { label: 'WORLD CLASS', stars: 5, color: '#f1c40f' } :
    runs >= 60 ? { label: 'EXCELLENT',   stars: 4, color: '#2ecc71' } :
    runs >= 40 ? { label: 'DECENT',      stars: 3, color: '#3498db' } :
    runs >= 20 ? { label: 'AVERAGE',     stars: 2, color: '#e67e22' } :
                 { label: 'POOR',        stars: 1, color: '#e74c3c' };

  return (
    <div className="gameover-overlay">
      <div className="gameover-card">
        <div className="gameover-title">INNINGS COMPLETE</div>
        <div className="gameover-reason">{reason}</div>

        <div className="gameover-score">
          <span className="gameover-runs">{runs}</span>
          <span className="gameover-label">runs</span>
          <span className="gameover-sep">•</span>
          <span className="gameover-wkts">{wickets}</span>
          <span className="gameover-label">wickets</span>
        </div>

        <div className="gameover-rating" style={{ color: rating.color }}>
          <div className="rating-stars">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className="star-icon"
                style={{
                  opacity: i < rating.stars ? 1 : 0.2,
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                ★
              </span>
            ))}
          </div>
          <div className="rating-label">{rating.label}</div>
        </div>

        <button className="gameover-restart-btn" onClick={onRestart}>
          🏏 PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
