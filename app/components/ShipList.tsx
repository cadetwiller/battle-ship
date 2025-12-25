'use client';

import { Ship, SHIP_CONFIGS } from '../game/types';

interface ShipListProps {
  ships: Ship[];
  title: string;
  currentShipIndex?: number;
}

export default function ShipList({ ships, title, currentShipIndex }: ShipListProps) {
  return (
    <div className="bg-gray-900/80 rounded-lg p-4 border-2 border-cyan-700">
      <h3 className="text-lg font-bold text-cyan-300 mb-3 retro-text">{title}</h3>
      <div className="space-y-2">
        {ships.map((ship, index) => (
          <div
            key={ship.type}
            className={`
              flex items-center gap-3 p-2 rounded transition-all
              ${ship.sunk ? 'opacity-40' : ''}
              ${currentShipIndex === index ? 'bg-cyan-900/50 ring-2 ring-cyan-400' : ''}
            `}
          >
            {/* Ship visual */}
            <div className="flex gap-0.5">
              {Array.from({ length: ship.size }, (_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm"
                  style={{
                    background: ship.sunk 
                      ? '#666' 
                      : `linear-gradient(135deg, ${ship.color} 0%, ${ship.color}cc 100%)`,
                    boxShadow: ship.sunk 
                      ? 'none' 
                      : 'inset 1px 1px 2px rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>
            
            {/* Ship name */}
            <span className={`
              text-sm font-mono capitalize flex-1
              ${ship.sunk ? 'text-gray-500 line-through' : 'text-gray-200'}
            `}>
              {ship.type}
            </span>
            
            {/* Status */}
            {ship.sunk && (
              <span className="text-xs text-red-500 font-bold">SUNK</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
