import React, { useRef, useCallback, useEffect, useState } from 'react';
import './Game.css';
import { useGameState } from '../hooks/useGameState';
import PowerBar from './PowerBar';
import Scoreboard from './Scoreboard';
import Ground from './Ground';
import Controls from './Controls';
import Commentary from './Commentary';
import GameOver from './GameOver';

/**
 * Game — main container component
 * Orchestrates the full game flow:
 * 1. Slider runs on the PowerBar
 * 2. Player clicks "Play Shot" → slider freezes → position captured
 * 3. Bowling animation plays
 * 4. Outcome applied to state
 * 5. Commentary shown
 * 6. Ready for next ball
 */
export default function Game() {
  const powerBarRef = useRef(null);
  const [commentaryKey, setCommentaryKey] = useState(0);

  const {
    runs, wickets, ballsBowled, ballsRemaining,
    currentOver, ballInOver,
    style, lastOutcome, lastCommentary,
    animationPhase, isGameOver, gameOverReason,
    scoreFlash, segments,
    setStyle, processShot, applyOutcome,
    setAnimationPhase, clearFlash, restart,
  } = useGameState();

  // Whether the power bar slider should be moving
  const sliderActive = animationPhase === 'waiting' && !isGameOver;

  /**
   * Handle "Play Shot" button:
   * 1. Freeze slider → get position
   * 2. Compute outcome from position (deterministic, no random)
   * 3. Start bowling animation
   * 4. After animation, apply outcome to game state
   */
  const handlePlayShot = useCallback(() => {
    if (animationPhase !== 'waiting' || isGameOver) return;

    // Step 1: freeze slider and get position
    const position = powerBarRef.current?.freeze();
    if (position === undefined || position === null) return;

    // Step 2: determine outcome from position
    const { outcome, commentary } = processShot(position, style);

    // Step 3: start bowling animation
    setAnimationPhase('bowling');

    // Step 4: apply outcome after animation completes (~1.6s)
    setTimeout(() => {
      applyOutcome(outcome, commentary);
      setCommentaryKey((k) => k + 1);
    }, 1400);

    // Step 5: return to waiting after result shown (if game not over)
    setTimeout(() => {
      setAnimationPhase('waiting');
    }, 2800);
  }, [animationPhase, isGameOver, style, processShot, applyOutcome, setAnimationPhase]);

  const handleRestart = useCallback(() => {
    restart();
    setCommentaryKey(0);
  }, [restart]);

  return (
    <div className="game-root">
      {/* Header */}
      <header className="game-header">
        <div className="header-logo">🏏</div>
        <h1 className="game-title">CRICKET BASH</h1>
        <div className="header-tagline">2 Overs · 2 Wickets · Maximum Impact</div>
      </header>

      <main className="game-main">
        {/* Left panel — scoreboard */}
        <aside className="game-sidebar">
          <Scoreboard
            runs={runs}
            wickets={wickets}
            ballsBowled={ballsBowled}
            ballsRemaining={ballsRemaining}
            currentOver={currentOver}
            ballInOver={ballInOver}
            style={style}
            lastOutcome={lastOutcome}
            scoreFlash={scoreFlash}
            clearFlash={clearFlash}
          />
        </aside>

        {/* Center — ground + power bar + controls */}
        <section className="game-center">
          {/* Cricket ground animation */}
          <Ground
            animationPhase={animationPhase}
            lastOutcome={lastOutcome}
            wickets={wickets}
          />

          {/* Commentary strip */}
          <Commentary
            text={lastCommentary}
            outcome={lastOutcome}
            key={commentaryKey}
          />

          {/* Power bar */}
          <PowerBar
            ref={powerBarRef}
            segments={segments}
            isActive={sliderActive}
          />

          {/* Controls */}
          <Controls
            style={style}
            onStyleChange={setStyle}
            onPlayShot={handlePlayShot}
            onRestart={handleRestart}
            animationPhase={animationPhase}
            isGameOver={isGameOver}
            ballsRemaining={ballsRemaining}
            wickets={wickets}
          />
        </section>
      </main>

      {/* Game Over overlay */}
      {isGameOver && (
        <GameOver
          runs={runs}
          wickets={wickets}
          reason={gameOverReason}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
