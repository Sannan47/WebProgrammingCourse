# 🏏 Cricket Bash — 2D Batting Game

A single-player 2D cricket batting game built with React (Vite).

## Features

- **2 overs (12 balls), 2 wickets** per match
- **Probability-based power bar** — outcome is 100% determined by slider position, never random
- **Two batting styles:** Aggressive (high risk/reward) vs Defensive (conservative)
- **Smooth 60fps slider** using `requestAnimationFrame`
- **Bowling & batting animations** with proper timing
- **Live scoreboard** with over-by-over dot tracking
- **Commentary system** with flavor text per outcome
- **Game Over screen** with performance rating

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## How to Play

1. Choose **Aggressive** or **Defensive** batting style
2. Watch the slider move across the power bar
3. Click **PLAY SHOT** to freeze the slider
4. The segment the slider lands on determines the outcome
5. Score as many runs as you can before losing 2 wickets or using all 12 balls!

## Probability System

### Aggressive
| Outcome | Probability |
|---------|-------------|
| Wicket  | 15% |
| Dot     | 8% |
| 1 Run   | 12% |
| 2 Runs  | 10% |
| 3 Runs  | 5% |
| Four    | 28% |
| Six     | 22% |

### Defensive
| Outcome | Probability |
|---------|-------------|
| Wicket  | 5% |
| Dot     | 20% |
| 1 Run   | 35% |
| 2 Runs  | 22% |
| 3 Runs  | 8% |
| Four    | 7% |
| Six     | 3% |

## Project Structure

```
src/
├── components/
│   ├── Game.jsx / Game.css          # Main container
│   ├── PowerBar.jsx / PowerBar.css  # Probability bar + slider
│   ├── Scoreboard.jsx / .css        # Live score display
│   ├── Ground.jsx / Ground.css      # 2D cricket field + animations
│   ├── Controls.jsx / Controls.css  # Style toggle + buttons
│   ├── Commentary.jsx / .css        # Shot commentary
│   └── GameOver.jsx / GameOver.css  # End screen
├── hooks/
│   └── useGameState.js              # All game state logic
├── data/
│   └── gameData.js                  # Probabilities, segments, commentary
├── App.jsx
├── main.jsx
└── index.css                        # Global styles + CSS variables
```
