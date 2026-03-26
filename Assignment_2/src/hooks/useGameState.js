import { useState, useCallback } from 'react';
import {
  TOTAL_BALLS,
  MAX_WICKETS,
  buildSegments,
  getOutcomeFromPosition,
  getCommentary,
} from '../data/gameData';

const initialState = () => ({
  runs: 0,
  wickets: 0,
  ballsBowled: 0,
  style: 'aggressive',        // 'aggressive' | 'defensive'
  lastOutcome: null,          // outcome string
  lastCommentary: '',
  gamePhase: 'idle',          // 'idle' | 'bowling' | 'result' | 'over'
  animationPhase: 'waiting',  // 'waiting' | 'bowling' | 'batting' | 'showing'
  isGameOver: false,
  gameOverReason: '',
  scoreFlash: false,
});

export function useGameState() {
  const [state, setState] = useState(initialState());

  /** 
   * Change batting style (only allowed when not mid-ball)
   */
  const setStyle = useCallback((style) => {
    setState((s) => {
      if (s.animationPhase !== 'waiting') return s;
      return { ...s, style };
    });
  }, []);

  /**
   * Process a played shot: given slider position (0..1) and current style,
   * compute outcome deterministically and update state.
   * Returns the outcome string.
   */
  const processShot = useCallback((sliderPosition, style) => {
    const segments = buildSegments(style);
    const outcome = getOutcomeFromPosition(sliderPosition, segments);
    const commentary = getCommentary(outcome);
    return { outcome, commentary };
  }, []);

  /**
   * Apply outcome to game state after animation completes.
   */
  const applyOutcome = useCallback((outcome, commentary) => {
    setState((s) => {
      const isWicket = outcome === 'W';
      const runs = s.runs + (isWicket ? 0 : parseInt(outcome, 10));
      const wickets = s.wickets + (isWicket ? 1 : 0);
      const ballsBowled = s.ballsBowled + 1;

      const isGameOver =
        wickets >= MAX_WICKETS || ballsBowled >= TOTAL_BALLS;

      let gameOverReason = '';
      if (wickets >= MAX_WICKETS) gameOverReason = 'All wickets lost!';
      else if (ballsBowled >= TOTAL_BALLS) gameOverReason = 'All overs completed!';

      return {
        ...s,
        runs,
        wickets,
        ballsBowled,
        lastOutcome: outcome,
        lastCommentary: commentary,
        animationPhase: 'showing',
        isGameOver,
        gameOverReason,
        scoreFlash: !isWicket,
      };
    });
  }, []);

  /** Set animation phase externally */
  const setAnimationPhase = useCallback((phase) => {
    setState((s) => ({ ...s, animationPhase: phase }));
  }, []);

  /** Reset score flash */
  const clearFlash = useCallback(() => {
    setState((s) => ({ ...s, scoreFlash: false }));
  }, []);

  /** Restart the whole game */
  const restart = useCallback(() => {
    setState(initialState());
  }, []);

  // Derived
  const ballsRemaining = TOTAL_BALLS - state.ballsBowled;
  const currentOver = Math.floor(state.ballsBowled / 6) + 1;
  const ballInOver = state.ballsBowled % 6;
  const segments = buildSegments(state.style);

  return {
    ...state,
    ballsRemaining,
    currentOver,
    ballInOver,
    segments,
    setStyle,
    processShot,
    applyOutcome,
    setAnimationPhase,
    clearFlash,
    restart,
  };
}
