# Battleship

A classic Battleship naval combat game built with Next.js, React, and TypeScript. Test your luck in naval battle against an AI opponent!

## About

This is a web-based implementation of the classic Battleship board game. Features include:

- **Classic Gameplay**: Place your fleet of 5 ships and take turns firing at the enemy grid
- **AI Opponent**: Play against a computer opponent with intelligent targeting
- **Drag & Drop Ship Placement**: Easily position your ships by dragging them onto the board
- **Visual Board Game Aesthetic**: Styled to look like the classic physical Battleship board game with 3D depth effects
- **Responsive Design**: Works on desktop and tablet screens
- **Hit/Miss Animations**: Visual feedback with explosion animations and peg markers

### Ships

- Carrier (5 cells)
- Battleship (4 cells)
- Cruiser (3 cells)
- Submarine (3 cells)
- Destroyer (2 cells)

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: React 19

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm, npm, or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd battle-ship
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play!

## How to Play

1. **Setup Phase**: Drag ships from the dock onto your board. Press `R` or right-click to rotate ships before placing.
2. **Battle Phase**: Click on the enemy grid to fire. Red pegs indicate hits, white pegs indicate misses.
3. **Win Condition**: Sink all 5 enemy ships before they sink yours!

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## License

MIT
