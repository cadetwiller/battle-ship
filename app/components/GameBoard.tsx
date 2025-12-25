'use client';

import { Board, Position, BOARD_SIZE } from '../game/types';
import Cell from './Cell';

interface GameBoardProps {
  board: Board;
  onCellClick?: (row: number, col: number) => void;
  onCellHover?: (row: number, col: number) => void;
  onCellDragOver?: (e: React.DragEvent, row: number, col: number) => void;
  onCellDrop?: (e: React.DragEvent, row: number, col: number) => void;
  onBoardLeave?: () => void;
  isPlayerBoard: boolean;
  title: string;
  previewPositions?: Position[];
  isValidPreview?: boolean;
  disabled?: boolean;
  isUpperBoard?: boolean;
}

export default function GameBoard({
  board,
  onCellClick,
  onCellHover,
  onCellDragOver,
  onCellDrop,
  onBoardLeave,
  isPlayerBoard,
  title,
  previewPositions = [],
  isValidPreview = true,
  disabled = false,
  isUpperBoard = false,
}: GameBoardProps) {
  const colLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
  const isPreviewCell = (row: number, col: number) => {
    return previewPositions.some(p => p.row === row && p.col === col);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold mb-3 text-cyan-300 tracking-wider"
        style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {title}
      </h2>
      
      {/* Blue plastic board frame - upper board is flat, lower board has depth */}
      <div 
        className={`relative p-4 ${isUpperBoard ? 'rounded-t-2xl rounded-b-lg' : 'rounded-lg'}`}
        onMouseLeave={onBoardLeave}
        style={{
          background: isUpperBoard 
            ? 'linear-gradient(180deg, #1a6080 0%, #1a5070 30%, #1a4a6a 70%, #1a4060 100%)'
            : 'linear-gradient(180deg, #1a5a7a 0%, #0a4a6a 30%, #0a3a5a 70%, #0a2a4a 100%)',
          boxShadow: isUpperBoard
            ? `
              inset 2px 2px 6px rgba(100,180,220,0.15), 
              inset -2px -2px 6px rgba(0,0,0,0.3),
              0 4px 8px rgba(0,0,0,0.3)
            `
            : `
              inset 4px 4px 8px rgba(100,180,220,0.2), 
              inset -4px -4px 8px rgba(0,0,0,0.4),
              0 8px 16px rgba(0,0,0,0.5),
              0 0 40px rgba(0,100,150,0.2)
            `,
          border: isUpperBoard ? '2px solid #2a7090' : '3px solid #2a6a8a',
          borderRadius: isUpperBoard ? '16px 16px 8px 8px' : '12px',
        }}
      >
        {/* Column labels - numbers like the board game */}
        <div className="flex ml-8 sm:ml-10 mb-1">
          {Array.from({ length: BOARD_SIZE }, (_, i) => (
            <div
              key={i}
              className="w-8 h-6 sm:w-10 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold"
              style={{ 
                color: '#8ac0e0',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Board grid with row labels */}
        <div className="flex">
          {/* Row labels - letters like the board game */}
          <div className="flex flex-col mr-1">
            {colLabels.map((label) => (
              <div
                key={label}
                className="w-6 h-8 sm:w-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-bold"
                style={{ 
                  color: '#8ac0e0',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid - recessed area for the cells */}
          <div 
            className={`
              grid gap-[2px] p-1 rounded
              ${disabled ? 'opacity-50 pointer-events-none' : ''}
            `}
            style={{ 
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
              background: 'linear-gradient(180deg, #0a3a5a 0%, #1a4a6a 100%)',
              boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(100,180,220,0.1)',
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  cell={cell}
                  onClick={
                    onCellClick && !disabled
                      ? () => onCellClick(rowIndex, colIndex)
                      : undefined
                  }
                  onHover={
                    onCellHover && !disabled
                      ? () => onCellHover(rowIndex, colIndex)
                      : undefined
                  }
                  onDragOver={
                    onCellDragOver && !disabled
                      ? (e) => onCellDragOver(e, rowIndex, colIndex)
                      : undefined
                  }
                  onDrop={
                    onCellDrop && !disabled
                      ? (e) => onCellDrop(e, rowIndex, colIndex)
                      : undefined
                  }
                  isPlayerBoard={isPlayerBoard}
                  isPreview={isPreviewCell(rowIndex, colIndex)}
                  isValidPreview={isValidPreview}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
