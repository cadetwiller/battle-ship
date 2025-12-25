export type CellState = 'empty' | 'ship' | 'hit' | 'miss';

export type ShipType = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

export interface Ship {
  type: ShipType;
  size: number;
  positions: Position[];
  hits: number;
  sunk: boolean;
  color: string;
}

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  state: CellState;
  shipType?: ShipType;
  hasExplosion?: boolean;
}

export type Board = Cell[][];

export type GamePhase = 'setup' | 'playing' | 'gameOver';

export type Turn = 'player' | 'ai';

export interface GameState {
  phase: GamePhase;
  turn: Turn;
  playerBoard: Board;
  aiBoard: Board;
  playerShips: Ship[];
  aiShips: Ship[];
  message: string;
  winner: Turn | null;
  lastHit: Position | null;
}

export const SHIP_CONFIGS: Record<ShipType, { size: number; color: string }> = {
  carrier: { size: 5, color: '#FF6B6B' },
  battleship: { size: 4, color: '#4ECDC4' },
  cruiser: { size: 3, color: '#45B7D1' },
  submarine: { size: 3, color: '#96CEB4' },
  destroyer: { size: 2, color: '#FFEAA7' },
};

export const BOARD_SIZE = 10;
