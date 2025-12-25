'use client';

import { Cell as CellType, ShipType } from '../game/types';
import { useState, useEffect, memo } from 'react';

interface CellProps {
  cell: CellType;
  onClick?: () => void;
  onHover?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isPlayerBoard: boolean;
  isPreview?: boolean;
  isValidPreview?: boolean;
  showShips?: boolean;
}

const Cell = memo(function Cell({ 
  cell, 
  onClick,
  onHover,
  onDragOver,
  onDrop,
  isPlayerBoard, 
  isPreview = false,
  isValidPreview = true,
  showShips = false 
}: CellProps) {
  const [showExplosion, setShowExplosion] = useState(false);
  const [explosionFrame, setExplosionFrame] = useState(0);

  useEffect(() => {
    if (cell.hasExplosion && cell.state === 'hit') {
      setShowExplosion(true);
      setExplosionFrame(0);
      
      const frameInterval = setInterval(() => {
        setExplosionFrame(prev => {
          if (prev >= 7) {
            clearInterval(frameInterval);
            setTimeout(() => setShowExplosion(false), 200);
            return prev;
          }
          return prev + 1;
        });
      }, 80);

      return () => clearInterval(frameInterval);
    }
  }, [cell.hasExplosion, cell.state]);

  const isShipVisible = (isPlayerBoard && (cell.state === 'ship' || cell.state === 'hit')) || 
                        (!isPlayerBoard && cell.state === 'hit' && cell.shipType) ||
                        (showShips && cell.state === 'ship');

  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`
        relative w-8 h-8 sm:w-10 sm:h-10
        cursor-pointer transition-all duration-150
        ${onClick ? 'hover:brightness-110' : ''}
        overflow-hidden
      `}
      style={{
        background: 'linear-gradient(145deg, #2a6080 0%, #1a4a6a 50%, #0a3a5a 100%)',
        boxShadow: 'inset 1px 1px 2px rgba(100,180,220,0.3), inset -1px -1px 2px rgba(0,0,0,0.4)',
        borderRadius: '2px',
      }}
    >
      {/* Circular peg hole - like the board game */}
      <div 
        className="absolute inset-[15%] rounded-full"
        style={{
          background: 'linear-gradient(180deg, #0a2a4a 0%, #1a4a6a 40%, #2a5a7a 100%)',
          boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.6), inset -1px -1px 2px rgba(100,180,220,0.2)',
        }}
      />

      {/* Water texture inside the hole */}
      {!isShipVisible && cell.state !== 'miss' && cell.state !== 'hit' && !isPreview && (
        <div 
          className="absolute inset-[18%] rounded-full overflow-hidden water-cell"
          style={{ opacity: 0.6 }}
        />
      )}

      {/* Gray plastic ship piece - simplified for performance */}
      {isShipVisible && (
        <div 
          className="absolute inset-[12%] rounded-sm"
          style={{
            background: 'linear-gradient(145deg, #808080 0%, #606060 50%, #505050 100%)',
            boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3), inset -1px -1px 2px rgba(0,0,0,0.3)',
            border: '1px solid #404040',
          }}
        />
      )}

      {/* Preview overlay for placement */}
      {isPreview && (
        <div 
          className="absolute inset-[15%] rounded-full"
          style={{ 
            backgroundColor: isValidPreview ? 'rgba(100, 200, 100, 0.6)' : 'rgba(200, 100, 100, 0.6)',
            boxShadow: isValidPreview 
              ? '0 0 8px rgba(100, 200, 100, 0.8)' 
              : '0 0 8px rgba(200, 100, 100, 0.8)',
          }}
        />
      )}

      {/* Red peg for HIT - like the board game */}
      {cell.state === 'hit' && !showExplosion && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div 
            className="w-[55%] h-[55%] rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #ff6060 0%, #cc2020 50%, #aa0000 100%)',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.5), inset 2px 2px 4px rgba(255,150,150,0.4)',
              border: '1px solid #880000',
            }}
          />
        </div>
      )}

      {/* White peg for MISS - like the board game */}
      {cell.state === 'miss' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-[55%] h-[55%] rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #e0e0e0 50%, #c0c0c0 100%)',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.6)',
              border: '1px solid #a0a0a0',
            }}
          />
        </div>
      )}

      {/* Explosion Animation */}
      {showExplosion && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <ExplosionSprite frame={explosionFrame} />
        </div>
      )}
    </div>
  );
});

export default Cell;

function ExplosionSprite({ frame }: { frame: number }) {
  const explosionFrames = [
    // Frame 0 - small spark
    <div key={0} className="w-2 h-2 bg-yellow-300 pixel-art" />,
    // Frame 1 - growing
    <div key={1} className="w-4 h-4 bg-yellow-400 pixel-art animate-pixel-grow">
      <div className="absolute inset-1 bg-orange-500" />
    </div>,
    // Frame 2 - expanding
    <div key={2} className="w-6 h-6 relative pixel-art">
      <div className="absolute inset-0 bg-orange-500" />
      <div className="absolute inset-1 bg-yellow-400" />
      <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1 bg-red-500" />
      <div className="absolute bottom-0 left-1/2 w-2 h-2 -translate-x-1/2 translate-y-1 bg-red-500" />
    </div>,
    // Frame 3 - full explosion
    <div key={3} className="w-8 h-8 relative pixel-art">
      <div className="absolute inset-1 bg-red-600" />
      <div className="absolute inset-2 bg-orange-500" />
      <div className="absolute inset-3 bg-yellow-300" />
      <div className="absolute top-0 left-1/2 w-2 h-3 -translate-x-1/2 -translate-y-1 bg-orange-600" />
      <div className="absolute bottom-0 left-1/2 w-2 h-3 -translate-x-1/2 translate-y-1 bg-orange-600" />
      <div className="absolute left-0 top-1/2 w-3 h-2 -translate-y-1/2 -translate-x-1 bg-orange-600" />
      <div className="absolute right-0 top-1/2 w-3 h-2 -translate-y-1/2 translate-x-1 bg-orange-600" />
    </div>,
    // Frame 4 - peak with particles
    <div key={4} className="w-10 h-10 relative pixel-art">
      <div className="absolute inset-2 bg-red-500" />
      <div className="absolute inset-3 bg-orange-400" />
      <div className="absolute inset-4 bg-yellow-200" />
      <div className="absolute top-0 left-2 w-1 h-1 bg-yellow-400" />
      <div className="absolute top-1 right-1 w-1 h-1 bg-orange-500" />
      <div className="absolute bottom-0 right-2 w-1 h-1 bg-red-400" />
      <div className="absolute bottom-1 left-1 w-1 h-1 bg-yellow-500" />
    </div>,
    // Frame 5 - fading
    <div key={5} className="w-8 h-8 relative pixel-art opacity-80">
      <div className="absolute inset-1 bg-red-400/80" />
      <div className="absolute inset-2 bg-orange-400/70" />
      <div className="absolute top-0 left-3 w-1 h-1 bg-gray-500" />
      <div className="absolute bottom-0 right-2 w-1 h-1 bg-gray-600" />
    </div>,
    // Frame 6 - smoke
    <div key={6} className="w-6 h-6 relative pixel-art opacity-60">
      <div className="absolute inset-0 bg-gray-500/60 rounded-full" />
      <div className="absolute inset-1 bg-gray-400/50 rounded-full" />
    </div>,
    // Frame 7 - dissipating
    <div key={7} className="w-4 h-4 relative pixel-art opacity-30">
      <div className="absolute inset-0 bg-gray-400/40 rounded-full" />
    </div>,
  ];

  return explosionFrames[frame] || null;
}
