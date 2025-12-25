'use client';

import { ShipType } from '../game/types';

interface PixelShipProps {
  type: ShipType;
  size: number;
  isHorizontal: boolean;
  isPlaced?: boolean;
  isSunk?: boolean;
  scale?: number;
}

// Realistic military ship designs with proper naval architecture
// Color codes: H=hull highlight, L=hull light, M=hull mid, D=hull dark, S=shadow/water
// B=bridge, W=window, K=deck, T=turret, A=antenna, F=funnel, R=radar

export default function PixelShip({ 
  type, 
  size, 
  isHorizontal, 
  isPlaced = false,
  isSunk = false,
  scale = 1 
}: PixelShipProps) {
  const pixelSize = 2 * scale;
  
  const getShipPixels = (): { pixels: string[][], width: number, height: number } => {
    switch (type) {
      case 'carrier':
        // Aircraft carrier - realistic with angled flight deck, island, radar arrays
        return {
          pixels: [
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'A', 'A', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'D', 'R', 'R', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'D', 'B', 'W', 'W', 'B', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'D', 'B', 'B', 'B', 'B', 'D', 'A', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'D', 'B', 'L', 'L', 'L', 'L', 'B', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
            ['D', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'D'],
            ['H', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'H'],
            ['H', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'H'],
            ['M', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'M'],
            ['M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M'],
            ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
            ['', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', ''],
          ],
          width: 40,
          height: 13
        };
      case 'battleship':
        // Battleship - heavy armor, multiple gun turrets, command tower
        return {
          pixels: [
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'A', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'D', 'R', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', 'D', 'B', 'W', 'B', 'D', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', 'T', 'T', '', '', '', '', '', '', 'D', 'B', 'L', 'L', 'L', 'B', 'D', '', '', '', '', '', '', '', 'T', 'T', '', '', '', ''],
            ['', '', '', 'D', 'T', 'T', 'D', '', '', '', '', 'D', 'B', 'L', 'H', 'H', 'H', 'L', 'B', 'D', '', '', '', '', '', 'D', 'T', 'T', 'D', '', '', ''],
            ['', '', 'D', 'L', 'T', 'T', 'L', 'D', '', '', 'D', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'D', '', '', '', 'D', 'L', 'T', 'T', 'L', 'D', '', ''],
            ['D', 'D', 'K', 'K', 'K', 'K', 'K', 'K', 'D', 'D', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'D', 'D', 'D', 'K', 'K', 'K', 'K', 'K', 'K', 'D', 'D'],
            ['H', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'H'],
            ['H', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'H'],
            ['M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M'],
            ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
            ['', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', ''],
          ],
          width: 32,
          height: 12
        };
      case 'cruiser':
        // Cruiser - sleek guided missile cruiser with radar dome
        return {
          pixels: [
            ['', '', '', '', '', '', '', '', '', '', '', '', 'A', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', 'D', 'R', 'D', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', 'D', 'B', 'W', 'B', 'D', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', 'D', 'B', 'L', 'L', 'L', 'B', 'D', '', '', '', '', '', '', '', ''],
            ['', '', '', 'T', 'T', '', '', '', 'D', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'D', '', '', '', '', 'T', 'T', ''],
            ['', '', 'D', 'T', 'T', 'D', 'D', 'D', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'D', 'D', 'D', 'D', 'T', 'T', 'D'],
            ['D', 'D', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
            ['H', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'H'],
            ['M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M'],
            ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
            ['', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', ''],
          ],
          width: 24,
          height: 11
        };
      case 'submarine':
        // Submarine - sleek teardrop hull with sail (conning tower)
        return {
          pixels: [
            ['', '', '', '', '', '', '', '', '', '', 'A', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', 'D', 'D', 'D', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', 'D', 'B', 'W', 'B', 'D', '', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', 'D', 'M', 'L', 'L', 'L', 'M', 'D', '', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', 'D', 'D', 'D', 'M', 'L', 'H', 'H', 'H', 'L', 'M', 'D', 'D', 'D', 'D', 'D', '', '', '', '', ''],
            ['', '', '', 'D', 'M', 'L', 'L', 'L', 'H', 'H', 'H', 'H', 'H', 'L', 'L', 'L', 'L', 'L', 'M', 'D', '', '', '', ''],
            ['', '', 'D', 'M', 'L', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'L', 'M', 'D', '', '', ''],
            ['', 'D', 'M', 'L', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'L', 'M', 'D', '', ''],
            ['D', 'M', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'M', 'D', ''],
            ['', 'D', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'D', '', ''],
            ['', '', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', '', '', ''],
            ['', '', '', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', '', '', '', ''],
          ],
          width: 24,
          height: 12
        };
      case 'destroyer':
        // Destroyer - fast, agile with single gun turret
        return {
          pixels: [
            ['', '', '', '', '', '', '', '', '', 'A', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', 'D', 'R', 'D', '', '', '', '', ''],
            ['', '', '', '', '', '', '', 'D', 'B', 'W', 'B', 'D', '', '', '', ''],
            ['', '', '', 'T', 'T', '', '', 'D', 'L', 'L', 'L', 'D', '', '', '', ''],
            ['', '', 'D', 'T', 'T', 'D', 'D', 'K', 'K', 'K', 'K', 'K', 'D', 'D', 'D', 'D'],
            ['D', 'D', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
            ['H', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'H'],
            ['M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M'],
            ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
            ['', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', ''],
          ],
          width: 16,
          height: 10
        };
      default:
        return { pixels: [], width: 0, height: 0 };
    }
  };

  const getPixelColor = (pixel: string): string => {
    if (isSunk) {
      switch (pixel) {
        case 'H': return '#3a3a3a';
        case 'L': return '#2a2a2a';
        case 'M': return '#1a1a1a';
        case 'D': return '#0a0a0a';
        case 'S': return '#050505';
        case 'W': return '#2a2a3a';
        case 'A': return '#1a1a1a';
        case 'R': return '#2a1a1a';
        case 'B': return '#1a1a1a';
        case 'K': return '#2a2a2a';
        case 'T': return '#252525';
        case 'F': return '#1a1a1a';
        default: return 'transparent';
      }
    }
    if (isPlaced) {
      switch (pixel) {
        case 'H': return '#8090a0'; // Hull highlight
        case 'L': return '#607080'; // Hull light
        case 'M': return '#405060'; // Hull mid
        case 'D': return '#203040'; // Hull dark
        case 'S': return '#102030'; // Shadow/water
        case 'W': return '#4080c0'; // Window - blue
        case 'A': return '#505050'; // Antenna
        case 'R': return '#804040'; // Radar dome - red
        case 'B': return '#506070'; // Bridge
        case 'K': return '#708090'; // Deck
        case 'T': return '#606060'; // Turret
        case 'F': return '#404040'; // Funnel
        default: return 'transparent';
      }
    }
    // Active ship colors - realistic naval gray with 3D shading
    switch (pixel) {
      case 'H': return '#9aa8b8'; // Hull highlight - brightest
      case 'L': return '#708090'; // Hull light - slate gray
      case 'M': return '#506070'; // Hull mid
      case 'D': return '#304050'; // Hull dark
      case 'S': return '#1a3040'; // Shadow/water reflection
      case 'W': return '#60a0e0'; // Window - bright blue glass
      case 'A': return '#606060'; // Antenna - gray
      case 'R': return '#c05050'; // Radar dome - red
      case 'B': return '#607080'; // Bridge superstructure
      case 'K': return '#8090a0'; // Deck - lighter gray
      case 'T': return '#707070'; // Turret - gun metal
      case 'F': return '#505050'; // Funnel - dark gray
      default: return 'transparent';
    }
  };

  const { pixels, width, height } = getShipPixels();
  
  const totalWidth = width * pixelSize;
  const totalHeight = height * pixelSize;

  return (
    <div 
      className="pixel-art"
      style={{
        width: isHorizontal ? totalWidth : totalHeight,
        height: isHorizontal ? totalHeight : totalWidth,
        transform: isHorizontal ? 'none' : 'rotate(90deg)',
        transformOrigin: 'center center',
        imageRendering: 'pixelated',
      }}
    >
      <svg 
        width={totalWidth} 
        height={totalHeight}
        viewBox={`0 0 ${width} ${height}`}
        style={{ imageRendering: 'pixelated' }}
      >
        {pixels.map((row, y) =>
          row.map((pixel, x) => {
            if (!pixel) return null;
            return (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1}
                height={1}
                fill={getPixelColor(pixel)}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}

// Smaller version for the ship list/dock
export function PixelShipMini({ 
  type, 
  size,
  isHorizontal = true,
  isSunk = false 
}: { 
  type: ShipType; 
  size: number;
  isHorizontal?: boolean;
  isSunk?: boolean;
}) {
  return (
    <PixelShip 
      type={type} 
      size={size} 
      isHorizontal={isHorizontal}
      isSunk={isSunk}
      scale={0.7}
    />
  );
}
