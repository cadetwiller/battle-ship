'use client';

import { Ship } from '../game/types';
import { memo } from 'react';

interface DraggableShipProps {
  ship: Ship;
  isPlaced: boolean;
  isSelected: boolean;
  isHorizontal: boolean;
  onDragStart: (ship: Ship) => void;
  onClick: (ship: Ship) => void;
  onRotate: () => void;
}

const DraggableShip = memo(function DraggableShip({
  ship,
  isPlaced,
  isSelected,
  isHorizontal,
  onDragStart,
  onClick,
  onRotate,
}: DraggableShipProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('shipType', ship.type);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(ship);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(ship);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSelected) {
      onRotate();
    }
  };

  // Gray plastic ship piece component
  const PlasticShip = ({ cellCount, horizontal = true }: { cellCount: number, horizontal?: boolean }) => (
    <div 
      className={`flex ${horizontal ? 'flex-row' : 'flex-col'} gap-[1px]`}
    >
      {Array.from({ length: cellCount }, (_, i) => (
        <div
          key={i}
          className="w-5 h-5 rounded-sm relative"
          style={{
            background: isPlaced 
              ? 'linear-gradient(145deg, #606060 0%, #404040 100%)'
              : 'linear-gradient(145deg, #909090 0%, #606060 30%, #505050 100%)',
            boxShadow: isPlaced
              ? 'inset 1px 1px 1px rgba(255,255,255,0.1)'
              : 'inset 2px 2px 3px rgba(255,255,255,0.3), inset -1px -1px 2px rgba(0,0,0,0.2), 1px 1px 3px rgba(0,0,0,0.3)',
            border: `1px solid ${isPlaced ? '#303030' : '#404040'}`,
          }}
        >
          {/* Deck detail on middle cells */}
          {i > 0 && i < cellCount - 1 && (
            <div 
              className="absolute top-[30%] left-[15%] right-[15%] h-[20%] rounded-sm"
              style={{
                background: isPlaced ? '#505050' : 'linear-gradient(180deg, #707070 0%, #505050 100%)',
              }}
            />
          )}
          {/* Bridge on one cell */}
          {i === Math.floor(cellCount / 2) && (
            <div 
              className="absolute top-[10%] left-[20%] right-[30%] h-[40%] rounded-t-sm"
              style={{
                background: isPlaced ? '#555555' : 'linear-gradient(180deg, #808080 0%, #606060 100%)',
                boxShadow: isPlaced ? 'none' : '1px 1px 2px rgba(0,0,0,0.2)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  if (isPlaced) {
    return (
      <div 
        className="flex items-center gap-2 p-2 rounded opacity-50 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a3a4a 0%, #0a2a3a 100%)',
          border: '1px solid #2a4a5a',
        }}
      >
        <PlasticShip cellCount={ship.size} />
        <span className="text-xs capitalize text-gray-500 line-through truncate flex-1">
          {ship.type}
        </span>
        <span className="text-[10px] text-green-400 font-bold whitespace-nowrap">✓</span>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      className="flex flex-col p-2 rounded cursor-grab active:cursor-grabbing transition-all duration-200 select-none overflow-hidden"
      style={{
        background: isSelected 
          ? 'linear-gradient(180deg, #2a5a7a 0%, #1a4a6a 100%)'
          : 'linear-gradient(180deg, #1a4a5a 0%, #0a3a4a 100%)',
        boxShadow: isSelected 
          ? '0 0 12px rgba(100,200,255,0.4), inset 2px 2px 4px rgba(255,255,255,0.1)'
          : 'inset 1px 1px 2px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.2)',
        border: isSelected ? '2px solid #60a0c0' : '1px solid #2a5a6a',
      }}
    >
      {/* Ship name and info - above the ship */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs capitalize text-cyan-100 font-medium">
          {ship.type}
        </span>
        <span className="text-[10px] text-cyan-300/60">
          {ship.size} cells
        </span>
      </div>

      {/* Plastic ship visual */}
      <div className="flex items-center justify-between">
        <PlasticShip cellCount={ship.size} horizontal={isSelected ? isHorizontal : true} />
        {/* Rotation indicator when selected */}
        {isSelected && (
          <span className="text-cyan-300 font-bold text-sm ml-2">{isHorizontal ? '↔' : '↕'}</span>
        )}
      </div>
    </div>
  );
});

export default DraggableShip;
