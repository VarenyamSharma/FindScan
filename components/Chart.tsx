'use client';

import { useEffect, useRef, useState } from 'react';
import { init, dispose } from 'klinecharts';
import { OHLCV, BollingerSettings, defaultBollingerSettings } from '@/lib/types';
import { computeBollingerBands } from '@/lib/indicators/bollinger';
import { useTheme } from 'next-themes';

interface ChartProps {
  data: OHLCV[];
  settings: BollingerSettings;
  onCrosshairChange?: (data: any) => void;
}

export default function Chart({ data, settings, onCrosshairChange }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !chartRef.current) return;

  console.debug('[Chart] initializing (isClient, data.length):', isClient, data?.length);

    const isDark = theme === 'dark';
    const gridColor = isDark ? '#ffffff1a' : '#0000001a';
    const textColor = isDark ? '#8b949e' : '#6b7280';
    const backgroundColor = isDark ? '#1e1e1e' : '#ffffff';
    const borderColor = isDark ? '#3f4254' : '#e5e7eb';

    // Initialize chart
    chartInstance.current = init(chartRef.current);

    // Configure chart options
    chartInstance.current.setStyles({
      grid: {
        show: true,
        horizontal: {
          color: gridColor,
        },
        vertical: {
          color: gridColor,
        },
      },
      candle: {
        type: 'candle_solid',
        bar: {
          upColor: '#26a69a',
          downColor: '#ef5350',
          noChangeColor: '#888888',
        },
        tooltip: {
          showRule: 'always',
          showType: 'standard',
          labels: ['T: ', 'O: ', 'C: ', 'H: ', 'L: ', 'V: '],
          values: null,
          defaultValue: 'n/a',
          rect: {
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 6,
            offsetLeft: 8,
            offsetTop: 8,
            offsetRight: 8,
            offsetBottom: 8,
            borderRadius: 4,
            borderSize: 1,
            borderColor: '#3f4254',
          },
          borderColor: borderColor,
          color: backgroundColor,
          text: {
            size: 12,
            family: 'Roboto',
            weight: 'normal',
            color: textColor,
          },
        }
      },
      xAxis: {
        axisLine: {
          color: gridColor,
        },
        tickText: {
          color: textColor,
        },
        tickLine: {
          color: gridColor,
        }
      },
      yAxis: {
        axisLine: {
          color: gridColor,
        },
        tickText: {
          color: textColor,
        },
        tickLine: {
          color: gridColor,
        }
      },
      separator: {
        color: gridColor,
      },
      crosshair: {
        show: true,
        horizontal: {
          line: {
            color: isDark ? '#ffffff99' : '#00000099',
            style: 'dashed'
          },
          text: {
            color: isDark ? '#ffffff' : '#000000',
            backgroundColor: isDark ? '#686d76' : '#9ca3af'
          }
        },
        vertical: {
          line: {
            color: isDark ? '#ffffff99' : '#00000099',
            style: 'dashed'
          },
          text: {
            color: isDark ? '#ffffff' : '#000000',
            backgroundColor: isDark ? '#686d76' : '#9ca3af'
          }
        }
      }
    });

    // Set up crosshair callback
    if (onCrosshairChange) {
      chartInstance.current.subscribeAction('crosshairChange', onCrosshairChange);
    }

    // If data was already loaded before chart init, apply it now
    if (data && data.length) {
      console.debug('[Chart] applying initial data, points:', data.length);
      // Apply data and overlays
      const chartData = data.map(item => ({
        timestamp: item.timestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }));

      chartInstance.current.applyNewData(chartData);

  console.debug('[Chart] applied initial data to chart');

      const bollingerData = computeBollingerBands(data, settings);
      const indicatorData = bollingerData.map(item => ({
        timestamp: item.timestamp,
        upper: item.upper,
        middle: item.middle,
        lower: item.lower,
      }));

      chartInstance.current.removeOverlay();
      if (bollingerData.length > 0) {
        chartInstance.current.createOverlay({
          name: 'bollinger',
          totalStep: 1,
          needDefaultPointFigure: true,
          needDefaultXAxisFigure: true,
          needDefaultYAxisFigure: true,
          mode: 'normal',
          modeSensitivity: 8,
          points: indicatorData,
          draw: ({ ctx, barSpace, visibleRange }: any) => {
            const { from, to } = visibleRange;
            ctx.save();
            for (let i = from; i < to; i++) {
              const dataPoint = indicatorData[i];
              if (!dataPoint) continue;
              const x = barSpace.bar * (i + 0.5);
              const upperY = barSpace.convertToPixel(dataPoint.upper);
              const middleY = barSpace.convertToPixel(dataPoint.middle);
              const lowerY = barSpace.convertToPixel(dataPoint.lower);

              if (settings.backgroundFill.show && i < to - 1) {
                const nextData = indicatorData[i + 1];
                if (nextData) {
                  const nextX = barSpace.bar * (i + 1.5);
                  const nextUpperY = barSpace.convertToPixel(nextData.upper);
                  const nextLowerY = barSpace.convertToPixel(nextData.lower);

                  ctx.fillStyle = `${settings.backgroundFill.color}${Math.round(settings.backgroundFill.opacity * 255).toString(16).padStart(2, '0')}`;
                  ctx.beginPath();
                  ctx.moveTo(x, upperY);
                  ctx.lineTo(nextX, nextUpperY);
                  ctx.lineTo(nextX, nextLowerY);
                  ctx.lineTo(x, lowerY);
                  ctx.closePath();
                  ctx.fill();
                }
              }

              if (settings.upperBand.show && i < to - 1) {
                const nextData = indicatorData[i + 1];
                if (nextData) {
                  const nextX = barSpace.bar * (i + 1.5);
                  const nextUpperY = barSpace.convertToPixel(nextData.upper);
                  ctx.strokeStyle = settings.upperBand.color;
                  ctx.lineWidth = settings.upperBand.lineWidth;
                  ctx.setLineDash(settings.upperBand.lineStyle === 'dashed' ? [5, 5] : []);
                  ctx.beginPath();
                  ctx.moveTo(x, upperY);
                  ctx.lineTo(nextX, nextUpperY);
                  ctx.stroke();
                }
              }

              if (settings.middleBand.show && i < to - 1) {
                const nextData = indicatorData[i + 1];
                if (nextData) {
                  const nextX = barSpace.bar * (i + 1.5);
                  const nextMiddleY = barSpace.convertToPixel(nextData.middle);
                  ctx.strokeStyle = settings.middleBand.color;
                  ctx.lineWidth = settings.middleBand.lineWidth;
                  ctx.setLineDash(settings.middleBand.lineStyle === 'dashed' ? [5, 5] : []);
                  ctx.beginPath();
                  ctx.moveTo(x, middleY);
                  ctx.lineTo(nextX, nextMiddleY);
                  ctx.stroke();
                }
              }

              if (settings.lowerBand.show && i < to - 1) {
                const nextData = indicatorData[i + 1];
                if (nextData) {
                  const nextX = barSpace.bar * (i + 1.5);
                  const nextLowerY = barSpace.convertToPixel(nextData.lower);
                  ctx.strokeStyle = settings.lowerBand.color;
                  ctx.lineWidth = settings.lowerBand.lineWidth;
                  ctx.setLineDash(settings.lowerBand.lineStyle === 'dashed' ? [5, 5] : []);
                  ctx.beginPath();
                  ctx.moveTo(x, lowerY);
                  ctx.lineTo(nextX, nextLowerY);
                  ctx.stroke();
                }
              }
            }
            ctx.restore();
            return true;
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        if (chartRef.current) dispose(chartRef.current);
        chartInstance.current = null;
      }
    };
  }, [isClient, onCrosshairChange, theme]);

  // Update chart data and indicators
  useEffect(() => {
    if (!chartInstance.current || !data.length) return;

    // Convert OHLCV data to KLineChart format
    const chartData = data.map(item => ({
      timestamp: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    // Apply data to chart
    chartInstance.current.applyNewData(chartData);

    // Calculate Bollinger Bands
    const bollingerData = computeBollingerBands(data, settings);

    // Create indicator data
    const indicatorData = bollingerData.map(item => ({
      timestamp: item.timestamp,
      upper: item.upper,
      middle: item.middle,
      lower: item.lower,
    }));

    // Remove existing Bollinger Bands indicator
    chartInstance.current.removeOverlay();

    // Add Bollinger Bands as overlay
    if (bollingerData.length > 0) {
      chartInstance.current.createOverlay({
        name: 'bollinger',
        totalStep: 1,
        needDefaultPointFigure: true,
        needDefaultXAxisFigure: true,
        needDefaultYAxisFigure: true,
        mode: 'normal',
        modeSensitivity: 8,
        points: indicatorData,
        draw: ({ ctx, barSpace, visibleRange }: any) => {
          const { from, to } = visibleRange;
          
          ctx.save();
          
          for (let i = from; i < to; i++) {
            const data = indicatorData[i];
            if (!data) continue;

            const x = barSpace.bar * (i + 0.5);
            const upperY = barSpace.convertToPixel(data.upper);
            const middleY = barSpace.convertToPixel(data.middle);
            const lowerY = barSpace.convertToPixel(data.lower);

            // Draw background fill
            if (settings.backgroundFill.show && i < to - 1) {
              const nextData = indicatorData[i + 1];
              if (nextData) {
                const nextX = barSpace.bar * (i + 1.5);
                const nextUpperY = barSpace.convertToPixel(nextData.upper);
                const nextLowerY = barSpace.convertToPixel(nextData.lower);

                ctx.fillStyle = `${settings.backgroundFill.color}${Math.round(settings.backgroundFill.opacity * 255).toString(16).padStart(2, '0')}`;
                ctx.beginPath();
                ctx.moveTo(x, upperY);
                ctx.lineTo(nextX, nextUpperY);
                ctx.lineTo(nextX, nextLowerY);
                ctx.lineTo(x, lowerY);
                ctx.closePath();
                ctx.fill();
              }
            }

            // Draw upper band
            if (settings.upperBand.show && i < to - 1) {
              const nextData = indicatorData[i + 1];
              if (nextData) {
                const nextX = barSpace.bar * (i + 1.5);
                const nextUpperY = barSpace.convertToPixel(nextData.upper);
                
                ctx.strokeStyle = settings.upperBand.color;
                ctx.lineWidth = settings.upperBand.lineWidth;
                ctx.setLineDash(settings.upperBand.lineStyle === 'dashed' ? [5, 5] : []);
                ctx.beginPath();
                ctx.moveTo(x, upperY);
                ctx.lineTo(nextX, nextUpperY);
                ctx.stroke();
              }
            }

            // Draw middle band
            if (settings.middleBand.show && i < to - 1) {
              const nextData = indicatorData[i + 1];
              if (nextData) {
                const nextX = barSpace.bar * (i + 1.5);
                const nextMiddleY = barSpace.convertToPixel(nextData.middle);
                
                ctx.strokeStyle = settings.middleBand.color;
                ctx.lineWidth = settings.middleBand.lineWidth;
                ctx.setLineDash(settings.middleBand.lineStyle === 'dashed' ? [5, 5] : []);
                ctx.beginPath();
                ctx.moveTo(x, middleY);
                ctx.lineTo(nextX, nextMiddleY);
                ctx.stroke();
              }
            }

            // Draw lower band
            if (settings.lowerBand.show && i < to - 1) {
              const nextData = indicatorData[i + 1];
              if (nextData) {
                const nextX = barSpace.bar * (i + 1.5);
                const nextLowerY = barSpace.convertToPixel(nextData.lower);
                
                ctx.strokeStyle = settings.lowerBand.color;
                ctx.lineWidth = settings.lowerBand.lineWidth;
                ctx.setLineDash(settings.lowerBand.lineStyle === 'dashed' ? [5, 5] : []);
                ctx.beginPath();
                ctx.moveTo(x, lowerY);
                ctx.lineTo(nextX, nextLowerY);
                ctx.stroke();
              }
            }
          }
          
          ctx.restore();
          return true;
        }
      });
    }
  }, [data, settings]);

  if (!isClient) {
    return <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />;
  }

  return (
    <div className="w-full h-96 bg-muted rounded-lg overflow-hidden border">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}