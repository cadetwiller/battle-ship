'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, Position, Ship, SHIP_CONFIGS, ShipType } from '../game/types';
import {
  initializeGame,
  placeShip,
  fireAt,
  checkGameOver,
  canPlaceShip,
  getShipPositions,
} from '../game/gameLogic';
import { getAIMove, updateAIAfterShot, resetAI } from '../game/aiLogic';
import GameBoard from './GameBoard';
import DraggableShip from './DraggableShip';

const SHIP_ORDER: ShipType[] = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'];

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());
  const [placedShipTypes, setPlacedShipTypes] = useState<Set<ShipType>>(new Set());
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [draggingShip, setDraggingShip] = useState<Ship | null>(null);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [hoverPosition, setHoverPosition] = useState<Position | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const activeShip = draggingShip || selectedShip;

  // Handle keyboard for rotation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r' && gameState.phase === 'setup') {
        setIsHorizontal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase]);

  // Get preview positions for ship placement
  const getPreviewPositions = useCallback((): Position[] => {
    if (gameState.phase !== 'setup' || !hoverPosition || !activeShip) return [];
    return getShipPositions(activeShip.size, hoverPosition.row, hoverPosition.col, isHorizontal);
  }, [gameState.phase, hoverPosition, activeShip, isHorizontal]);

  const isValidPlacement = useCallback((): boolean => {
    if (!hoverPosition || !activeShip) return false;
    return canPlaceShip(gameState.playerBoard, activeShip, hoverPosition.row, hoverPosition.col, isHorizontal);
  }, [gameState.playerBoard, activeShip, hoverPosition, isHorizontal]);

  // Handle ship selection
  const handleShipSelect = (ship: Ship) => {
    if (placedShipTypes.has(ship.type)) return;
    setSelectedShip(ship);
  };

  // Handle drag start
  const handleDragStart = (ship: Ship) => {
    if (placedShipTypes.has(ship.type)) return;
    setDraggingShip(ship);
    setSelectedShip(ship);
  };

  // Handle drag over board
  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    setHoverPosition({ row, col });
  };

  // Handle drop on board
  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (!activeShip) return;
    placeShipAtPosition(row, col);
    setDraggingShip(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggingShip(null);
  };

  // Handle cell hover for preview
  const handleCellHover = (row: number, col: number) => {
    if (gameState.phase === 'setup' && activeShip) {
      setHoverPosition({ row, col });
    }
  };

  // Handle mouse leave board
  const handleBoardLeave = () => {
    setHoverPosition(null);
  };

  // Place ship at position (used by both click and drop)
  const placeShipAtPosition = (row: number, col: number) => {
    if (gameState.phase !== 'setup' || !activeShip) return;

    const result = placeShip(gameState.playerBoard, activeShip, row, col, isHorizontal);
    if (result) {
      const shipIndex = gameState.playerShips.findIndex(s => s.type === activeShip.type);
      const newPlayerShips = [...gameState.playerShips];
      newPlayerShips[shipIndex] = result.ship;

      const newPlacedTypes = new Set(placedShipTypes);
      newPlacedTypes.add(activeShip.type);
      setPlacedShipTypes(newPlacedTypes);

      const allPlaced = newPlacedTypes.size === SHIP_ORDER.length;

      setGameState(prev => ({
        ...prev,
        playerBoard: result.board,
        playerShips: newPlayerShips,
        phase: allPlaced ? 'playing' : 'setup',
        message: allPlaced 
          ? 'All ships placed! Your turn - attack the enemy!' 
          : 'Drag or select a ship, then click to place. Press R to rotate.',
      }));

      setSelectedShip(null);
      setHoverPosition(null);
    }
  };

  // Handle player board click (ship placement)
  const handlePlayerBoardClick = (row: number, col: number) => {
    if (gameState.phase !== 'setup' || !activeShip) return;
    placeShipAtPosition(row, col);
  };

  // Handle AI board click (attack)
  const handleAIBoardClick = (row: number, col: number) => {
    if (gameState.phase !== 'playing' || gameState.turn !== 'player' || isAIThinking) return;

    const cell = gameState.aiBoard[row][col];
    if (cell.state === 'hit' || cell.state === 'miss') return;

    const { board, ships, hit, sunkShip } = fireAt(gameState.aiBoard, gameState.aiShips, row, col);

    let message = hit ? 'HIT!' : 'Miss...';
    if (sunkShip) {
      message = `You sunk their ${sunkShip.type}!`;
    }

    if (checkGameOver(ships)) {
      setGameState(prev => ({
        ...prev,
        aiBoard: board,
        aiShips: ships,
        phase: 'gameOver',
        winner: 'player',
        message: '🎉 VICTORY! You destroyed the enemy fleet!',
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      aiBoard: board,
      aiShips: ships,
      turn: 'ai',
      message,
    }));

    // Trigger AI turn
    setIsAIThinking(true);
  };

  // AI turn logic
  useEffect(() => {
    if (gameState.turn !== 'ai' || gameState.phase !== 'playing' || !isAIThinking) return;

    const aiTurnTimeout = setTimeout(() => {
      const target = getAIMove(gameState.playerBoard);
      const { board, ships, hit, sunkShip } = fireAt(
        gameState.playerBoard,
        gameState.playerShips,
        target.row,
        target.col
      );

      updateAIAfterShot(board, target, hit, sunkShip !== null);

      let message = hit ? 'Enemy HIT your ship!' : 'Enemy missed!';
      if (sunkShip) {
        message = `Enemy sunk your ${sunkShip.type}!`;
      }

      if (checkGameOver(ships)) {
        setGameState(prev => ({
          ...prev,
          playerBoard: board,
          playerShips: ships,
          phase: 'gameOver',
          winner: 'ai',
          message: '💀 DEFEAT! Your fleet has been destroyed!',
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          playerBoard: board,
          playerShips: ships,
          turn: 'player',
          message: message + ' Your turn!',
        }));
      }

      setIsAIThinking(false);
    }, 1000);

    return () => clearTimeout(aiTurnTimeout);
  }, [gameState.turn, gameState.phase, isAIThinking, gameState.playerBoard, gameState.playerShips]);

  // Reset game
  const handleNewGame = () => {
    resetAI();
    setGameState(initializeGame());
    setPlacedShipTypes(new Set());
    setSelectedShip(null);
    setDraggingShip(null);
    setIsHorizontal(true);
    setHoverPosition(null);
    setIsAIThinking(false);
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-8"
      style={{
        background: 'linear-gradient(180deg, #1a2a3a 0%, #0a1a2a 50%, #0a0a1a 100%)',
      }}
    >
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-wider mb-2"
          style={{
            color: '#60c0e0',
            textShadow: '3px 3px 6px rgba(0,0,0,0.5), 0 0 20px rgba(100,200,255,0.3)',
            fontFamily: 'Arial Black, sans-serif',
          }}
        >
          BATTLESHIP
        </h1>
        <p className="text-cyan-500 text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
          NAVAL COMBAT GAME
        </p>
      </header>

      {/* Game Status */}
      <div className="text-center mb-6">
        <div 
          className="inline-block px-6 py-3 rounded-lg text-lg font-bold"
          style={{
            background: gameState.phase === 'gameOver' 
              ? gameState.winner === 'player' 
                ? 'linear-gradient(180deg, #2a5a2a 0%, #1a4a1a 100%)' 
                : 'linear-gradient(180deg, #5a2a2a 0%, #4a1a1a 100%)'
              : 'linear-gradient(180deg, #2a4a6a 0%, #1a3a5a 100%)',
            boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.4)',
            border: '2px solid',
            borderColor: gameState.phase === 'gameOver' 
              ? gameState.winner === 'player' ? '#4a8a4a' : '#8a4a4a'
              : '#4a7a9a',
            color: gameState.phase === 'gameOver' 
              ? gameState.winner === 'player' ? '#80e080' : '#e08080'
              : '#a0d0f0',
          }}
        >
          {gameState.message}
        </div>
        
        {gameState.phase === 'setup' && (
          <div className="mt-3 text-sm text-gray-400">
            <span className="text-cyan-400">Orientation:</span> {isHorizontal ? 'Horizontal' : 'Vertical'} 
            <span className="ml-4 text-gray-500">(Press R to rotate)</span>
          </div>
        )}

        {isAIThinking && (
          <div className="mt-3 text-yellow-400 animate-pulse font-bold">
            Enemy is targeting...
          </div>
        )}
      </div>

      {/* New Game Button - Above AI board */}
      {gameState.phase === 'gameOver' && (
        <div className="text-center mb-4">
          <button
            onClick={handleNewGame}
            className="px-8 py-4 font-bold text-xl rounded-lg transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, #2a6a8a 0%, #1a5a7a 50%, #0a4a6a 100%)',
              boxShadow: 'inset 2px 2px 4px rgba(100,200,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)',
              border: '3px solid #3a8aaa',
              color: '#a0e0ff',
            }}
          >
            NEW GAME
          </button>
        </div>
      )}

      {/* Game Boards - Vertical layout like the real board game */}
      <div className="flex flex-col items-center gap-4">
        
        {/* ENEMY BOARD (TOP) - Flat like the hinged upper screen with side panels */}
        <div className="flex flex-row items-start justify-center gap-4">
          {/* Left side panel - Enemy fleet status */}
          <div 
            className="p-3 rounded-lg hidden md:block"
            style={{
              background: 'linear-gradient(180deg, #1a5070 0%, #0a3a5a 100%)',
              boxShadow: 'inset 2px 2px 4px rgba(100,180,220,0.1), inset -2px -2px 4px rgba(0,0,0,0.3)',
              border: '2px solid #2a6080',
              minWidth: '140px',
            }}
          >
            <h4 className="text-sm font-bold text-red-400 mb-2">ENEMY FLEET</h4>
            <div className="space-y-1">
              {gameState.aiShips.map((ship) => (
                <div 
                  key={ship.type} 
                  className={`flex items-center gap-1 p-1 rounded text-xs ${ship.sunk ? 'opacity-50' : ''}`}
                  style={{
                    background: ship.sunk 
                      ? 'linear-gradient(180deg, #3a2a2a 0%, #2a1a1a 100%)'
                      : 'linear-gradient(180deg, #1a3a4a 0%, #0a2a3a 100%)',
                  }}
                >
                  <div className="flex gap-[1px]">
                    {Array.from({ length: ship.size }, (_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          background: ship.sunk 
                            ? '#404040'
                            : 'linear-gradient(145deg, #707070 0%, #505050 100%)',
                        }}
                      />
                    ))}
                  </div>
                  {ship.sunk && <span className="text-red-400 ml-auto">✗</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Enemy Board */}
          <GameBoard
            board={gameState.aiBoard}
            onCellClick={gameState.phase === 'playing' ? handleAIBoardClick : undefined}
            isPlayerBoard={false}
            title="ENEMY WATERS"
            disabled={gameState.phase !== 'playing' || gameState.turn !== 'player' || isAIThinking}
            isUpperBoard={true}
          />

          {/* Right side panel - placeholder for symmetry or controls */}
          <div 
            className="p-3 rounded-lg hidden md:block"
            style={{
              background: 'linear-gradient(180deg, #1a5070 0%, #0a3a5a 100%)',
              boxShadow: 'inset 2px 2px 4px rgba(100,180,220,0.1), inset -2px -2px 4px rgba(0,0,0,0.3)',
              border: '2px solid #2a6080',
              minWidth: '140px',
            }}
          >
            <h4 className="text-sm font-bold text-cyan-400 mb-2">STATUS</h4>
            <div className="text-xs text-cyan-200/70 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #ff6060, #aa0000)' }} />
                <span>Hit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #ffffff, #c0c0c0)' }} />
                <span>Miss</span>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYER BOARD (BOTTOM) - With 3D depth/perspective effect */}
        <div 
          className="flex flex-row items-stretch justify-center"
          style={{
            transform: 'perspective(800px) rotateX(12deg)',
            transformOrigin: 'center top',
          }}
        >
          {/* Left side - Ship Dock during setup, or Your Fleet status during play */}
          <div 
            className="p-3 overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #1a4a6a 0%, #0a3a5a 100%)',
              boxShadow: 'inset 2px 2px 4px rgba(100,180,220,0.2), inset -2px -2px 4px rgba(0,0,0,0.3)',
              borderTop: '2px solid #2a6a8a',
              borderLeft: '2px solid #2a6a8a',
              borderBottom: '2px solid #2a6a8a',
              borderRight: '1px solid #1a4a6a',
              borderRadius: '12px 0 0 12px',
              width: '180px',
            }}
          >
            {gameState.phase === 'setup' ? (
              <>
                <h4 className="text-sm font-bold text-cyan-300 mb-2">SHIP DOCK</h4>
                <p className="text-[10px] text-cyan-200/60 mb-3">
                  Drag to board. Press R to rotate.
                </p>
                <div className="space-y-1">
                  {gameState.playerShips.map((ship) => (
                    <DraggableShip
                      key={ship.type}
                      ship={ship}
                      isPlaced={placedShipTypes.has(ship.type)}
                      isSelected={selectedShip?.type === ship.type}
                      isHorizontal={isHorizontal}
                      onDragStart={handleDragStart}
                      onClick={handleShipSelect}
                      onRotate={() => setIsHorizontal(prev => !prev)}
                    />
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-cyan-700/50">
                  <button
                    onClick={() => setIsHorizontal(prev => !prev)}
                    className="w-full px-2 py-1 rounded text-cyan-200 font-bold text-xs"
                    style={{
                      background: 'linear-gradient(180deg, #2a5a7a 0%, #1a4a6a 100%)',
                      border: '1px solid #3a7a9a',
                    }}
                  >
                    {isHorizontal ? '↔ Horizontal' : '↕ Vertical'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4 className="text-sm font-bold text-cyan-300 mb-2">YOUR FLEET</h4>
                <div className="space-y-1">
                  {gameState.playerShips.map((ship) => (
                    <div 
                      key={ship.type} 
                      className={`flex items-center gap-1 p-1 rounded text-xs ${ship.sunk ? 'opacity-50' : ''}`}
                      style={{
                        background: ship.sunk 
                          ? 'linear-gradient(180deg, #3a2a2a 0%, #2a1a1a 100%)'
                          : 'linear-gradient(180deg, #1a3a4a 0%, #0a2a3a 100%)',
                      }}
                    >
                      <div className="flex gap-[1px]">
                        {Array.from({ length: ship.size }, (_, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-sm"
                            style={{
                              background: ship.sunk 
                                ? '#404040'
                                : 'linear-gradient(145deg, #707070 0%, #505050 100%)',
                            }}
                          />
                        ))}
                      </div>
                      {ship.sunk && <span className="text-red-400 ml-auto">✗</span>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Player Board - no individual transform, parent has the 3D effect */}
          <div>
            <GameBoard
              board={gameState.playerBoard}
              onCellClick={gameState.phase === 'setup' ? handlePlayerBoardClick : undefined}
              onCellHover={gameState.phase === 'setup' ? handleCellHover : undefined}
              onCellDragOver={gameState.phase === 'setup' ? handleDragOver : undefined}
              onCellDrop={gameState.phase === 'setup' ? handleDrop : undefined}
              onBoardLeave={handleBoardLeave}
              isPlayerBoard={true}
              title="YOUR FLEET"
              previewPositions={getPreviewPositions()}
              isValidPreview={isValidPlacement()}
              disabled={gameState.phase === 'playing' && gameState.turn === 'ai'}
            />
          </div>

          {/* Right side - Peg storage area like the board game */}
          <div 
            className="p-3 hidden md:block"
            style={{
              background: 'linear-gradient(180deg, #1a4a6a 0%, #0a3a5a 100%)',
              boxShadow: 'inset 2px 2px 4px rgba(100,180,220,0.2), inset -2px -2px 4px rgba(0,0,0,0.3)',
              borderTop: '2px solid #2a6a8a',
              borderRight: '2px solid #2a6a8a',
              borderBottom: '2px solid #2a6a8a',
              borderLeft: '1px solid #1a4a6a',
              borderRadius: '0 12px 12px 0',
              minWidth: '100px',
            }}
          >
            <h4 className="text-sm font-bold text-cyan-400 mb-2">PEGS</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {/* Red pegs */}
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={`red-${i}`}
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #ff6060, #aa0000)',
                    boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {/* White pegs */}
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={`white-${i}`}
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #ffffff, #c0c0c0)',
                    boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="text-center mt-8 text-cyan-400/60 text-sm">
        {gameState.phase === 'setup' && (
          <p>Drag ships to board • Press R to rotate • Right-click to rotate</p>
        )}
        {gameState.phase === 'playing' && gameState.turn === 'player' && (
          <p>Click on enemy waters to fire!</p>
        )}
      </div>
    </div>
  );
}
