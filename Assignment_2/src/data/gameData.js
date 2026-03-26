/**
 * PROBABILITY DISTRIBUTIONS
 * Each outcome maps to a probability weight.
 * Segments on the power bar are sized proportionally.
 * 
 * Aggressive: higher boundaries (4,6) + higher wicket risk
 * Defensive:  lower boundaries + lower wicket risk, more 1s/2s
 * 
 * All values MUST sum to 1.0
 */

export const OUTCOMES = ['W', '0', '1', '2', '3', '4', '6'];

export const PROBABILITIES = {
  aggressive: {
    W:  0.15,   // 15% wicket - high risk
    '0': 0.08,  // 8%  dot ball
    '1': 0.12,  // 12% single
    '2': 0.10,  // 10% two
    '3': 0.05,  // 5%  three
    '4': 0.28,  // 28% four - high reward
    '6': 0.22,  // 22% six  - high reward
  },
  defensive: {
    W:  0.05,   // 5%  wicket - low risk
    '0': 0.20,  // 20% dot ball - more conservative
    '1': 0.35,  // 35% single - bread & butter
    '2': 0.22,  // 22% two
    '3': 0.08,  // 8%  three
    '4': 0.07,  // 7%  four - low boundary
    '6': 0.03,  // 3%  six  - rare
  },
};

// Verify sums (will log warning in dev if wrong)
Object.entries(PROBABILITIES).forEach(([style, dist]) => {
  const sum = Object.values(dist).reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1.0) > 0.0001) {
    console.warn(`Probability for ${style} does not sum to 1: ${sum}`);
  }
});

/**
 * Build sorted segments array from a probability distribution.
 * Each segment: { outcome, start, end, color }
 * start/end are 0..1 representing position on power bar.
 */
export const SEGMENT_COLORS = {
  W:   '#c0392b',  // danger red
  '0': '#555e6b',  // grey dot
  '1': '#3498db',  // blue single
  '2': '#27ae60',  // green two
  '3': '#8e44ad',  // purple three
  '4': '#e67e22',  // orange four
  '6': '#f1c40f',  // gold six
};

export const SEGMENT_LABELS = {
  W:   'OUT!',
  '0': 'DOT',
  '1': '1 RUN',
  '2': '2 RUNS',
  '3': '3 RUNS',
  '4': 'FOUR!',
  '6': 'SIX!',
};

/**
 * Convert a probability distribution into ordered power bar segments.
 * Outcomes are arranged in ascending risk/reward order on the bar.
 */
export function buildSegments(style) {
  const dist = PROBABILITIES[style];
  // Order: W, 0, 1, 2, 3, 4, 6
  const order = OUTCOMES;
  let cursor = 0;
  return order.map((outcome) => {
    const prob = dist[outcome];
    const segment = {
      outcome,
      start: cursor,
      end: cursor + prob,
      color: SEGMENT_COLORS[outcome],
      label: SEGMENT_LABELS[outcome],
      probability: prob,
    };
    cursor += prob;
    return segment;
  });
}

/**
 * Given a slider position (0..1) and segments array,
 * return the outcome for that position.
 * This is the ONLY place outcomes are determined — no Math.random().
 */
export function getOutcomeFromPosition(position, segments) {
  const seg = segments.find((s) => position >= s.start && position < s.end);
  // Edge case: position === 1.0 exactly
  if (!seg) return segments[segments.length - 1].outcome;
  return seg.outcome;
}

/** Commentary lines per outcome */
export const COMMENTARY = {
  W: [
    "Oh no! Timber! The stumps are shattered!",
    "He's gone! A big wicket falls!",
    "Caught behind! The crowd is stunned!",
    "Bowled him! What a delivery!",
    "That's the end of that partnership!",
  ],
  '0': [
    "Defended solidly. Dot ball.",
    "Good length delivery, no run off that.",
    "The bowler wins this battle.",
    "Tight line, batsman can't score.",
    "Maiden territory — nothing there.",
  ],
  '1': [
    "Nudged away for a single.",
    "Rotated the strike. 1 run.",
    "Pushed to mid-on, they scamper through.",
    "Good running between the wickets.",
    "One off the pads, keeps it ticking.",
  ],
  '2': [
    "Driven through the covers for 2!",
    "Good running — they come back for two.",
    "Punched to the outfield, 2 runs.",
    "They work it for a couple!",
    "Timed nicely, two more runs!",
  ],
  '3': [
    "Excellent running, 3 runs!",
    "Deep in the outfield — they get three!",
    "Threaded the gap beautifully, 3 runs!",
    "Great placement, 3 runs on the board.",
    "They turn back for the third!",
  ],
  '4': [
    "FOUR! Thunderous drive through the covers!",
    "FOUR! Cracked through mid-wicket!",
    "FOUR! That raced to the boundary!",
    "FOUR! Exquisite timing on the off side!",
    "FOUR! The fielder dives but can't stop it!",
  ],
  '6': [
    "SIX! That's MASSIVE! Into the stands!",
    "SIX! Cleared the rope with ease!",
    "SIX! A monster hit! The crowd goes wild!",
    "SIX! Over long-on for a maximum!",
    "SIX! Absolutely creamed! What a shot!",
  ],
};

export function getCommentary(outcome) {
  const lines = COMMENTARY[outcome];
  // Using array index from outcome itself as deterministic seed is fine for commentary
  // We allow Math.random() ONLY here since commentary is flavor text, not game outcome
  return lines[Math.floor(Math.random() * lines.length)];
}

export const TOTAL_BALLS = 12;
export const MAX_WICKETS = 2;
