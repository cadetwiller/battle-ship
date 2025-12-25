import { Board, Position, BOARD_SIZE } from './types';

interface AIState {
  mode: 'hunt' | 'target';
  targetQueue: Position[];
  lastHit: Position | null;
  hitStreak: Position[];
}

let aiState: AIState = {
  mode: 'hunt',
  targetQueue: [],
  lastHit: null,
  hitStreak: [],
};

export function resetAI(): void {
  aiState = {
    mode: 'hunt',
    targetQueue: [],
    lastHit: null,
    hitStreak: [],
  };
}

function getAdjacentCells(pos: Position): Position[] {
  const adjacent: Position[] = [
    { row: pos.row - 1, col: pos.col },
    { row: pos.row + 1, col: pos.col },
    { row: pos.row, col: pos.col - 1 },
    { row: pos.row, col: pos.col + 1 },
  ];
  
  return adjacent.filter(
    p => p.row >= 0 && p.row < BOARD_SIZE && p.col >= 0 && p.col < BOARD_SIZE
  );
}

function isValidTarget(board: Board, pos: Position): boolean {
  const cell = board[pos.row][pos.col];
  return cell.state === 'empty' || cell.state === 'ship';
}

function getRandomTarget(board: Board): Position {
  const validTargets: Position[] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (isValidTarget(board, { row, col })) {
        validTargets.push({ row, col });
      }
    }
  }
  
  if (validTargets.length === 0) {
    return { row: 0, col: 0 };
  }
  
  return validTargets[Math.floor(Math.random() * validTargets.length)];
}

export function getAIMove(board: Board): Position {
  // Target mode: we have hits to follow up on
  if (aiState.mode === 'target' && aiState.targetQueue.length > 0) {
    // Find a valid target from the queue
    while (aiState.targetQueue.length > 0) {
      const target = aiState.targetQueue.shift()!;
      if (isValidTarget(board, target)) {
        return target;
      }
    }
    // No valid targets in queue, switch back to hunt
    aiState.mode = 'hunt';
  }
  
  // Hunt mode: random targeting with checkerboard pattern for efficiency
  return getRandomTarget(board);
}

export function updateAIAfterShot(
  board: Board,
  target: Position,
  hit: boolean,
  sunk: boolean
): void {
  if (hit) {
    aiState.lastHit = target;
    aiState.hitStreak.push(target);
    
    if (sunk) {
      // Ship sunk, clear the hit streak and go back to hunt mode
      aiState.hitStreak = [];
      aiState.targetQueue = [];
      aiState.mode = 'hunt';
    } else {
      // Hit but not sunk, add adjacent cells to target queue
      aiState.mode = 'target';
      const adjacent = getAdjacentCells(target);
      
      // If we have multiple hits, prioritize the line direction
      if (aiState.hitStreak.length >= 2) {
        const lastTwo = aiState.hitStreak.slice(-2);
        const isHorizontal = lastTwo[0].row === lastTwo[1].row;
        
        // Prioritize cells in the same line
        const prioritized = adjacent.filter(p => 
          isHorizontal ? p.row === target.row : p.col === target.col
        );
        const others = adjacent.filter(p =>
          isHorizontal ? p.row !== target.row : p.col !== target.col
        );
        
        aiState.targetQueue = [...prioritized, ...others].filter(
          p => isValidTarget(board, p) && 
          !aiState.targetQueue.some(q => q.row === p.row && q.col === p.col)
        );
      } else {
        // First hit, add all adjacent
        for (const adj of adjacent) {
          if (isValidTarget(board, adj) && 
              !aiState.targetQueue.some(q => q.row === adj.row && q.col === adj.col)) {
            aiState.targetQueue.push(adj);
          }
        }
      }
    }
  }
}
