import { OHLCV, BollingerBand, BollingerSettings } from '../types';

export function computeBollingerBands(
  data: OHLCV[],
  options: BollingerSettings
): BollingerBand[] {
  const { length, source, stdDevMultiplier, offset } = options;
  const result: BollingerBand[] = [];

  if (data.length < length) {
    return result;
  }

  for (let i = length - 1; i < data.length; i++) {
    // Get the source values for SMA calculation
    const sourceValues = data
      .slice(i - length + 1, i + 1)
      .map(candle => candle[source]);

    // Calculate SMA (Simple Moving Average)
    const sma = sourceValues.reduce((sum, value) => sum + value, 0) / length;

    // Calculate Standard Deviation (using population method)
    const variance = sourceValues.reduce((sum, value) => {
      const diff = value - sma;
      return sum + (diff * diff);
    }, 0) / length;
    
    const stdDev = Math.sqrt(variance);

    // Calculate Bollinger Bands
    const upper = sma + (stdDev * stdDevMultiplier);
    const lower = sma - (stdDev * stdDevMultiplier);

    // Apply offset by adjusting the index
    const targetIndex = Math.min(i + offset, data.length - 1);
    const targetTimestamp = data[Math.max(0, targetIndex)].timestamp;

    result.push({
      timestamp: targetTimestamp,
      upper,
      middle: sma,
      lower
    });
  }

  return result;
}