export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BollingerBand {
  timestamp: number;
  upper: number;
  middle: number;
  lower: number;
}

export interface BollingerSettings {
  length: number;
  maType: 'SMA';
  source: 'close' | 'open' | 'high' | 'low';
  stdDevMultiplier: number;
  offset: number;
  middleBand: BandStyle;
  upperBand: BandStyle;
  lowerBand: BandStyle;
  backgroundFill: {
    show: boolean;
    opacity: number;
    color: string;
  };
}

export interface BandStyle {
  show: boolean;
  color: string;
  lineWidth: number;
  lineStyle: 'solid' | 'dashed';
}

export const defaultBollingerSettings: BollingerSettings = {
  length: 20,
  maType: 'SMA',
  source: 'close',
  stdDevMultiplier: 2,
  offset: 0,
  middleBand: {
    show: true,
    color: '#3B82F6',
    lineWidth: 1,
    lineStyle: 'solid'
  },
  upperBand: {
    show: true,
    color: '#10B981',
    lineWidth: 1,
    lineStyle: 'solid'
  },
  lowerBand: {
    show: true,
    color: '#EF4444',
    lineWidth: 1,
    lineStyle: 'solid'
  },
  backgroundFill: {
    show: true,
    opacity: 0.1,
    color: '#3B82F6'
  }
};