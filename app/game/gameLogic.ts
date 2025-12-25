import { 
  Board, 
  Cell, 
  Ship, 
  ShipType, 
  Position, 
  GameState, 
  SHIP_CONFIGS, 
  BOARD_SIZE 
} from './types';

export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE).fill(null).map(() =>
    Array(BOARD_SIZE).fill(null).map(() => ({ state: 'empty' as const }))
  );
}

export function createShip(type: ShipType): Ship {
  const config = SHIP_CONFIGS[type];
  return {
    type,
    size: config.size,
    positions: [],
    hits: 0,
    sunk: false,
    color: config.color,
  };
}

export function canPlaceShip(
  board: Board,
  ship: Ship,
  startRow: number,
  startCol: number,
  horizontal: boolean
): boolean {
  const positions = getShipPositions(ship.size, startRow, startCol, horizontal);
  
  for (const pos of positions) {
    if (pos.row < 0 || pos.row >= BOARD_SIZE || pos.col < 0 || pos.col >= BOARD_SIZE) {
      return false;
    }
    if (board[pos.row][pos.col].state === 'ship') {
      return false;
    }
  }
  return true;
}

export function getShipPositions(
  size: number,
  startRow: number,
  startCol: number,
  horizontal: boolean
): Position[] {
  const positions: Position[] = [];
  for (let i = 0; i < size; i++) {
    positions.push({
      row: horizontal ? startRow : startRow + i,
      col: horizontal ? startCol + i : startCol,
    });
  }
  return positions;
}

export function placeShip(
  board: Board,
  ship: Ship,
  startRow: number,
  startCol: number,
  horizontal: boolean
): { board: Board; ship: Ship } | null {
  if (!canPlaceShip(board, ship, startRow, startCol, horizontal)) {
    return null;
  }

  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const positions = getShipPositions(ship.size, startRow, startCol, horizontal);
  
  for (const pos of positions) {
    newBoard[pos.row][pos.col] = { state: 'ship', shipType: ship.type };
  }

  return {
    board: newBoard,
    ship: { ...ship, positions },
  };
}

export function placeShipsRandomly(board: Board, ships: Ship[]): { board: Board; ships: Ship[] } {
  let newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const placedShips: Ship[] = [];

  for (const ship of ships) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const horizontal = Math.random() > 0.5;
      const maxRow = horizontal ? BOARD_SIZE : BOARD_SIZE - ship.size;
      const maxCol = horizontal ? BOARD_SIZE - ship.size : BOARD_SIZE;
      const startRow = Math.floor(Math.random() * maxRow);
      const startCol = Math.floor(Math.random() * maxCol);

      const result = placeShip(newBoard, ship, startRow, startCol, horizontal);
      if (result) {
        newBoard = result.board;
        placedShips.push(result.ship);
        placed = true;
      }
      attempts++;
    }

    if (!placed) {
      console.error(`Failed to place ${ship.type}`);
    }
  }

  return { board: newBoard, ships: placedShips };
}

export function fireAt(
  board: Board,
  ships: Ship[],
  row: number,
  col: number
): { board: Board; ships: Ship[]; hit: boolean; sunkShip: Ship | null } {
  const cell = board[row][col];
  
  if (cell.state === 'hit' || cell.state === 'miss') {
    return { board, ships, hit: false, sunkShip: null };
  }

  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const newShips = ships.map(s => ({ ...s, positions: [...s.positions] }));
  
  let hit = false;
  let sunkShip: Ship | null = null;

  if (cell.state === 'ship') {
    newBoard[row][col] = { ...cell, state: 'hit', hasExplosion: true };
    hit = true;

    const shipIndex = newShips.findIndex(s => s.type === cell.shipType);
    if (shipIndex !== -1) {
      newShips[shipIndex] = {
        ...newShips[shipIndex],
        hits: newShips[shipIndex].hits + 1,
      };
      
      if (newShips[shipIndex].hits >= newShips[shipIndex].size) {
        newShips[shipIndex].sunk = true;
        sunkShip = newShips[shipIndex];
      }
    }
  } else {
    newBoard[row][col] = { state: 'miss' };
  }

  return { board: newBoard, ships: newShips, hit, sunkShip };
}

export function checkGameOver(ships: Ship[]): boolean {
  return ships.every(ship => ship.sunk);
}

export function createInitialShips(): Ship[] {
  return [
    createShip('carrier'),
    createShip('battleship'),
    createShip('cruiser'),
    createShip('submarine'),
    createShip('destroyer'),
  ];
}

export function initializeGame(): GameState {
  const playerBoard = createEmptyBoard();
  const aiBoard = createEmptyBoard();
  
  const playerShips = createInitialShips();
  const aiShipsBase = createInitialShips();
  
  const { board: aiPlacedBoard, ships: aiPlacedShips } = placeShipsRandomly(aiBoard, aiShipsBase);

  return {
    phase: 'setup',
    turn: 'player',
    playerBoard,
    aiBoard: aiPlacedBoard,
    playerShips,
    aiShips: aiPlacedShips,
    message: 'Place your ships! Click to place, R to rotate.',
    winner: null,
    lastHit: null,
  };
}
